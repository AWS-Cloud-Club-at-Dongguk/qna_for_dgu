// error class for handling database-related errors

import { AppError } from "@/common/errors/AppError";

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(404, message);
    }
}