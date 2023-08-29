import moment from "moment"
import { Cell, CellValue, Fill, Workbook, Worksheet } from "exceljs";
import { mkdirSync, existsSync } from "fs";
import { inspect } from "util";
import { IProperty } from "src/constants/types";

export class ExcelHelper {
    private workbook = new Workbook();
    private worksheet = this.workbook.addWorksheet('Scraper');
    private absolutePath = './csv/';

    public constructor() { }

    public addHeaderRow() : void {
        this.worksheet.addRow(['Scraper', 'Typ', 'Miasto', 'Ulica', 'Powierzchnia', 'Cena za metr', 'Cena całkowita', 'Typ właściciela', 'Stan nieruchomości', 'Standard', 'Numer telefonu', 'Właściciel', 'URL do nieruchomości']);
    }

    public addPropertyRow(Property : IProperty) : void {
        this.worksheet.addRow([
            Property.scraperName,
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

    public async saveExcelFile(scraperName : string) : Promise<void> {
        if(!existsSync(this.absolutePath)) {
            mkdirSync(this.absolutePath, {recursive: true});
        }
        await this.workbook.xlsx.writeFile(`${this.absolutePath}${scraperName}.xlsx`);
    }

    public async readExcelFile(fileName: string, options: ReadExcelOptions = {}) : Promise<string[]> {
        try {
            if(!existsSync(this.absolutePath+fileName+'.xlsx')) return [];

            await this.workbook.xlsx.readFile(this.absolutePath+fileName+'.xlsx');
            const worksheet = this.workbook.getWorksheet('Scraper');

            const urls : string[] = [];
            
            worksheet.eachRow((row: any, rowNumber: any) => {
                if(rowNumber != 1) {
                    const url : string = options.cell ? row.getCell(options.cell).value : '' as string;
                    urls.push(url);
                }
            })

            return urls;
        } catch(error) {
            console.error(error);
            return []
        }
    }  
    
    public async highlightExpiredProperties(fileName: string, expiredProperties: Array<any>) {

        await this.workbook.xlsx.readFile(this.absolutePath+fileName+'.xlsx');
        const worksheet = this.workbook.getWorksheet('Scraper');
        const urlColumnIndex = 'M'

        worksheet.eachRow((row: any, rowNumber: any) => {
            const cellValue : CellValue = row.getCell(urlColumnIndex).value;
            if(cellValue !== null && typeof cellValue === 'object' && 'text' in cellValue) {
                if(expiredProperties.includes(cellValue.text)) {
                    row.getCell('B').fill = { fgColor: { argb: 'FF556677' }, pattern: 'solid', type: 'pattern' };
                }
            } else if(cellValue !== null && typeof cellValue === 'object' && 'formula' in cellValue) {        
                const matchedHtml = cellValue.formula?.match(/HYPERLINK\("([^"]+)",\s*"[^"]+"\)/i);
                if(matchedHtml && expiredProperties.includes(matchedHtml[1])) {
                    row.getCell('B').fill = { fgColor: { argb: 'FF556612' }, pattern: 'solid', type: 'pattern' };
                }
            } else {
                if(expiredProperties.includes(cellValue)) {
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