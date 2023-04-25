import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const TEL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CzTelDirective),
  multi: true,
};

@Directive({
  selector: '[ngxCzTel]',
  providers: [TEL_VALUE_ACCESSOR],
  host: {
    '(input)': 'onInput($event.target.value)',
    '(blur)': 'onBlur()',
  },
})
export class CzTelDirective implements ControlValueAccessor {
  touchedFn: any = null;
  changeFn: any = null;
  disabled = false;

  prefix = '';
  prevValue = '';

  constructor(
    private readonly renderer: Renderer2,
    private readonly cd: ChangeDetectorRef,
    private readonly field: ElementRef<HTMLInputElement>,
  ) {}

  writeValue(obj: string | null): void {
    if (obj === null || obj === '') {
      this.updateValue('');
      this.prefix = '';
      return;
    }

    const prefix = /^(\+42[01])/.exec(obj);

    this.prefix = prefix?.[1] || '';

    this.onInput(obj);
  }

  registerOnChange(fn: any): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  onInput(value: string) {
    const selection = this.field.nativeElement.selectionStart;

    const originalLength = value.length;
    const charAfterSelection = value.charAt(selection);
    const lastChar = value.charAt(value.length - 1);

    if (Number.isNaN(+lastChar) && !(value.length === 1 && lastChar === '+')) {
      this.updateValue(value.slice(0, -1));
      return;
    }

    const prefix = /^(\+42[01])/.exec(value);
    this.prefix = prefix?.[1] || '+420';

    if (value.length < 6) {
      const failed = [...value].find(
        (char, length) =>
          (length === 0 && char !== '+') ||
          (length === 1 && char !== '4') ||
          (length === 2 && char !== '2') ||
          (length === 3 && char !== '0' && char !== '1') ||
          (length === 4 && char !== ' '),
      );
      if (failed) {
        this.updateValue(`${this.prefix || '+420'} ${lastChar}`);
      } else if (!value) {
        this.changeFn?.(null);
      }

      return;
    }

    value = value
      .replace(this.prefix, '')
      .replace(/\s/g, '')
      .replace(/\+/g, '');

    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    const send = value.length === 9;

    const formattedValue = [...value]
      .map((d, i) => (i % 3 === 0 ? ' ' + d : d))
      .join('')
      .trim();

    const prefixedValue = `${this.prefix} ${formattedValue}`;

    this.updateValue(prefixedValue);

    const sendValue = send ? prefixedValue.replace(/\s/g, '') : null;
    this.changeFn?.(sendValue);

    const position =
      originalLength < prefixedValue.length ||
      (this.prevValue.length <= prefixedValue.length &&
        charAfterSelection === ' ')
        ? selection + 1
        : selection;
    this.field.nativeElement.setSelectionRange(position, position);
    this.prevValue = prefixedValue;
  }

  onBlur(): void {
    this.touchedFn?.();
  }

  updateValue(value: string) {
    this.renderer.setProperty(this.field.nativeElement, 'value', value);
  }
}