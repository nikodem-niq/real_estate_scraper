import moment from "moment"
import { IProperty } from "../constants/interfaces";
import { Workbook, Worksheet } from "exceljs";

export class CsvHelper {
    private workbook;
    private worksheet;
    constructor() {
        this.workbook = new Workbook();
        this.worksheet = this.workbook.addWorksheet('Scraper');
    }

    addHeaderRow() : void {
        this.worksheet.addRow(['Typ', 'Miasto', 'Ulica', 'Powierzchnia', 'Cena za metr', 'Cena całkowita', 'Typ właściciela', 'Stan nieruchomości', 'Standard', 'Numer telefonu', 'Właściciel', 'URL do nieruchomości']);
    }

    addPropertyRow(Property : IProperty) : void {
        this.worksheet.addRow([
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

    async saveExcelFile() : Promise<void> {
        // todo
        // if dir doesnt exists - create it
        await this.workbook.xlsx.writeFile('./csv/dane.csv');
    }
}