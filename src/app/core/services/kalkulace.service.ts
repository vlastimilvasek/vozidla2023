import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, delay, finalize } from 'rxjs/operators';

import { ApiService } from '../services';
import { IProdukt, Produkt } from '../models';

@Injectable({ providedIn: 'root' })
export class KalkulaceService {
    private produkty$ = new BehaviorSubject<IProdukt[]>([]);
    private vybranyProdukt$ = new BehaviorSubject<string>(null);
    private porovnaniProduktu$ = new BehaviorSubject<string[]>([]);

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {}

    public updateProdukty(data: IProdukt[]): void {
        this.produkty$.next(data);
        console.log('Produkty resetovany: ', this.getProduktyValue());
    }

    public pridatProdukty(data: IProdukt[]): void {
        this.produkty$.next([...this.produkty$.getValue(), ...data]);
    }

    public getProdukty(): Observable<IProdukt[]> {
        return this.produkty$.asObservable();
    }

    public getProduktyValue(): IProdukt[] {
        return this.produkty$.value;
    }

    public getProdukt(id: string): Observable<IProdukt> {
        return this.produkty$.pipe(
            map((produkty) =>
                produkty.find((prod) => prod.id === id)
            )
        );
    }

    public updateProdukt(id: string, data: IProdukt[]): void {
        const excl = this.produkty$.value.filter((prod) => prod.id !== id);
        this.produkty$.next([...excl, ...data]);
    }   

    public getProduktValue(id: string): IProdukt {
        return this.produkty$.value.find((prod) => prod.id === id)!;
    }  

    public getProduktyPartnera(partnerId: string): Observable<IProdukt[]> {
        return this.produkty$.pipe(
            map((produkty) =>
                produkty.filter((prod) => prod.pojistovna.id === partnerId)
            )
        );
    }

    public getProduktyPartneraValue(partnerId: string): IProdukt[] {
        return this.produkty$.value.filter((prod) => prod.pojistovna.id === partnerId);
    }

    public updateProduktyPartnera(partnerId: string, data: IProdukt[]): void {
        const excl = this.produkty$.value.filter((prod) => prod.pojistovna.id !== partnerId);
        this.produkty$.next([...excl, ...data]);
    }    

    public getVybranyProdukt(): string {
        return this.vybranyProdukt$.value;
    }

    public setVybranyProdukt(produkt: string): void {
        this.vybranyProdukt$.next(produkt);
    }    

    public PorovnavaneProdukty(): Observable<string[]> {
        return this.porovnaniProduktu$.asObservable();
    }

    public getPorovnavaneProdukty(): string[] {
        return this.porovnaniProduktu$.value;
    }

    public setPorovnavaneProdukty(produkty: string[]): void {
        this.porovnaniProduktu$.next(produkty);
    }  

    /*
    public getProduktyPartneraValue(partnerId: string): IProdukt[] {
        return this.produkty$.pipe(
            tap((produkty) =>
                produkty.filter((prod) => prod.pojistovna.id === partnerId)
            )
        ).value;
    }
    */

    /* **** API volání **** */
    public kalkuluj(kalkulaceKod: string, partnerId: string): void {
        this.apiService.get('/vozidla/kalkulace/' + kalkulaceKod + '/vypocet/' + partnerId).subscribe((data) => {
            // console.log('KALKULACE.SERVICE kalkuluj START', kalkulaceKod + ' ' + partnerId);
            console.log('KALKULACE.SERVICE kalkuluj START', data);
            const produkty = data.vypocet.produkty;
            const ceny = data.vypocet.ceny;
            produkty.forEach((produkt, index) => {
                // console.log(produkt.id, ceny[produkt.id]);
                produkt.ceny = ceny[produkt.id];
            });
            if (produkty.length > 1) produkty.sort((a, b) => a.ceny.lhutniPojistne < b.ceny.lhutniPojistne ? -1 : 1);
            this.updateProduktyPartnera(partnerId, produkty);
        });
    }

    public kalkulujProdukt(kalkulaceKod: string, produktId: string): Observable<any> {
        const dataObservable =  this.apiService.get('/vozidla/kalkulace/' + kalkulaceKod + '/produkt/' + produktId)
            .pipe(
                map((data) => {
                    const produkt = data.produkty.filter((p) => p.id === produktId);
                    const cena = data.vypocet[produktId];
                    if (produkt.length === 1) {
                        produkt[0].ceny = cena;
                        return produkt[0];
                    } else {
                        return {};
                    }
                }),
            );
        return dataObservable;
    }

    public nabidkaProduktu(kalkulaceKod: string, produktId: string): Observable<any> {
        const dataObservable =  this.apiService.get('/vozidla/kalkulace/' + kalkulaceKod + '/nabidka/' + produktId)
            .pipe(
                map((data) => {
                    if (data.pocet) {
                        const nabidka = data.dokumenty.filter((dok) => dok.kod === 'NABIDKA');
                        return nabidka[0];
                    } else {
                        return {};
                    }
                }),
            );
        return dataObservable;
    }    
}
