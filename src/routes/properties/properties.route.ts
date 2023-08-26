import { Router } from "express";
import { PropertiesController } from "../../controllers/properties/properties.controller";

const propertiesRouter : Router = Router();
const controller = new PropertiesController();

// Routes
propertiesRouter.get('/otodom-scrap', controller.otodomController)
// ...

export default propertiesRouter;