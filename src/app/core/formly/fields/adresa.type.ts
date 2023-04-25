import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { noop, Observable, Observer, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    received_events_url: string;
    type: string;
    score: number;
}

@Component({
    selector: 'formly-field-adresa',
    template: ` 
    <div *ngIf="field.formControl.value" class="mt-2">
      {{ adresaText }}
      <i class="px-2 text-success fas fa-check"></i> <span [innerHtml]="'ADRESA.ID.OVERENO' | translate"></span>
    </div>
    <input type="hidden" [formControl]="formControl" [formlyAttributes]="field" />
    <input
      type="text"
      class="form-control"
      [class.is-invalid]="showError"
      [(ngModel)]="search"
      [placeholder]="to.placeholder | translate"
      [typeahead]="suggestions$"
      [typeaheadAsync]="to.typeaheadAsync"
      [typeaheadOptionsLimit]="to.typeaheadOptionsLimit"
      [typeaheadMinLength]="to.typeaheadMinLength"
      [typeaheadWaitMs]="to.typeaheadWaitMs"
      (typeaheadOnSelect)="onSelect($event)"
      [typeaheadOptionField]="to.typeaheadOptionField"
      autocomplete="off"
    >
    <div *ngIf="errorMessage">{{ errorMessage }}</div>
    `,
    changeDetection: ChangeDetectionStrategy.Default
})
export class FormlyFieldAdresa extends FieldType {
    search?: string;
    suggestions$?: Observable<any>;
    errorMessage?: string;
    adresaText?: string;

    defaultOptions = {
        templateOptions: {
            typeahead: [],
            typeaheadOptionsLimit: 10,
            typeaheadMinLength: 3,
            typeaheadWaitMs: 300,
            typeaheadAsync: true,
            typeaheadOptionField: 'kadresa',
            typeaheadOnSelect: "onSelect($event)",
        },
    };

    constructor(private http: HttpClient) {
        super()
    }

    ngOnInit(): void {
        this.suggestions$ = new Observable((observer: Observer<string | undefined>) => {
            observer.next(this.search);
        }).pipe(
            switchMap((query: string) => {
                if (query) {
                    const body = {
                        q: query
                    };
                    let headers = new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': `${environment.search_auth}`
                    });
                    let options = { headers: headers };
                    const path = "/indexes/adresy_index/search";
                    // console.log('adresaTypeahead ', body);
                    return this.http.post(
                        `${environment.search_url}${path}`,
                        JSON.stringify(body),
                        options
                    )
                        .pipe(
                            // map((data: any) => data && data.hits || []),
                            map(data => {
                                data['hits'].forEach((a, index) => {
                                    a.kadresa = a.nazev_ulice + ' ' + a.cislo + ', ' + a.psc + ' ' + a.nazev_obce;
                                });
                                return data['hits'];
                            }),
                            tap(() => noop, err => {
                                // in case of http error
                                this.errorMessage = err && err.message || 'Něco se nepovedlo';
                            })
                        );
                }

                return of([]);
            })
        );

        if (!this.adresaText && this.field.formControl.value) {
            // console.log('AdresaText dohledani ', this.field.formControl.value);
            this.http.get<any[]>('https://api.srovnavac.cz/api/ruian/adresa/' + this.field.formControl.value)
            .subscribe((adresa: any[]) => {
                if (adresa.length) {
                    const a = adresa[0];
                    this.adresaText = a['nazev_ulice'] + ' ' + a['cislo'] + ', ' + a['psc'] + ' ' + a['nazev_obce'];
                    console.log('Adresa dohledani ', this.adresaText);
                    this.field.templateOptions.typeaheadOnSelect(a);
                    this.field.focus = true;
                }
            });
        }
    }

    onSelect(evt): void {
        // console.log(evt.item);
        this.adresaText = evt.item.kadresa;
        this.field.formControl.setValue(evt.item.id);
        this.search = '';
        this.field.templateOptions.typeaheadOnSelect(evt.item);
    }
}
