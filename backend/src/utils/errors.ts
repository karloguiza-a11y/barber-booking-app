export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class BadRequest extends ApiError {
  constructor(message: string) {
    super(400, message);
    this.name = 'BadRequest';
  }
}

export class Unauthorized extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'Unauthorized';
  }
}

export class Forbidden extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = 'Forbidden';
  }
}

export class NotFound extends ApiError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFound';
  }
}

export class Conflict extends ApiError {
  constructor(message: string) {
    super(409, message);
    this.name = 'Conflict';
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message);
    this.name = 'InternalServerError';
  }
}
