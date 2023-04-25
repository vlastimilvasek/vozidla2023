import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'app-form-datepicker-type',
    template: `
    <div class="input-group">
        <input type="text"
            class="form-control calendar"
            placement="bottom"
            bsDatepicker
            #id="bsDatepicker"
            [formlyAttributes]="field"
            [bsConfig]="to.bsConfig"
            [minDate]="to.minDate"
            [maxDate]="to.maxDate"
            [formControl]="formControl"
            [class.is-invalid]="showError"
            autocomplete="off"
        >
        <div class="input-group-append" (click)="id.show()">
            <span class="input-group-text"><i class="fa fa-calendar"></i></span>
        </div>
    </div>`,
})
export class FormlyFieldDatepicker extends FieldType {
    defaultOptions = {
        templateOptions: {
            bsConfig: {
                dateInputFormat: 'D.M.YYYY',
                showWeekNumbers: false,
                containerClass: 'theme-default',
            },
        },
    };
}
