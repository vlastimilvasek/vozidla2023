import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { IPoptavkaResp, ISjednaniResp, IVozidla, Vozidla } from '../models';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {

    private data$ = new BehaviorSubject<IVozidla>( new Vozidla(null) );
    public valid = false;
    
    private jsonOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    }; 

    constructor(
        private apiService: ApiService
    ) {}

    public updateData(data: IVozidla): void {
        this.data$.next(data);
        console.log('Data aktualizována: ', this.getDataValue())
    }

    public getData(): Observable<IVozidla> {
        return this.data$.asObservable();
    }

    public getDataValue(): IVozidla {
        return this.data$.value;
    }

    /* **** API volání **** */
    public nactiKalkulaci(id: string): Observable<Boolean> {
        console.log('DATA.SERVICE nactiKalkulaci - id ', id);
        return this.apiService.get('/vozidla/kalkulace/' + id)
            .pipe(
                map(data => {
                    console.log('DATA.SERVICE nactiKalkulaci - id -map ', data);
                    this.updateData( new Vozidla(data.kalkulace) );
                    return true;
                }),
                // catchError()
            );
    }

    public ulozKalkulaci(data: IVozidla): Observable<Boolean> {
        return this.apiService.post('/vozidla/kalkulace', {kalkulace: data}, this.jsonOptions)
            .pipe(
                map(data => {
                    console.log('DATA.SERVICE ulozKalkulaci - map ', data);
                    this.updateData( new Vozidla(data.kalkulace) );
                    return true;
                }),
                // catchError()
            );
    }

    public emailKalkulace(data): Observable<Boolean> {
        return this.apiService.post('/app/emailkalk', data, this.jsonOptions)
            .pipe(
            );
    }
 
    public ulozSjednani(): Observable<ISjednaniResp> {
        console.log('SJEDNÁNÍ -  /app/sjednani');
        console.log('s daty');
        console.log( JSON.stringify(this.getDataValue) );        
        return this.apiService.post('/app/sjednani', this.getDataValue(), this.jsonOptions);
    }

    public getVozidloCKP(rz: string): Observable<Boolean> {
        let dataCKP = this.getDataValue();

        return this.apiService.post('/ckp/vozidlo', {"vozidlo":{"udaj":rz}}, this.jsonOptions)
            .pipe(
                delay(0),
                map(data => {
                    console.log(data);
                    if (data['vozidlo']) {
                        dataCKP.vozidlo.rz = data['vozidlo'].rz,
                        dataCKP.vozidlo.vtp = data['vozidlo'].vtp,
                        dataCKP.vozidlo.id = data['vozidlo'].id,
                        dataCKP.vozidlo.hmotnost = Number(data['vozidlo'].hmotnost),
                        dataCKP.vozidlo.objemMotoru = Number(data['vozidlo'].objemMotoru),
                        dataCKP.vozidlo.vykonMotoru = Number(data['vozidlo'].vykonMotoru),
                        dataCKP.vozidlo.palivoId = data['vozidlo'].palivoId;
                        dataCKP.vozidlo.uvedeniDoProvozu = data['vozidlo'].uvedeniDoProvozu ? new Date(data['vozidlo'].uvedeniDoProvozu) : null;
                        dataCKP.vozidlo.specifikace = data['vozidlo'].specifikace;
                        this.updateData(dataCKP);
                        return true;
                    } else {
                        return false;
                    }
                })
            );
    }

}