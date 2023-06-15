import moment from "moment"
import { IProperty } from "../constants/interfaces";
import { Cell, CellValue, Workbook, Worksheet } from "exceljs";
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
/**
 * 
 * @param Property
 */
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

/**
 * 
 * @param scraperName 
 */

    async saveExcelFile(scraperName : string) : Promise<void> {
        // todo
        // if dir doesnt exists - create it
        if(!existsSync(this.absolutePath)) {
            mkdirSync(this.absolutePath, {recursive: true});
        }
        await this.workbook.xlsx.writeFile(`${this.absolutePath}${scraperName}.xlsx`);
    }

    /**
     * 
     * @param fileName (fileName e.g: MORIZON (without .csv at the end))
     * @param options 
     */
    async readExcelFile(fileName: string, options: ReadExcelOptions = {}) {
        await this.workbook.xlsx.readFile(this.absolutePath+fileName+'.xlsx');
        const worksheet = this.workbook.getWorksheet('Scraper');
        const urls : Array<string|CellValue> = [];
        worksheet.eachRow((row, rowNumber) => {
            if(rowNumber != 1) {
                const url : CellValue | string = options.cell ? row.getCell(options.cell).value : '';
                urls.push(url);
            }
        })
        return urls;
    }
}

interface ReadExcelOptions {
    cell?: string,
    column?: string
} 