import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Starting Database Seeding with Bangladeshi Healthcare Data...");

    // Clean existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    console.log("🧹 Cleaned old Users, Doctors, and Patients collections.");

    // 1. Create Default Admin User
    const adminUser = await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "admin123", // Will be hashed via pre-save hook
      role: "admin",
    });
    console.log(`👤 Created Admin User: ${adminUser.email} (Password: admin123)`);

    // 2. Realistic Bangladeshi Doctors Data
    const doctorsData = [
      {
        name: "Prof. Dr. A. K. M. Fazlul Haque",
        specialization: "General & Colorectal Surgery",
        hospital: "Bangabandhu Medical University (BSMMU)",
        phone: "+880 1711-234567",
        email: "dr.fazlul.haque@gmail.com",
      },
      {
        name: "Dr. Syeda Shahina Sobhan",
        specialization: "Cardiology",
        hospital: "National Institute (NICVD)",
        phone: "+880 1819-345678",
        email: "dr.shahina.sobhan@gmail.com",
      },
      {
        name: "Dr. Mohammad Mahbubur Rahman",
        specialization: "Neurology",
        hospital: "National Institute of Neurosciences & Hospital (NINH)",
        phone: "+880 1912-456789",
        email: "dr.mahbub.rahman@gmail.com",
      },
      {
        name: "Dr. Fatima Farzana",
        specialization: "Pediatrics",
        hospital: "Dhaka Medical College Hospital (DMCH)",
        phone: "+880 1552-567890",
        email: "dr.fatima.farzana@gmail.com",
      },
      {
        name: "Dr. Kazi Shafiul Alam",
        specialization: "Orthopedics",
        hospital: "Square Hospital, Dhaka",
        phone: "+880 1610-678901",
        email: "dr.shafiul.alam@gmail.com",
      },
      {
        name: "Dr. Nusrat Jahan",
        specialization: "Dermatology",
        hospital: "BIRDEM General Hospital",
        phone: "+880 1723-789012",
        email: "dr.nusrat.jahan@gmail.com",
      },
      {
        name: "Dr. Tanvir Ahmed Chowdhury",
        specialization: "Oncology",
        hospital: "Evercare Hospital Dhaka",
        phone: "+880 1834-890123",
        email: "dr.tanvir.chowdhury@gmail.com",
      },
      {
        name: "Dr. Rokeya Sultana",
        specialization: "Internal Medicine",
        hospital: "United Hospital, Gulshan",
        phone: "+880 1945-901234",
        email: "dr.rokeya.sultana@gmail.com",
      },
      {
        name: "Dr. Mahmudul Hasan Rifat",
        specialization: "Psychiatry",
        hospital: "Bangabandhu Medical (BSMMU)",
        phone: "+880 1756-012345",
        email: "dr.mahmudul.hasan@gmail.com",
      },
      {
        name: "Dr. Sadia Afrin",
        specialization: "Gastroenterology",
        hospital: "Popular Diagnostic Centre & Hospital",
        phone: "+880 1667-123456",
        email: "dr.sadia.afrin@gmail.com",
      },
      {
        name: "Dr. Ashraful Islam",
        specialization: "Nephrology",
        hospital: "Dhaka Medical College Hospital (DMCH)",
        phone: "+880 1778-234567",
        email: "dr.ashraful.islam@gmail.com",
      },
      {
        name: "Dr. Mehnaz Tabassum",
        specialization: "Endocrinology & Diabetology",
        hospital: "BIRDEM General Hospital",
        phone: "+880 1889-345678",
        email: "dr.mehnaz.tabassum@gmail.com",
      },
    ];

    const createdDoctors = await Doctor.insertMany(doctorsData);
    console.log(`👨‍⚕️ Created ${createdDoctors.length} Doctors with Bangladeshi profiles.`);

    // 3. Realistic Bangladeshi Patients Data
    const conditions = [
      "Type 2 Diabetes",
      "Hypertension",
      "Coronary Artery Disease",
      "Bronchial Asthma",
      "Dengue Fever",
      "Chronic Kidney Disease",
      "Migraine",
      "Peptic Ulcer Disease",
      "Osteoarthritis",
      "Eczema",
      "Generalized Anxiety Disorder",
      "Acute Appendicitis",
    ];

    const patientNames = [
      { name: "Md. Rafiqul Islam", gender: "Male", age: 54, phone: "+880 1711-829101" },
      { name: "Shamima Nasrin", gender: "Female", age: 42, phone: "+880 1819-738291" },
      { name: "Abdul Karim", gender: "Male", age: 68, phone: "+880 1912-647382" },
      { name: "Farhana Yeasmin", gender: "Female", age: 31, phone: "+880 1552-556473" },
      { name: "Tanvir Mahmud", gender: "Male", age: 26, phone: "+880 1610-465564" },
      { name: "Nusrat Sharmin", gender: "Female", age: 37, phone: "+880 1723-374655" },
      { name: "Mohammad Jahangir Alam", gender: "Male", age: 61, phone: "+880 1834-283746" },
      { name: "Rumpa Akhter", gender: "Female", age: 22, phone: "+880 1945-192837" },
      { name: "Golam Mostafa", gender: "Male", age: 73, phone: "+880 1756-081928" },
      { name: "Shirin Akter", gender: "Female", age: 49, phone: "+880 1667-970819" },
      { name: "Suman Talukder", gender: "Male", age: 35, phone: "+880 1778-869708" },
      { name: "Nahid Sultana", gender: "Female", age: 28, phone: "+880 1889-758697" },
      { name: "Mostofa Kamal", gender: "Male", age: 58, phone: "+880 1911-647586" },
      { name: "Fahmida Rahman", gender: "Female", age: 33, phone: "+880 1722-536475" },
      { name: "Anisur Rahman", gender: "Male", age: 46, phone: "+880 1833-425364" },
      { name: "Shahnaz Parvin", gender: "Female", age: 52, phone: "+880 1944-314253" },
      { name: "Kamrul Hasan", gender: "Male", age: 39, phone: "+880 1555-203142" },
      { name: "Salma Begum", gender: "Female", age: 65, phone: "+880 1666-192031" },
      { name: "Zahidul Haque", gender: "Male", age: 44, phone: "+880 1777-081920" },
      { name: "Afroza Khatun", gender: "Female", age: 29, phone: "+880 1888-970819" },
      { name: "Mizanur Rahman", gender: "Male", age: 50, phone: "+880 1999-869708" },
      { name: "Sabina Yasmin", gender: "Female", age: 40, phone: "+880 1712-758697" },
      { name: "Kazi Nazmul Huda", gender: "Male", age: 63, phone: "+880 1823-647586" },
      { name: "Tahmina Chowdhury", gender: "Female", age: 36, phone: "+880 1934-536475" },
      { name: "Asaduzzaman Noor", gender: "Male", age: 70, phone: "+880 1545-425364" },
      { name: "Rubina Islam", gender: "Female", age: 25, phone: "+880 1656-314253" },
      { name: "Saifuddin Ahmed", gender: "Male", age: 47, phone: "+880 1767-203142" },
      { name: "Jesmin Ara", gender: "Female", age: 38, phone: "+880 1878-192031" },
      { name: "Nurul Huda", gender: "Male", age: 59, phone: "+880 1989-081920" },
      { name: "Meherun Nesa", gender: "Female", age: 45, phone: "+880 1713-970819" },
      { name: "Tariqul Islam", gender: "Male", age: 32, phone: "+880 1824-869708" },
      { name: "Farzana Boby", gender: "Female", age: 27, phone: "+880 1935-758697" },
    ];

    const statuses = ["Active", "Under Observation", "Recovered", "Discharged"];

    // Distribute admissions across the last 6 months
    const patientsData = patientNames.map((p, idx) => {
      const assignedDoctor = createdDoctors[idx % createdDoctors.length];
      const condition = conditions[idx % conditions.length];
      const status = statuses[idx % statuses.length];

      // Generate dates between 150 days ago and today
      const daysAgo = Math.floor(Math.random() * 150);
      const admissionDate = new Date();
      admissionDate.setDate(admissionDate.getDate() - daysAgo);

      const notesTemplates = [
        `Regular clinical checkup. Glycemic level and blood pressure monitored under ${assignedDoctor.name}.`,
        `Admitted with acute symptoms. Under conservative therapy and observation at ${assignedDoctor.hospital}.`,
        `Follow-up visit with latest pathology report. Advised diet plan and routine medication.`,
        `Patient reported significant improvement. Follow-up consultation scheduled next month.`,
      ];

      return {
        name: p.name,
        age: p.age,
        gender: p.gender,
        phone: p.phone,
        condition,
        doctorId: assignedDoctor._id,
        admissionDate,
        status,
        notes: notesTemplates[idx % notesTemplates.length],
      };
    });

    const createdPatients = await Patient.insertMany(patientsData);
    console.log(`🏥 Created ${createdPatients.length} Patients successfully.`);

    console.log("\n🎉 Database Seeding Completed!");
    console.log("==========================================");
    console.log("Admin Credentials:");
    console.log("  Email:    admin@gmail.com");
    console.log("  Password: admin123");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
