export class Seznamy implements ISeznamy {
    platba: any;
    znacka: any;
    formlyZnacka: any;
    model: any;
    druh: any;
    rok_vyroby: any;
    palivo: any;
    uziti: any;
    najezd: any;
    vozidloZabezpeceni: any;    
    osobaTyp: any;
    pojistnik: {
        adresa_id: any;
        psc: any;
        castiobce: any;
    }
    vlastnik: {
        adresa_id: any;
        psc: any;
        castiobce: any;
    }    
    provozovatel: {
        adresa_id: any;
        psc: any;
        castiobce: any;
    }  

    constructor() {
        this.platba = [],
        this.znacka = [{
                value: -1,
                label: 'Nejčastější značky',
                children: [
                    { value: 'SKODA', label: 'Škoda', druhId: ['OSOBNI', 'UZITKOVY'] },
                    { value: 'FORD', label: 'Ford', druhId: ['OSOBNI', 'UZITKOVY'] },
                    { value: 'RENAULT', label: 'Renault', druhId: ['OSOBNI', 'UZITKOVY'] },
                    { value: 'PEUGEOT', label: 'Peugeot', druhId: ['OSOBNI', 'UZITKOVY'] },
                    { value: 'VOLKSWAGEN', label: 'Volkswagen', druhId: ['OSOBNI', 'UZITKOVY'] },
                    { value: 'OPEL', label: 'Opel', druhId: ['OSOBNI', 'UZITKOVY'] },
                    { value: 'CITROEN', label: 'Citroën', druhId: ['OSOBNI', 'UZITKOVY'] },
                    { value: 'SEAT', label: 'Seat', druhId: ['OSOBNI', 'UZITKOVY'] }
                ]
            }],
        this.formlyZnacka = [],
        this.model = [],
        this.druh = [],
        this.rok_vyroby = [],
        this.palivo = [],
        this.uziti = [],
        this.najezd = [],
        this.vozidloZabezpeceni = {},
        this.osobaTyp = [],
        this.pojistnik = {
                adresa_id: [],
                psc: [],
                castiobce: []
            },
        this.vlastnik = {
                adresa_id: [],
                psc: [],
                castiobce: []
            },            
        this.provozovatel = {
                adresa_id: [],
                psc: [],
                castiobce: []
            }
    }        
}

export interface ISeznamy {
    platba: any;
    znacka: any;
    formlyZnacka: any;
    model: any;
    druh: any;
    rok_vyroby: any;
    palivo: any;
    uziti: any;
    najezd: any;
    vozidloZabezpeceni: any;    
    osobaTyp: any;
    pojistnik: {
        adresa_id: any;
        psc: any;
        castiobce: any;
    }
    vlastnik: {
        adresa_id: any;
        psc: any;
        castiobce: any;
    }    
    provozovatel: {
        adresa_id: any;
        psc: any;
        castiobce: any;
    }    
}