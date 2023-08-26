import { Router } from "express";
import propertiesRouter from "./properties/properties.route";

const appRouter : Router = Router();

// Routes
appRouter.use('/properties', propertiesRouter);

export default appRouter;