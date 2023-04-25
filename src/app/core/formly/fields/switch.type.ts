import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-switch',
  template: `
    <ng-template #tooltip><div class="text-left" [innerHtml]="to.tooltip | translate"></div></ng-template>
    <div class="form-check form-switch custom-control custom-switch">
      <input
        type="checkbox"
        [class.is-invalid]="showError"
        class="form-check-input custom-control-input"
        [class.position-static]="to.formCheck === 'nolabel'"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <label
        *ngIf="to.formCheck !== 'nolabel'"
        [for]="id"
        placement="right"
        triggers="mouseenter:mouseleave"		
        [tooltip]="(to.tooltip | translate) === '' ? '' : tooltip"         
        class="form-check-label custom-control-label"
      >
        <span *ngIf="to.hideLabel">{{ to.label }}</span>
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlyFieldSwitch extends FieldType {
  defaultOptions = {
    templateOptions: {
      indeterminate: true,
      tooltip: '',
    }
  };
}
