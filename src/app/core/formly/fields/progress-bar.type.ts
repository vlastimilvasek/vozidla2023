import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'formly-field-progress-bar',
    template: `
    <div class="progress mb-4" style="height: 3px;">
        <div class="progress-bar bg-success" role="progressbar" [style.width.%]="to.progress" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  `,
})
export class FormlyFieldProgressBar extends FieldType {
}