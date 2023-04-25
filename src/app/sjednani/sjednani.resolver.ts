import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, defer } from 'rxjs';
import { finalize, tap, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class SjednaniResolver implements Resolve<any> {

    constructor(
        private http: HttpClient
    ) { }

    // This should be in a separate service
    private getData(): Observable<any> {
        const dataObservable = this.http.get<any>('./assets/page-data.json').pipe(
            tap(val => {
                console.log('getData STARTED');
            }),
            delay(5000),
            finalize(() => {
                console.log('getData COMPLETED');
            })
        );

        return dataObservable;
    }

    resolve() {
        // Base Observable (where we get data from)
        const dataObservable = this.getData();
        // Resolver using a Promise that resolves the base Observable
        const observablePromise = new Promise((resolve, reject) => {
            resolve(dataObservable);
        });
        return observablePromise;
    }
}
