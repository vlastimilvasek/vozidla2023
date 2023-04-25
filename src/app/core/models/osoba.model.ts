import { IAdresa } from '../models';

export interface IOsoba {
    typOsobyId: string;
    id: string;
    titul: string;
    titulZa: string;
    jmeno: string;
    prijmeni: string;
    spolecnost: string;
    platceDph: boolean;
    telefon: string;
    email: string;
    adresaId: number;
    adresa: IAdresa;
}
