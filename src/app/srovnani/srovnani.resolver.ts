import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';

import { PartneriService } from '../core';

@Injectable({
    providedIn: 'root',
})
export class SrovnaniResolver implements Resolve<any> {
    constructor(private partneriService: PartneriService) { }

    resolve() {
        // Get the Shell Provider from the service
        const shellProviderObservable = this.partneriService.getDataWithShell();
        // Resolve with Shell Provider
        const observablePromise = new Promise((resolve, reject) => {
            resolve(shellProviderObservable);
        });
        return observablePromise;
    }
}
