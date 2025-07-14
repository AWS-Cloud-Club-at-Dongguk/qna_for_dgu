// error class for handling internal server errors

import { AppError } from "@/common/errors/AppError";

export class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(500, message);
    }
}