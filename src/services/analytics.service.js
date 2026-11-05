import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";

export class AnalyticsService {
  static async getDashboardMetrics() {
    // 1. Overview counts
    const [totalDoctors, totalPatients, statusCounts, recentPatients] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Patient.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Patient.find()
        .populate("doctorId", "name specialization hospital")
        .sort({ admissionDate: -1, createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // Format status breakdown
    const statusMap = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const activePatients = statusMap["Active"] || 0;
    const underObservation = statusMap["Under Observation"] || 0;
    const recoveredPatients = statusMap["Recovered"] || 0;
    const dischargedPatients = statusMap["Discharged"] || 0;

    const avgPatientsPerDoctor =
      totalDoctors > 0 ? parseFloat((totalPatients / totalDoctors).toFixed(1)) : 0;

    // 2. Patients per doctor distribution (Top 8 doctors for bar chart)
    const patientsPerDoctor = await Doctor.aggregate([
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "doctorId",
          as: "patientList",
        },
      },
      {
        $project: {
          name: 1,
          specialization: 1,
          hospital: 1,
          patientCount: { $size: "$patientList" },
        },
      },
      { $sort: { patientCount: -1, name: 1 } },
      { $limit: 8 },
    ]);

    // 3. Date-based statistics (admissions grouped by month/date over last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const admissionsByDate = await Patient.aggregate([
      {
        $match: {
          admissionDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$admissionDate" },
            month: { $month: "$admissionDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Map month numbers to readable strings (e.g. "Jan", "Feb", "Mar")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const admissionsOverTime = admissionsByDate.map((item) => ({
      period: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      admissions: item.count,
    }));

    // 4. Condition / Specialization Breakdown (Pie / Doughnut Chart)
    const conditionBreakdown = await Patient.aggregate([
      {
        $group: {
          _id: "$condition",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]).then((res) =>
      res.map((item) => ({
        condition: item._id,
        count: item.count,
      }))
    );

    return {
      overview: {
        totalDoctors,
        totalPatients,
        avgPatientsPerDoctor,
        activePatients,
        underObservation,
        recoveredPatients,
        dischargedPatients,
      },
      patientsPerDoctor,
      admissionsOverTime,
      conditionBreakdown,
      statusBreakdown: [
        { status: "Active", count: activePatients },
        { status: "Under Observation", count: underObservation },
        { status: "Recovered", count: recoveredPatients },
        { status: "Discharged", count: dischargedPatients },
      ],
      recentPatients,
    };
  }
}
