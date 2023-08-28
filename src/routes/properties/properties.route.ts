import { Router } from "express";
import { PropertiesController } from "../../controllers/properties/properties.controller";
import { schemaValidator } from "../../middlewares/schemaValidator";

const propertiesRouter : Router = Router();
const controller = new PropertiesController();

// Routes
propertiesRouter.post('/otodom-scrap', schemaValidator('otodomRequestSchema'), controller.otodomController)
// ...

export default propertiesRouter;