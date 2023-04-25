import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-cztelmask-input',
  template: `
    <input
      type="text"
      inputmode="decimal"
      [formControl]="formControl"
      class="form-control"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
      ngxCzTel
    />
  `
})
export class FormlyFieldCzTelMask extends FieldType {}
