import moment from "moment"
import { IProperty } from "../constants/interfaces";
import { Workbook, Worksheet } from "exceljs";
import { mkdirSync, existsSync } from "fs";

export class CsvHelper {
    private workbook;
    private worksheet;
    private absolutePath = './csv/'
    constructor() {
        this.workbook = new Workbook();
        this.worksheet = this.workbook.addWorksheet('Scraper');
    }

    addHeaderRow() : void {
        this.worksheet.addRow(['Scraper', 'Typ', 'Miasto', 'Ulica', 'Powierzchnia', 'Cena za metr', 'Cena całkowita', 'Typ właściciela', 'Stan nieruchomości', 'Standard', 'Numer telefonu', 'Właściciel', 'URL do nieruchomości']);
    }

    addPropertyRow(Property : IProperty) : void {
        this.worksheet.addRow([
            Property.scraper,
            Property.type,
            Property.city,
            Property.street,
            Property.area,
            Property.priceForMetre,
            Property.fullPrice,
            Property.ownerType,
            Property.propertyCondition,
            Property.standard,
            Property.phoneNumber,
            Property.ownerName,
            Property.urlToProperty,
          ]);    
    }

    async saveExcelFile(scraperName : string) : Promise<void> {
        // todo
        // if dir doesnt exists - create it
        if(!existsSync(this.absolutePath)) {
            mkdirSync(this.absolutePath, {recursive: true});
        }
        await this.workbook.xlsx.writeFile(`${this.absolutePath}${scraperName}.csv`);
    }
}