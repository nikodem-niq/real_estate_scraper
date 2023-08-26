import { configDotenv } from "dotenv";
import Joi from "joi";
configDotenv();

const envSchema = Joi.object().keys({ 
    PORT: Joi.number().description('Server port').default(8080),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').required().description('Node environment - production/development'),
}).unknown();

const { value: envValue, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
    port: envValue.PORT,
    env: envValue.NODE_ENV,
}
