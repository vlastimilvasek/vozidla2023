import { IOsoba, IParametry, IVozidlo, IRizika } from '../models';

export class Vozidla implements IVozidla {
    kod: string;
    pojisteniId: string;
    pojisteniKategorieId: string;
    datum: any;
    email: string;
    vozidlo: IVozidlo;
    pojistnik: IOsoba;
    vlastnik: IOsoba;
    provozovatel: IOsoba;
    rizika: IRizika;    
    parametry: IParametry;

    constructor(data: any) {
        data = data || {}
        this.kod = data.kod || ''
        this.pojisteniId = data.pojisteniId || 'VOZIDLA'
        this.pojisteniKategorieId = data.pojisteniKategorieId || 'POV'
        this.datum = new Date()
        this.email = data.email || ''

        data.vozidlo = data.vozidlo || {}
        this.vozidlo = data.vozidlo || {}
        this.vozidlo.rz = data.vozidlo.rz || null
        this.vozidlo.vtp = data.vozidlo.vtp || null
        this.vozidlo.id = data.vozidlo.id || null
        this.vozidlo.druhId = data.vozidlo.druhId || null
        this.vozidlo.kategorie = data.vozidlo.kategorie || null
        this.vozidlo.uzitiId = data.vozidlo.uzitiId || 'BEZNE'
        this.vozidlo.znackaId = data.vozidlo.znackaId || null
        this.vozidlo.modelId = data.vozidlo.modelId || null
        this.vozidlo.specifikace = data.vozidlo.specifikace || null
        this.vozidlo.barva = data.vozidlo.barva || null
        this.vozidlo.cena = Number(data.vozidlo.cena) || null
        this.vozidlo.objemMotoru = Number(data.vozidlo.objemMotoru) || null
        this.vozidlo.vykonMotoru = Number(data.vozidlo.vykonMotoru) || null,
        this.vozidlo.uvedeniDoProvozu = data.vozidlo.uvedeniDoProvozu ? new Date(data.vozidlo.uvedeniDoProvozu) : null,
        this.vozidlo.stavTachometr = Number(data.vozidlo.stavTachometr) || null
        this.vozidlo.najezdId = data.vozidlo.najezdId || null
        this.vozidlo.hmotnost = Number(data.vozidlo.hmotnost) || null
        this.vozidlo.pocetDveri = Number(data.vozidlo.pocetDveri) || null
        this.vozidlo.pocetSedadel = Number(data.vozidlo.pocetSedadel) || null
        this.vozidlo.palivoId = data.vozidlo.palivoId || null
        data.vozidlo.zabezpeceni = data.vozidlo.zabezpeceni || {}
        this.vozidlo.zabezpeceni.imobilizer = data.vozidlo.zabezpeceni.imobilizer || true
        this.vozidlo.zabezpeceni.mechanicke = data.vozidlo.zabezpeceni.mechanicke || false
        this.vozidlo.zabezpeceni.piskovaniSkel = data.vozidlo.zabezpeceni.piskovaniSkel || false
        this.vozidlo.zabezpeceni.alarm = data.vozidlo.zabezpeceni.alarm || false
        this.vozidlo.zabezpeceni.pasivniVyhledavani = data.vozidlo.zabezpeceni.pasivniVyhledavani || false
        this.vozidlo.zabezpeceni.aktivniVyhledavani = data.vozidlo.zabezpeceni.aktivniVyhledavani || false

        data.pojistnik = data.pojistnik || {}
        this.pojistnik = data.pojistnik || {}
        this.pojistnik.typOsobyId = data.pojistnik.typOsobyId || 'FO'
        this.pojistnik.id = data.pojistnik.id || ''
        this.pojistnik.titul = data.pojistnik.titul || ''
        this.pojistnik.titulZa = data.pojistnik.titulZa || ''
        this.pojistnik.jmeno = data.pojistnik.jmeno || ''
        this.pojistnik.prijmeni = data.pojistnik.prijmeni || ''
        this.pojistnik.spolecnost = data.pojistnik.spolecnost || ''
        this.pojistnik.platceDph = (data.pojistnik.platceDph == 'true' || data.pojistnik.platceDph === true) ? true : false
        this.pojistnik.telefon = data.pojistnik.telefon || ''
        this.pojistnik.email = data.pojistnik.email || ''
        this.pojistnik.adresaId = data.pojistnik.adresaId || null
        data.pojistnik.adresa = data.pojistnik.adresa || {}
        this.pojistnik.adresa = data.pojistnik.adresa || {}
        this.pojistnik.adresa.psc = data.pojistnik.adresa.psc || null
        this.pojistnik.adresa.castObceId = data.pojistnik.adresa.castObceId || null
        this.pojistnik.adresa.obec = data.pojistnik.adresa.obec || ''
        this.pojistnik.adresa.ulice = data.pojistnik.adresa.ulice || ''
        this.pojistnik.adresa.cp = data.pojistnik.adresa.cp || ''

        data.vlastnik = data.vlastnik || {}
        this.vlastnik = data.vlastnik || {}
        this.vlastnik.typOsobyId = data.vlastnik.typOsobyId || 'FO'
        this.vlastnik.id = data.vlastnik.id || ''
        this.vlastnik.titul = data.vlastnik.titul || ''
        this.vlastnik.titulZa = data.vlastnik.titulZa || ''
        this.vlastnik.jmeno = data.vlastnik.jmeno || ''
        this.vlastnik.prijmeni = data.vlastnik.prijmeni || ''
        this.vlastnik.spolecnost = data.vlastnik.spolecnost || ''
        this.vlastnik.platceDph = (data.vlastnik.platceDph == 'true' || data.vlastnik.platceDph === true) ? true : false
        this.vlastnik.telefon = data.vlastnik.telefon || ''
        this.vlastnik.email = data.vlastnik.email || ''
        this.vlastnik.adresaId = data.vlastnik.adresaId || null
        data.vlastnik.adresa = data.vlastnik.adresa || {}
        this.vlastnik.adresa = data.vlastnik.adresa || {}
        this.vlastnik.adresa.psc = data.vlastnik.adresa.psc || null
        this.vlastnik.adresa.castObceId = data.vlastnik.adresa.castObceId || null
        this.vlastnik.adresa.obec = data.vlastnik.adresa.obec || ''
        this.vlastnik.adresa.ulice = data.vlastnik.adresa.ulice || ''
        this.vlastnik.adresa.cp = data.vlastnik.adresa.cp || ''

        data.provozovatel = data.provozovatel || {}
        this.provozovatel = data.provozovatel || {}
        this.provozovatel.typOsobyId = data.provozovatel.typOsobyId || 'FO'
        this.provozovatel.id = data.provozovatel.id || ''
        this.provozovatel.titul = data.provozovatel.titul || ''
        this.provozovatel.titulZa = data.provozovatel.titulZa || ''
        this.provozovatel.jmeno = data.provozovatel.jmeno || ''
        this.provozovatel.prijmeni = data.provozovatel.prijmeni || ''
        this.provozovatel.spolecnost = data.provozovatel.spolecnost || ''
        this.provozovatel.platceDph = (data.provozovatel.platceDph == 'true' || data.provozovatel.platceDph === true) ? true : false
        this.provozovatel.telefon = data.provozovatel.telefon || ''
        this.provozovatel.email = data.provozovatel.email || ''
        this.provozovatel.adresaId = data.provozovatel.adresaId || null
        data.provozovatel.adresa = data.provozovatel.adresa || {}
        this.provozovatel.adresa = data.provozovatel.adresa || {}
        this.provozovatel.adresa.psc = data.provozovatel.adresa.psc || null
        this.provozovatel.adresa.castObceId = data.provozovatel.adresa.castObceId || null
        this.provozovatel.adresa.obec = data.provozovatel.adresa.obec || ''
        this.provozovatel.adresa.ulice = data.provozovatel.adresa.ulice || ''
        this.provozovatel.adresa.cp = data.provozovatel.adresa.cp || ''   

        data.rizika = data.rizika || {}
        this.rizika = data.rizika || {}
        this.rizika.povinneRuceni = Number(data.rizika.povinneRuceni) || 1
        this.rizika.rozsirenaAsistence = Number(data.rizika.rozsirenaAsistence) || 0
        this.rizika.pravniAsistence = Number(data.rizika.pravniAsistence) || 0
        this.rizika.pojisteniSkel = Number(data.rizika.pojisteniSkel) || 0
        this.rizika.nahradniVozidlo = Number(data.rizika.nahradniVozidlo) || 0
        this.rizika.pojisteniUrazu = Number(data.rizika.pojisteniUrazu) || 0
        this.rizika.pojisteniZavazadel = Number(data.rizika.pojisteniZavazadel) || 0
        this.rizika.srazkaSeZviretem = Number(data.rizika.srazkaSeZviretem) || 0
        this.rizika.poskozeniZviretem = Number(data.rizika.poskozeniZviretem) || 0
        this.rizika.zivel = Number(data.rizika.zivel) || 0
        this.rizika.odcizeni = Number(data.rizika.odcizeni) || 0
        this.rizika.vandalismus = Number(data.rizika.vandalismus) || 0
        this.rizika.havarie = Number(data.rizika.havarie) || 0
        this.rizika.gap = Number(data.rizika.gap) || 0
        this.rizika.spoluucast = Number(data.rizika.spoluucast) || 5 

        data.parametry = data.parametry || {}
        this.parametry = data.parametry || {}
        this.parametry.pojistnikvlastnik = (data.parametry.pojistnikvlastnik == 'false' || data.parametry.pojistnikvlastnik === false) ? false : true
        this.parametry.pojistnikprovozovatel = (data.parametry.pojistnikprovozovatel == 'false' || data.parametry.pojistnikprovozovatel === false) ? false : true
        this.parametry.vlastnikprovozovatel = (data.parametry.vlastnikprovozovatel == 'false' || data.parametry.vlastnikprovozovatel === false) ? false : true
        this.parametry.pocatek = data.parametry.pocatek ? new Date(data.parametry.pocatek) : new Date(new Date().getTime() + 30 * 60 * 60 * 1000)
        this.parametry.pocatek = this.parametry.pocatek < new Date() ? new Date() : this.parametry.pocatek  
        this.parametry.platba = data.parametry.platba || 'ROCNI'

    }
}

export interface IVozidla {
    kod: string;
    pojisteniId: string;
    datum: any;
    email: string;
    vozidlo: IVozidlo;
    pojistnik: IOsoba;
    vlastnik: IOsoba;
    provozovatel: IOsoba;
    rizika: IRizika;    
    parametry: IParametry;
}