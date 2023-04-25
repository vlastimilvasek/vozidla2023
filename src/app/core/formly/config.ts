import { TranslateService } from '@ngx-translate/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormControl, ValidationErrors } from '@angular/forms';

import { FormlyFieldButton } from './fields/button.type';
import { FormlyFieldNumberMask } from './fields/number.type';
import { FormlyFieldRcMask } from './fields/rc.type';
import { FormlyFieldCzTelMask } from './fields/tel.type';
import { FormlyFieldSwitch } from './fields/switch.type';
import { FormlyFieldBtnRadio } from './fields/btn-radio.type';
import { FormlyFieldRange } from './fields/range.type';
import { FormlyFieldDatepicker } from './fields/datepicker.type';
import { FormlyFieldOptDisabled } from './fields/opt-disabled.type';
import { FormlyFieldProgressBar } from './fields/progress-bar.type';
import { FormlyFieldTypeahead } from './fields/typeahead.type';
import { FormlyFieldAdresa } from './fields/adresa.type';
import { FormlyFieldNgxSelect } from './fields/ngx-select.type';

import { CenteredWrapperComponent } from './wrappers/centered-wrapper.component';
import { HledejRZFieldWrapper } from './wrappers/hledej-rz-wrapper.component';
import { PanelWrapperComponent } from './wrappers/panel-wrapper.component';
import { MyFormFieldWrapper } from './wrappers/field-wrapper.component';

const inputLayout = {
    column : 'col-lg-6',
    label : 'col-sm-5',
    input : 'col-sm-7',
    offset : 'offset-sm-5',
    label2 : 'col-md-7 col-sm-7',
    input2 : 'col-md-5 col-sm-5',
    column1 : 'order-3 order-md-0 col-md-7 col-lg-6 col-xl-7',
    column2 : 'order-2 col-md-5 col-lg-5 offset-lg-1 col-xl-4',
    info1 : 'col-sm-3 col-md-12',
    info2 : 'col-sm-9 col-md-12',
};

export class TranslateExtension {
    constructor(private translate: TranslateService) { }

    prePopulate(field: FormlyFieldConfig) {
        const to = field.templateOptions || {};

        if (to.label && !to._translated) {
            to._translated = true;
            field.expressionProperties = {
                ...(field.expressionProperties || {}),
                'templateOptions.label': this.translate.stream(
                    field.templateOptions.label
                ),
            };
        }

        if (to.placeholder && !to._translatedPlaceholder) {
            to._translatedPlaceholder = true;
            field.expressionProperties = {
                ...(field.expressionProperties || {}),
                'templateOptions.placeholder': this.translate.stream(
                    field.templateOptions.placeholder
                ),
            };
        }

        if (to.tooltip && !to._translatedTooltip) {
            to._translatedTooltip = true;
            field.expressionProperties = {
                ...(field.expressionProperties || {}),
                'templateOptions.tooltip': this.translate.stream(
                    field.templateOptions.tooltip
                ),
            };
        }
    }
}

export function configExtension(translate: TranslateService) {
    return {
        types: [
            {
                name: 'radio',
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },
            },
            {
                name: 'opt-disabled',
                wrappers: ['myfield'],
                component: FormlyFieldOptDisabled,
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },
            },            
            {
                name: 'progress-bar',
                component: FormlyFieldProgressBar,
            },             
            {
                name: 'input',
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },
            },
            {
                name: 'textarea',
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: {
                            label: 'col-12',
                            input: 'col-12',
                        },
                        hideRequiredMarker: true,
                    },
                },
            },
            {
                name: 'number-mask',
                component: FormlyFieldNumberMask,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },                
            },
            {
                name: 'rc-mask',
                component: FormlyFieldRcMask,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },                
            },
            {
                name: 'tel-mask',
                component: FormlyFieldCzTelMask,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },                
            },
            {
                name: 'switch',
                component: FormlyFieldSwitch,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        hideLabel: false,
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },
            },
            {
                name: 'range',
                component: FormlyFieldRange,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-0',
                    },
                },
            },
            {
                name: 'btn-radio',
                component: FormlyFieldBtnRadio,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },
            },
            {
                name: 'button',
                component: FormlyFieldButton,
                defaultOptions: {
                    templateOptions: {
                        btnType: 'default',
                        type: 'button',
                    },
                },
            },            
            {
                name: 'datepicker',
                component: FormlyFieldDatepicker,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },
            },
            {
                name: 'typeahead',
                component: FormlyFieldTypeahead,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },
            },
            {
                name: 'adresa',
                component: FormlyFieldAdresa,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                },
            },
            {
                name: 'ngx-select',
                component: FormlyFieldNgxSelect,
                wrappers: ['myfield'],
                defaultOptions: {
                    templateOptions: {
                        placeholder: translate.instant('FORM.SELECT.DEFAULT'),
                        noResultsFound: translate.instant('FORM.SELECT.NOTFOUND'),
                        grid: inputLayout,
                        hideRequiredMarker: true,
                        class: 'row form-group mb-3',
                    },
                    validation: {
                        messages: {
                            required: translate.stream('FORM.VALIDATION.SELECT')
                        },
                    },
                },

            },
        ],
        validators: [
            { name: 'ip', validation: IpValidator },
        ],
        validationMessages: [
            { name: 'ip', message: IpValidatorMessage },
            {
                name: 'required',
                message() {
                    return translate.stream('FORM.VALIDATION.REQUIRED');
                }
            },
            {
                name: 'min',
                message(err, field: FormlyFieldConfig) {
                    return translate.stream('FORM.VALIDATION.MIN', { value: err.min });
                }
            },
            {
                name: 'max',
                message(err, field: FormlyFieldConfig) {
                    return translate.stream('FORM.VALIDATION.MAX', { value: err.max });
                }
            },
            {
                name: 'minlength',
                message(err, field: FormlyFieldConfig) {
                    return translate.stream('FORM.VALIDATION.MINLENGTH', { value: field.templateOptions.minLength });
                }
            },
            {
                name: 'maxlength',
                message(err, field: FormlyFieldConfig) {
                    return translate.stream('FORM.VALIDATION.MAXLENGTH', { value: field.templateOptions.maxLength });
                }
            },            
        ],
        wrappers: [
            { name: 'panel', component: PanelWrapperComponent },
            { name: 'myfield', component: MyFormFieldWrapper },
            { name: 'centered', component: CenteredWrapperComponent },
            { name: 'hledej-rz', component: HledejRZFieldWrapper },
        ],
        extensions: [
            {
                name: 'translate-extension',
                extension: new TranslateExtension(translate),
            },
        ],
    };
}

export function IpValidator(control: FormControl): ValidationErrors {
    return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { 'ip': true };
}

export function IpValidatorMessage(err, field: FormlyFieldConfig) {
    return `"${field.formControl.value}" is not a valid IP Address`;
}
