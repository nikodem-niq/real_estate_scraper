import { existsSync, mkdirSync } from "fs";
import { appendFile } from "fs/promises";
import moment from "moment";

export class Logger {
    private absolutePath = `./logs/`;
    private fileName : "GENERAL_LOG" | string;

    constructor(fileName : string) {
        this.fileName = fileName;
    }

    /**
     * 
     * @param message 
     * @param type 
     * @param path 
     */

    async log(message : string, type: "log" | "error", path = this.absolutePath) : Promise<void> {
        if(!existsSync(this.absolutePath)) {
            mkdirSync(this.absolutePath, {recursive: true});
        }
        await appendFile(`${path}${this.fileName}.${moment().format('YYYY.MM.DD')}.log`, `${moment().format('YYYY.MM.DD_HH:mm:ss')} -- ${message.toString()}\n`);
    }
}