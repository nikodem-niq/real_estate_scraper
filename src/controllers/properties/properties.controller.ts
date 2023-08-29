import { NextFunction, Request, Response } from "express";
import { messageLocales } from "../../constants/locales";
import OtodomService, { OtodomSettings } from "../../services/otodom/otodom-scraper.service";

export class PropertiesController {
    public async otodomScrapController(req: Request, res: Response, next: NextFunction) {
        try {
            const Service = new OtodomService()

            const { type, propertyType, voivoideship, city, ownerTypeSearching, priceLow, priceHigh, areaLow, areaHigh } = req.body;
            const pageCountToScrap = await Service.initScrape({type, propertyType, voivoideship, city, ownerTypeSearching, priceLow, priceHigh, areaLow, areaHigh} as OtodomSettings);
            if(!pageCountToScrap || pageCountToScrap === 0) return res.status(400).json(messageLocales.RESOURCE_EMPTY);

            const propertyListToScrap = await Service.runScrapeProperties(pageCountToScrap);
            if(!propertyListToScrap || propertyListToScrap.length === 0) return res.status(400).json(messageLocales.RESOURCE_EMPTY);
            
            const propertyScrapTask = await Service.runScrapeProperty(propertyListToScrap, pageCountToScrap);
            if(!propertyScrapTask) return res.status(400).json(messageLocales.RESOURCE_FETCH_ERROR)
            

            return res.status(200).json(propertyScrapTask);
        } catch(error) {
            console.error(error);
            return res.status(400).json(messageLocales.RESOURCE_FETCH_ERROR);
        }
    }

    public async otodomRescrapController(req: Request, res: Response, next: NextFunction) {
        try {
            const Service = new OtodomService();
            
            const { fileName } = req.body;

            const rescrapTask = await Service.rescrapePropertiesFromFile(fileName);
            if(!rescrapTask) return res.status(400).json(messageLocales.RESOURCE_FETCH_ERROR)

            return res.status(200).json(messageLocales.RESCRAPPING_SUCCESS);
        } catch(error) {
            console.error(error);
            return res.status(400).json(messageLocales.RESOURCE_FETCH_ERROR);
        }
    }
}