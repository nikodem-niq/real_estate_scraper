import { NextFunction, Request, Response } from "express";
import otodomScraperService from "../../services/otodom/otodom-scraper.service";

export class PropertiesController {
    public async otodomController(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, propertyType, city, ownerTypeSearching, priceLow, priceHigh, areaLow, areaHigh } = req.query;
            const data = await otodomScraperService.initScrape();
            return res.send(data);
        } catch(error) {
            console.error(error);
        }
    }
}