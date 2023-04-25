import { IPojistovna, IParametr, IDokument, ITip } from '../models';

export interface IProdukt {
  id: string;
  nazev: string;
  pojisteniId: string;
  pojisteniKategorieId: string;
  pojistovna: IPojistovna;
  popis: string;
  parametry: {
    povinneRuceni: IParametr;
    rozsirenaAsistence: IParametr;
    pravniAsistence: IParametr;
    nahradniVozidlo: IParametr;
    pojisteniSkel: IParametr;
    pojisteniUrazu: IParametr;
    pojisteniZavazadel: IParametr;
    srazkaSeZviretem: IParametr;
    poskozeniZviretem: IParametr;
    zivel: IParametr;
    odcizeni: IParametr;
    vandalismus: IParametr;
    havarie: IParametr;
    gap: IParametr;
    spoluucast: IParametr;
  };
  dokumenty: Array<IDokument>;
  tipy: Array<ITip>;
  zakladni: any;
  extra: any;
  top: boolean;
  ceny?: any;
}

export class Produkt {
  id: string;
  nazev: string;
  pojisteniId: string;
  pojisteniKategorieId: string;
  pojistovna: IPojistovna;
  popis: string;
  parametry: {
    povinneRuceni: IParametr;
    rozsirenaAsistence: IParametr;
    pravniAsistence: IParametr;
    nahradniVozidlo: IParametr;
    pojisteniSkel: IParametr;
    pojisteniUrazu: IParametr;
    pojisteniZavazadel: IParametr;
    srazkaSeZviretem: IParametr;
    poskozeniZviretem: IParametr;
    zivel: IParametr;
    odcizeni: IParametr;
    vandalismus: IParametr;
    havarie: IParametr;
    gap: IParametr;
    spoluucast: IParametr;
  };
  dokumenty: Array<IDokument>;
  tipy: Array<ITip>;
  zakladni: any;
  extra: any;
  top: boolean;
  ceny?: any;
}
