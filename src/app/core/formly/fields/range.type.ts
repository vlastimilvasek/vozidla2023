import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-range',
  template: `
    <div class="row">
        <div class="col-8">
            <input
                type="range"
                [class.is-invalid]="showError"
                class="form-range custom-range"
                [class.position-static]="to.formRange === 'nolabel'"
                [formControl]="formControl"
                [formlyAttributes]="field"
                [min]="to.min"
                [max]="to.max"
                [step]="to.step"
            />
        </div>
        <div class="col-4 pt-2">
            <span *ngIf="formControl.value" class="float-right" [innerHTML]="formControl.value | menaFormat"></span>
        </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRange extends FieldType {
  defaultOptions = {
    templateOptions: {
      formRange: 'default', // 'default' | 'nolabel'
      min: 0,
      max: 5,
      step: 1,
    },
  };
}
