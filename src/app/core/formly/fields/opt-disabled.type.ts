import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'formly-field-opt-disabled',
    template: `
        <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">
                    <input type="checkbox" #OPTD value="1" checked="pChecked" (change)="zmena($event)" />&nbsp;<span [innerHtml]="to.disLabel | translate"></span>
                </div>
            </div>  
            <input
                type="text"  
                [formControl]="formControl"
                class="form-control"
                [formlyAttributes]="field"
                [class.is-invalid]="showError"
            >        
        </div>	    
    `,
    changeDetection: ChangeDetectionStrategy.Default
})
export class FormlyFieldOptDisabled extends FieldType {
    pChecked = true;

    zmena(evt): void {
        this.pChecked = evt.target.checked;
        this.field.templateOptions.disabled = !this.pChecked;
        this.field.templateOptions.required = this.pChecked;
        if (!this.pChecked) this.field.formControl.setValue('');
    }    
}
