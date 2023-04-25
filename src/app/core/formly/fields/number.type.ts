import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-numbermask-input',
  template: `
    <input
      type="text"
      inputmode="decimal"
      [formControl]="formControl"
      class="form-control"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
      ngxNumberMask
      [options]="to.maskOptions"
      [typeahead]="to.typeahead"
      [typeaheadAsync]="to.typeaheadAsync"
      [typeaheadOptionsLimit]="to.typeaheadOptionsLimit"
      [typeaheadMinLength]="to.typeaheadMinLength"
      [typeaheadWaitMs]="to.typeaheadWaitMs"
      [typeaheadOptionField]="to.typeaheadOptionField"     
    />
  `
})
export class FormlyFieldNumberMask extends FieldType {
  defaultOptions = {
    templateOptions: {
      typeahead: [],      
      typeaheadOptionsLimit: 10,
      typeaheadMinLength: 1,
      typeaheadWaitMs: 300,
      typeaheadAsync: false
    },
  };  
}
