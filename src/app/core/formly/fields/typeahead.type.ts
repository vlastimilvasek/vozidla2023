import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-typeahead',
  template: `
    <input
      type="text"  
      [formControl]="formControl"
      class="form-control"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
      [typeahead]="to.typeahead"
      [typeaheadAsync]="to.typeaheadAsync"
      [typeaheadOptionsLimit]="to.typeaheadOptionsLimit"
      [typeaheadMinLength]="to.typeaheadMinLength"
      [typeaheadWaitMs]="to.typeaheadWaitMs"
      (typeaheadOnSelect)="zmena($event)"
      [typeaheadOptionField]="to.typeaheadOptionField"
      autocomplete="off"
    >
  `,
})
export class FormlyFieldTypeahead extends FieldType {
  defaultOptions = {
    templateOptions: {
      typeahead: [],
      typeaheadOptionsLimit: 10,
      typeaheadMinLength: 3,
      typeaheadWaitMs: 300,
      typeaheadAsync: false,
      typeaheadOptionField: 'id',
      typeaheadOnSelect: "zmena($event)",
    },
  };

  zmena(evt): void {
    // console.log(evt.item);
    this.field.templateOptions.typeaheadOnSelect(evt);
  }   
}
