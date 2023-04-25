import { Component, ViewChild, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-centered',
  template: `
      <div class="row justify-content-center align-items-center">
        <div [class]="to.class">
            <ng-container #fieldComponent></ng-container>
        </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenteredWrapperComponent extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef })
  fieldComponent: ViewContainerRef;
}
