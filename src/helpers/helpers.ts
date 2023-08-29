import fs from 'fs/promises';
import { existsSync } from "fs";
import { messageLocales } from '../constants/locales';
import path from 'path';
import { config } from '../config/config';

/**
 * 
 * @param filePath 
 * @returns json data from db file or empty [] if path is wrong
 */
export const readFile = async (filePath : string, format: "json"|"plain" = "plain") : Promise<string | []> => {
    try {
        if(!existsSync(filePath)) {
            return []
        }
        const pathParsed = path.join(__dirname, '..', '..', filePath);
        const fileData = await fs.readFile(pathParsed, {encoding: 'utf-8'});
        const parsedData = JSON.parse(fileData);
        if(format === "json") return parsedData;
        return fileData;
    } catch(error) {
        console.error(messageLocales.READ_FILE_ERROR);
        return [];
    }
}

/**
 * 
 * @param filePath 
 * @param content 
 * @returns message <string> if file was saved successfully or not
 */
export const writeFile = async (filePath : string, content: string) : Promise<string> => {
    try {
        const pathParsed = path.join(__dirname, '..', '..', filePath);
        await fs.writeFile(pathParsed, JSON.stringify(content, null, 2), 'utf-8');
        return messageLocales.WRITE_FILE_SUCCESS;
    } catch(error) {
        console.error(messageLocales.WRITE_FILE_ERROR);
        return messageLocales.WRITE_FILE_ERROR
    }
}

export const randomizeNumberInRange = (min: number, max: number) : number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min+1) + min);
}

export const randomizeId = () : number => {
    const randomizedId = Math.floor(Math.random() * 99999)
    return randomizedId;
}