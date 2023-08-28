import type { Request, Response, NextFunction } from "express"

// Interfaces

// Enums
export enum BASE_URLS {
    OTODOM_BASE_URL = "https://www.otodom.pl/pl/wyniki/",
    OTODOM_BASE_URL_OFFER = "https://www.otodom.pl/pl/oferta/" 
}

export enum OTODOM_PROPERTY_TYPE {
    MIESZKANIE = "mieszkanie",
    DOM = "dom",
    KAWALERKA = "kawalerka",
    INWESTYCJA = "inwestycja",
    POKOJ = "pokoj",
    DZIALKA = "dzialka",
    LOKAL = "lokal",
    HALEIMAGAZYNY = "haleimagazyny",
    GARAZ = "garaz"    
}



// Types