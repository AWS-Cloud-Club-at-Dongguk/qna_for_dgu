// error class for handling bad request errors

import { AppError } from "@/common/errors/AppError";

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(400, message);
    }
}