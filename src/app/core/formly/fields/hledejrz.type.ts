import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { DataService, AlertService } from '../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'formly-field-hledej-input',
    template: `
    <div class="form-inline justify-content-center">
        <div class="input-group">
            <input
                type="text"
                [id]="id"
                [name]="field.name || id"
                [class.is-invalid]="showError"
                class="form-control"
                [formControl]="formControl"
                [formlyAttributes]="field"
            />
            <div class="input-group-append">
                <button (click)="hledejVozidlo()" class="btn btn-outline-success" type="button">{{ 'ZADANI.RZ.SUBMIT' | translate }}</button>
            </div>
        </div>
        <button type="button" (click)="odeslat()" class="mx-2 btn btn-outline-secondary">{{ 'ZADANI.RZ.CANCEL' | translate }}</button>
    </div>
    `
})
export class FormlyFieldHledejRZ extends FieldType {
    defaultOptions = {
    };

    layout = {
        rzProgress: 0,
        rzLoading: false,
        rzLoaded: false,
    }    

    constructor(
        private translate: TranslateService,
        private dataService: DataService,
        private alertService: AlertService,
    ) {
        super()
    }    

    public hledejVozidlo(): void {
        console.log(this.field.parent.formControl.invalid);
        console.log(this.field.model);
        this.alertService.clear();
        if (this.field.parent.formControl.invalid) {
            return;
        }
        this.layout.rzLoading = true;
        for (let i = 1; i <= 300; i++) {
            setTimeout(() => {
                this.layout.rzProgress = i;
            }, i * 100);
        }
        this.dataService.getVozidloCKP(this.field.model.vozidlo.rz).subscribe((result: boolean) => {
            if (result) {
                this.alertService.success(this.translate.instant('ZADANI.RZ.SUCCESS', { vozidlo: this.field.model.vozidlo.specifikace ? this.field.model.vozidlo.specifikace : this.field.model.vozidlo.rz }), { keepAfterRouteChange: true });
            } else {
                this.alertService.info(this.translate.instant('ZADANI.RZ.FAILED'), { keepAfterRouteChange: true });
            }
            this.layout.rzLoaded = true;
            this.layout.rzLoading = false;
        });
    } 
    
    public odeslat(): void {
        this.layout.rzLoaded=true;
        console.log('Kliknuto');
    }    
}

/*



    <input
        type="text"
        [id]="id"
        [name]="field.name || id"
        [formControl]="formControl"
        class="form-control"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
    />    
*/