import { IProdukt } from '../models';

export interface IPartner {
  id: string;
  nazev: string;
  logo: string;
  logoHorizontal: string;
  produkty: Array<IProdukt>;
  minCena?: number;
  nacteno?: boolean;
  vsechnyProdukty?: boolean;
}

export class Partner {
  id: string;
  nazev: string;
  logo: string;
  logoHorizontal: string;
  produkty: Array<IProdukt>;
  minCena?: number;
  nacteno?: boolean;
  vsechnyProdukty?: boolean;
}
