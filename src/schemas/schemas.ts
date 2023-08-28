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
    areHigh: Joi.number().optional(),
})

export default {
    'otodomRequestSchema' : otodomRequestSchema
} as {
    [key: string] : ObjectSchema
};
