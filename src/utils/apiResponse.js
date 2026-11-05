export class ApiResponse {
  static success(
    res,
    data,
    message = "Operation successful",
    statusCode = 200,
    pagination = null
  ) {
    const payload = {
      success: true,
      statusCode,
      message,
      data,
    };

    if (pagination) {
      payload.pagination = pagination;
    }

    return res.status(statusCode).json(payload);
  }

  static created(res, data, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }
}
