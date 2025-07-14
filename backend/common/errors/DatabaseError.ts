// error class for handling database-related errors

import { AppError } from "@/common/errors/AppError";

export class DatabaseError extends AppError {
    constructor(message = "Database operation failed") {
        super(500, message);
    }
}