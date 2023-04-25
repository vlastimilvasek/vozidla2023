import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'formly-field-btn-radio',
    template: `
    <div class="btn-group btn-group-toggle {{ to.size == 'small' ? 'btn-group-sm' : (to.size == 'large' ? 'btn-group-lg' : '')}}" role="group" aria-label="">
      <ng-container
        *ngFor="
          let option of (to.options);
          let i = index
        "
      >
        <label class="btn btn-outline-primary"
          [class.active]="option.value === formControl.value"
          [for]="id + '_' + i">
          <input
            type="radio"
            autocomplete="off"
            [id]="id + '_' + i"
            [name]="field.name || id"
            [class.is-invalid]="showError"
            [attr.value]="option.value"
            [value]="option.value"
            [formControl]="formControl"
            [formlyAttributes]="field"
            [attr.disabled]="
              option.disabled || formControl.disabled ? true : null
            "
          />
          <div class="text-center" [innerHtml]="option.label"></div>
        </label>
      </ng-container>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldBtnRadio extends FieldType {
    defaultOptions = {
        templateOptions: {
            options: [],
            size: 'default', // 'small'/'default'/'large'
        },
    };
}
