import moment from "moment"
import { IProperty } from "../constants/interfaces";
import { Cell, CellValue, Fill, Workbook, Worksheet } from "exceljs";
import { mkdirSync, existsSync } from "fs";
import { Logger } from "./loggerHelper";

export class CsvHelper {
    private workbook;
    private worksheet;
    private absolutePath = './csv/'
    constructor() {
        this.workbook = new Workbook();
        this.worksheet = this.workbook.addWorksheet('Scraper');
    }

    private logHelper = new Logger("GENERAL_LOG");


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
        try {
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
        } catch(error) {
            this.logHelper.log(error as string, "error")
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
    
    async highlightExpiredProperties(fileName: string, expiredProperties: Array<string>) {
        await this.workbook.xlsx.readFile(this.absolutePath+fileName+'.xlsx');
        const worksheet = this.workbook.getWorksheet('Scraper');
        // const urlColumnIndex = this.findColumnIndexByHeader(worksheet, 'URL do nieruchomości');
        const urlColumnIndex = 'M'

        for(const expiredProperty of expiredProperties) {
        worksheet.eachRow((row, rowNumber) => {
            if(rowNumber === 1) return;
            const cell = row.getCell(urlColumnIndex);
            let cellValue = cell.value as string;
            if(cell.value !== null && typeof cell.value === 'object' && 'text' in cell.value) {
                cellValue = cell.value.text as string;
            }

                if (cellValue.includes(expiredProperty)) {
                    // Zmieniamy kolor komórki w całym wierszu na czerwony
                    row.eachCell((cell) => {
                      const fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFFF0000" }, // red
                      } as Fill;
              
                      cell.fill = fill;
                    });
                  }

        })};
        await this.workbook.xlsx.writeFile(this.absolutePath + fileName + '.xlsx');
    }
}



interface ReadExcelOptions {
    cell?: string,
    column?: string
} 