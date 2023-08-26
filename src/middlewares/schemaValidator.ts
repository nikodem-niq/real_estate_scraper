import { RequestHandler } from "express";
import schemas from "../schemas/schemas";
import { messageLocales } from "../constants/locales";


export const schemaValidator = (schema: string) : RequestHandler => {
    const validatorOptions = {
        abortEarly: false
    }

    return (req, res, next) => {
        if(!schemas[schema]) {
            throw new Error(messageLocales.SCHEMA_OBJECT_NOT_FOUND);
        }
        const { error, value } = schemas[schema].validate(req.body, validatorOptions);

        if(error) {
            const errorResponse : ICustomErrorMessage = {
                status: 'error',
                error: {
                    details: error.details.map(({ message, type }: IValidationError) => ({
                        message: message.replace(/['"]/g, ""),
                        type,
                      })),
                }
            }

            return res.status(400).json(errorResponse);
        }

        req.body = value;
        return next();
    }
}

interface ICustomErrorMessage {
    status: string,
    error: {
        details: IValidationError[]
    }
}

interface IValidationError {
    message: string;
    type: string;
  }