import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, pipe } from 'rxjs';
import { catchError, delay, distinctUntilChanged, map } from 'rxjs/operators';
import { IPoptavkaResp, ISjednaniResp, IVozidla, Vozidla } from '../models';


@Injectable({ providedIn: 'root' })
export class DataService {
    public data: IVozidla;

    constructor(
        private http: HttpClient
    ) { }

    validate(): Boolean {
        if (
            ((this.data.pojistnik.rc || this.data.pojistnik.ic) && this.data.pojistnik.email && this.data.pojistnik.telefon) &&
            (this.data.vozidlo.znacka_text || this.data.vozidlo.rz || this.data.vozidlo.vin)
        ) {
            return true;
        } else {
            return false;
        }
    }

    getVozidloCKP(rz: string): Observable<Boolean> {
        const params = new HttpParams({});
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        const path = 'https://www.srovnavac.eu/api/vozidla/app/vozidlo?data[vozidlo][rz]=' + rz;
        return this.http.get(`${path}`, { headers, params })
            .pipe(
                delay(0),
                map(data => {
                    if (data['status']) {
                        this.data.vozidlo.rz = data['vozidlo'].rz,
                            this.data.vozidlo.vtp = data['vozidlo'].vtp,
                            this.data.vozidlo.vin = data['vozidlo'].vin,
                            this.data.vozidlo.hmotnost = Number(data['vozidlo'].hmotnost),
                            this.data.vozidlo.objem_motoru = Number(data['vozidlo'].objem_motoru),
                            this.data.vozidlo.vykon_motoru = Number(data['vozidlo'].vykon_motoru),
                            this.data.vozidlo.palivo = data['vozidlo'].palivo;
                        this.data.vozidlo.uvedenidp = new Date(data['vozidlo'].uvedenidp)
                        this.data.vozidlo.znacka_text = data['vozidlo'].znacka_text;
                        return true;
                    } else {
                        return false;
                    }
                }
                )
            );
    }

    ulozPoptavkuHAV(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        // console.log('Volání -  https://www.srovnavac.eu/api/vozidla/app/poptavkahav');
        // console.log('s daty');
        // console.log( JSON.stringify(data) );        
        return this.http.post<IPoptavkaResp>('https://www.srovnavac.eu/api/vozidla/app/poptavkahav', data, httpOptions);
    }

}
