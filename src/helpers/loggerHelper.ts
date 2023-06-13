import { appendFile } from "fs/promises";
import moment from "moment";

export class Logger {
    private absolutePath = `./logs/`;
    private scraperName : string;

    constructor(scraperName : string) {
        this.scraperName = scraperName;
    }

    async log(message : string, type: "log" | "error", path = this.absolutePath) : Promise<void> {
        await appendFile(`${path}${this.scraperName}.${moment().format('YYYY.MM.DD_HH.mm')}.log`, `${moment().format('YYYY.MM.DD_HH:mm')} -- ${message.toString()}\n`);
    }
}