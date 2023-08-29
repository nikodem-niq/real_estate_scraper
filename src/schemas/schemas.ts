import Joi, { ObjectSchema } from "joi";
import { OTODOM_PROPERTY_TYPE } from "../constants/types";

const availableOtodomPropertyTypes = Object.values(OTODOM_PROPERTY_TYPE)
const otodomRequestSchema = Joi.object({
    type: Joi.string().valid('sprzedaz', 'wynajem').required(),
    propertyType: Joi.string().valid(...availableOtodomPropertyTypes).required(),
    voivoideship: Joi.string().required(),
    city: Joi.string().required(),
    priceLow: Joi.number().optional(),
    priceHigh: Joi.number().optional(),
    areaLow: Joi.number().optional(),
    areaHigh: Joi.number().optional(),
})

const rescrapingRequestSchema = Joi.object({
    fileName: Joi.string().required(),
})

export default {
    'otodomRequestSchema' : otodomRequestSchema,
    'rescrapingRequestSchema' : rescrapingRequestSchema
} as {
    [key: string] : ObjectSchema
};
