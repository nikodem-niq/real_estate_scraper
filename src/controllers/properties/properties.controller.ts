import { NextFunction, Request, Response } from "express";
import otodomScraperService, { OtodomSettings } from "../../services/otodom/otodom-scraper.service";
import { messageLocales } from "../../constants/locales";

export class PropertiesController {
    public async otodomController(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, propertyType, voivoideship, city, ownerTypeSearching, priceLow, priceHigh, areaLow, areaHigh } = req.body;
            const pageCountToScrap = await otodomScraperService.initScrape({type, propertyType, voivoideship, city, ownerTypeSearching, priceLow, priceHigh, areaLow, areaHigh} as OtodomSettings);
            if(!pageCountToScrap || pageCountToScrap === 0) return res.status(400).json(messageLocales.RESOURCE_EMPTY);

            const propertyListToScrap = await otodomScraperService.runScrapeProperties(pageCountToScrap);
            if(!propertyListToScrap || propertyListToScrap.length === 0) return res.status(400).json(messageLocales.RESOURCE_EMPTY);
            
            console.log(pageCountToScrap, propertyListToScrap.length)
            const propertyScrapTask = await otodomScraperService.runScrapeProperty(propertyListToScrap);
            

            return res.status(200).json(propertyListToScrap);
            // return res.status(400).json(messageLocales.RESOURCE_FETCH_ERROR);
        } catch(error) {
            console.error(error);
            return res.status(400).json(messageLocales.RESOURCE_FETCH_ERROR);
        }
    }
}