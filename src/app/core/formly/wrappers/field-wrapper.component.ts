import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'my-form-field-wrapper',
  template: `
    <ng-template #tooltip><div class="text-left" [innerHtml]="to.tooltip | translate"></div></ng-template>
    <div [class]="to.class" [class.has-error]="showError">
      <label
        *ngIf="to.label && to.hideLabel !== true"
        [attr.for]="id"
        class="col-form-label {{ to.grid?.label }}"
        placement="right"
        triggers="mouseenter:mouseleave"		
        [tooltip]="(to.tooltip | translate) === '' ? '' : tooltip"        
      >
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>
      <div class="{{ to.grid?.input }}">
        <ng-template #fieldComponent></ng-template>
      </div>
      <div *ngIf="showError" class="col-12 {{ to.grid?.offset }} invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <small *ngIf="to.description" class="col-12 form-text text-muted">{{
        to.description
      }}</small>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFormFieldWrapper extends FieldWrapper {
  defaultOptions = {
    templateOptions: {
      grid: {
        label: 'col-sm-4',
        input: 'col-sm-8',
      },
    },
  };
}
