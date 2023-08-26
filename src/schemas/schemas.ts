import Joi, { ObjectSchema } from "joi";
import { Genres } from "../constants/types";

const availableGenres = Object.values(Genres)
const movieSchema = Joi.object({
    genres: Joi.array().items(Joi.string().valid(...availableGenres)).required(),
    title: Joi.string().max(255).required(),
    year: Joi.number().required(),
    runtime: Joi.number().required(),
    director: Joi.string().max(255).required(),
    actors: Joi.string().optional().default(""),
    plot: Joi.string().optional().default(""),
    posterUrl: Joi.string().optional().default(""),
})

export default {
    'movieSchema' : movieSchema
} as {
    [key: string] : ObjectSchema
};
