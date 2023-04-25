import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'hledej-rz-field-wrapper',
  template: `
    <div class="form-group" [class.has-error]="showError">
        <ng-template #fieldComponent></ng-template>
        <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
            <formly-validation-message [field]="field"></formly-validation-message>
        </div>
    </div>
  `,
})
export class HledejRZFieldWrapper extends FieldWrapper {}
