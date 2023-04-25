import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-rcmask-input',
  template: `
    <input
      type="text"
      inputmode="decimal"
      [formControl]="formControl"
      class="form-control"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
      ngxCzRc
      [options]="to.maskOptions"
    />
  `
})
export class FormlyFieldRcMask extends FieldType {}