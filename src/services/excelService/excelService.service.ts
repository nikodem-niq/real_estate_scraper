import moment from "moment"
// import { IProperty } from "../constants/interfaces";
import { Cell, CellValue, Fill, Workbook, Worksheet } from "exceljs";
import { mkdirSync, existsSync } from "fs";
// import { Logger } from "./loggerHelper";
import { inspect } from "util";

export class ExcelHelper {
    private workbook;
    private worksheet;
    private absolutePath = './csv/'
    constructor() {
        this.workbook = new Workbook();
        this.worksheet = this.workbook.addWorksheet('Scraper');
    }

    // private logHelper = new Logger("GENERAL_LOG");


    addHeaderRow() : void {
        this.worksheet.addRow(['Scraper', 'Typ', 'Miasto', 'Ulica', 'Powierzchnia', 'Cena za metr', 'Cena całkowita', 'Typ właściciela', 'Stan nieruchomości', 'Standard', 'Numer telefonu', 'Właściciel', 'URL do nieruchomości']);
    }
/**
 * 
 * @param Property
 */
    addPropertyRow(Property : any) : void {
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
        try {
            await this.workbook.xlsx.readFile(this.absolutePath+fileName+'.xlsx');
            const worksheet = this.workbook.getWorksheet('Scraper');
            const urls : Array<string|CellValue> = [];
            worksheet.eachRow((row: any, rowNumber: any) => {
                if(rowNumber != 1) {
                    const url : CellValue | string = options.cell ? row.getCell(options.cell).value : '';
                    urls.push(url);
                }
            })
            return urls;
        } catch(error) {
            // this.logHelper.log(error as string, "error")
        }
    }  

    // findColumnIndexByHeader(worksheet: Worksheet, header: string): number {
    //     const headerRow = worksheet.getRow(1);
    //     const headerCells = headerRow.values as string[];
      
    //     for (let i = 0; i < headerCells.length; i++) {
    //       const cellValue = headerCells[i] as string;
    //       if (cellValue === header) {
    //         return i + 1; // Zwracamy indeks kolumny (1-based)
    //       }
    //     }
      
    //     return -1; // Jeśli nagłówek nie został znaleziony, zwracamy -1
    //   }
    
    /**
     * 
     * @param fileName 
     * @param expiredProperties 
     */
    async highlightExpiredProperties(fileName: string, expiredProperties: Array<any>) {

        console.log(expiredProperties)
        await this.workbook.xlsx.readFile(this.absolutePath+fileName+'.xlsx');
        const worksheet = this.workbook.getWorksheet('Scraper');
        const urlColumnIndex = 'M'

        worksheet.eachRow((row: any, rowNumber: any) => {
            const cellValue : CellValue = row.getCell(urlColumnIndex).value;
            if(cellValue !== null && typeof cellValue === 'object' && 'text' in cellValue) {
                if(expiredProperties.includes(cellValue.text)) {
                    console.log(cellValue, rowNumber)
                    row.getCell('B').fill = { fgColor: { argb: 'FF556677' }, pattern: 'solid', type: 'pattern' };
                }
            } else if(cellValue !== null && typeof cellValue === 'object' && 'formula' in cellValue) {        
                const matchedHtml = cellValue.formula?.match(/HYPERLINK\("([^"]+)",\s*"[^"]+"\)/i);
                if(matchedHtml && expiredProperties.includes(matchedHtml[1])) {
                    console.log(cellValue, rowNumber)
                    row.getCell('B').fill = { fgColor: { argb: 'FF556612' }, pattern: 'solid', type: 'pattern' };
                }
            } else {
                if(expiredProperties.includes(cellValue)) {
                    console.log(cellValue, rowNumber)
                    row.getCell('B').fill = { fgColor: { argb: 'FF556612' }, pattern: 'solid', type: 'pattern' };
                }
            }
        })
        await this.workbook.xlsx.writeFile(this.absolutePath + fileName + '.xlsx');
    }
}



interface ReadExcelOptions {
    cell?: string,
    column?: string
} 