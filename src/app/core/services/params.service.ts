import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, delay, finalize } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { ISeznamy, Seznamy } from '../models';

@Injectable({ providedIn: 'root' })
export class ParamsService {

    private lists$ = new BehaviorSubject<ISeznamy>(new Seznamy());
    public lists: ISeznamy;

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {}

    public updateLists(data: ISeznamy): void {
        this.lists$.next(data);
    }

    public getLists(): Observable<ISeznamy> {
        return this.lists$.asObservable();
    }

    public getListsValue(): ISeznamy {
        return this.lists$.value;
    }

    public onAppStart(): Promise<void> {
        const promise = this.getParametry().toPromise().then(async status => {
            // console.log('onAppStart loaded:', status);
        });
        return promise;
    }

    private getParametry(): Observable<Boolean> {
        let seznamy = new Seznamy();
        const path = '/vozidla/ciselniky';
        return this.apiService.get(`${path}`).pipe(
            tap(val => {
                console.info('Načtení parametrů zahájeno.');
            }),
            delay(0),
            map(data => {
                let resp = true;
                if (data['platba']) {
                    Object.keys(data['platba']).forEach(key => {
                        seznamy.platba.push( { value: key, label: data['platba'][key] } );
                    });
                } else {
                    resp = false;
                }                
                if (data['vozidloDruh']) {
                    Object.keys(data['vozidloDruh']).forEach(key => {
                        seznamy.druh.push( { value: key, label: data['vozidloDruh'][key] } );
                    });
                } else {
                    resp = false;
                }
                if (data['vozidloPalivo']) {
                    Object.keys(data['vozidloPalivo']).forEach(key => {
                        seznamy.palivo.push( { value: key, label: data['vozidloPalivo'][key] } );
                    });
                } else {
                    resp = false;
                }
                if (data['vozidloUziti']) {
                    Object.keys(data['vozidloUziti']).forEach(key => {
                        seznamy.uziti.push( { value: key, label: data['vozidloUziti'][key] } );
                    });
                } else {
                    resp = false;
                }
                if (data['vozidloNajezd']) {
                    Object.keys(data['vozidloNajezd']).forEach(key => {
                        seznamy.najezd.push( { value: key, label: data['vozidloNajezd'][key] } );
                    });
                } else {
                    resp = false;
                }
                /*
                if (data['vozidloZabezpeceni']) {
                    seznamy.vozidloZabezpeceni = data['vozidloZabezpeceni'];
                } else {
                    resp = false;
                }
                */
                if (data['vozidloZnacka']) {
                    let znacka = {
                        value: 0,
                        label: 'Abecední řazení',
                        children: []
                    };
                    Object.keys(data['vozidloZnacka']).forEach(key => {
                        znacka.children.push({ 
                            value: data['vozidloZnacka'][key].id,
                            label: data['vozidloZnacka'][key].nazev,
                            druhId: data['vozidloZnacka'][key].druhId
                        });
                    });
                    seznamy.znacka.push(znacka);
                    seznamy.formlyZnacka = znacka.children;
                } else {
                    resp = false;
                }               
                if (data['vozidloModel']) {
                    Object.keys(data['vozidloModel']).forEach(key => {
                        seznamy.model.push({
                            value: data['vozidloModel'][key].id,
                            label: data['vozidloModel'][key].nazev,
                            znackaId: data['vozidloModel'][key].znackaId
                        });
                    });
                } else {
                    resp = false;
                }
                if (data['osobaTyp']) {
                    Object.keys(data['osobaTyp']).forEach(key => {
                        seznamy.osobaTyp.push( { value: key, label: data['osobaTyp'][key] } );
                    });
                } else {
                    resp = false;
                }
                this.updateLists(seznamy);
                return resp;
            }),
            finalize(() => {
                console.info('Parametry načteny.');
                // console.log('Parametry: ', this.lists);
            })
        );
    }

    /**
     * Nová verze doplňování adres - komponenta adresa
     * @param  {String} co hledany parametr adresy [ulice, cp, psc, obec]
     * @param  {String} token retezec naseptavace
     * @param  {Object} data objekt s udaji adresy
     * @return {Observable[]}  vrací pole s objekty adres
     */
    public adresaHledej(co, token, data): Observable<any[]> {
        // console.log('https://www.srovnavac.eu/ruian/hledej?q=' + co + '&coid=' + data.castObceId
        //     + '&psc=' + data.psc + '&cp=' + data.cp + '&ulice=' + data.ulice + '&obec=' + data.obec);
        let cp = data.cp.split("/");
        if (cp.length > 1) cp = cp[0];
        return this.http.get<any[]>('https://www.srovnavac.eu/ruian/hledej?q=' + co
            + '&coid=' + (data.castObceId ? data.castObceId : '')
            + '&psc=' + (data.psc ? data.psc : '')
            + '&cp=' + (cp ? cp : '')
            + '&ulice=' + (data.ulice ? data.ulice : '')
            + '&obec=' + (data.obec ? data.obec : '')
        );
    }
  
}
