export interface IVozidlo {
    id: string;
    rz: string;
    vtp: string;
    druhId: string;
    znackaId: string;
    modelId: string;
    specifikace: string;
    objemMotoru: number;
    vykonMotoru: number;
    hmotnost: number;
    uzitiId: string;
    palivoId: string;
    najezdId: string;
    uvedeniDoProvozu: any;
    stavTachometr: number;
    cena: number;
    kategorie: string;
    pocetDveri: number;
    pocetSedadel: number;   
    barva: string;
    zabezpeceni: {
        imobilizer: boolean,
        mechanicke: boolean,
        piskovaniSkel: boolean,
        alarm: boolean,
        pasivniVyhledavani: boolean,
        aktivniVyhledavani: boolean
    }
}
