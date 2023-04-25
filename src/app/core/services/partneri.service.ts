import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap, delay, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { ApiService } from './api.service';
import { IPartner, Partner } from '../models';

import { PartneriShellModel } from '../../srovnani/partneri-shell.model';
import { ShellProvider } from '../../srovnani/shell.provider';

@Injectable({ providedIn: 'root' })
export class PartneriService {

    shellModel: IPartner[] =[
        new Partner(),
        new Partner(),
        new Partner(),
        new Partner(),
        new Partner(),
    ]

    private partneri$ = new BehaviorSubject<IPartner[]>([]);

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.partneri$.next(this.shellModel);
    }

    public resetPartneri(): void {
        this.partneri$.next(this.shellModel);
        console.log('Partneri resetovani: ', this.getPartneriValue());
    }

    public updatePartneri(data: IPartner[]): void {
        this.partneri$.next(data);
    }

    public getPartneri(): Observable<IPartner[]> {
        return this.partneri$.asObservable();
    }

    public getPartneriValue(): IPartner[] {
        return this.partneri$.value;
    }

    public getPartneriList(): Observable<any> {
        const data = this.getPartneriValue();
        return of({partneri: data});
    }    

    /* **** API volání **** */
    public nactiPartneri(druhVozidla: string): void {
        // const dataObservable = this.http.get<any>('./assets/page-data.json')
        let queryParams = new HttpParams();
        queryParams = queryParams.append("druhVozidla", druhVozidla);
        const dataObservable =  this.apiService.get('/vozidla/pojistovny', queryParams)
        .subscribe((data) => {
            // console.log('PARTNERI.SERVICE nactiPartneri ', data.partneri);
            this.updatePartneri(data.partneri.sort((a, b) => Math.random() > Math.random() ? -1 : 1));
        })
    }

    public getDataWithShell(): Observable<IPartner[]> {
        // Initialize the model specifying that it is a shell model
        // const shellModel: PartneriShellModel = new PartneriShellModel(true);
        const shellModel: IPartner[] =[
            new Partner(),
            new Partner(),
            new Partner(),
            new Partner(),
            new Partner(),
        ]
        const dataObservable = this.getPartneri();
        const shellProvider = new ShellProvider(shellModel, dataObservable);
        return shellProvider.observable;
    }
}
