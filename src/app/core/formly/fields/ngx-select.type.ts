import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ngx-select',
  template: `
    <ngx-select
      class="frm-control"
      [placeholder]="to.placeholder | translate"
      optGroupOptionsField="children"
      noResultsFound
      [items]="to.options"
      [multiple]="to.multiple"
      [allowClear]="to.allowClear"
      [formlyAttributes]="field"    
      [class.is-invalid]="showError"        
      [formControl]="formControl"
      autocomplete="off"      
      >
    </ngx-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldNgxSelect extends FieldType {
  defaultOptions = {
    templateOptions: {
      options: [],
      size: 'default', // 'small'/'default'/'large'
      noResultsFound: 'žádná položka',
      showOptionNotFoundForEmptyItems: false,
      noSanitize: false,
      multiple: false,
      allowClear: false,
    },
  };
}
