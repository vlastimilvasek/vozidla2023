import { Injectable } from '@angular/core';
import { Router, Resolve} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZaverResolver implements Resolve<boolean> {
  
  constructor() { }

  resolve(): Observable<any> {
    return of(1);
  }
  
}