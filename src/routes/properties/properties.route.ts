import { Router } from "express";
import { PropertiesController } from "../../controllers/properties/properties.controller";
import { schemaValidator } from "../../middlewares/schemaValidator";

const propertiesRouter : Router = Router();
const controller = new PropertiesController();

// Routes
propertiesRouter.post('/otodom-scrap', schemaValidator('otodomRequestSchema'), controller.otodomScrapController)
propertiesRouter.post('/otodom-rescrap', schemaValidator('rescrapingRequestSchema'), controller.otodomRescrapController)
// ...

export default propertiesRouter;