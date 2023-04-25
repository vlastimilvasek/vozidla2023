import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { csLocale } from 'ngx-bootstrap/locale';
defineLocale('cs', csLocale);
import { NgxSelectModule } from 'ngx-select-ex';

import { AlertComponent } from './alert/alert.component';
import { PrubehComponent } from './prubeh/prubeh.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { ParamsService } from '../core/services';

import { CzRcMaskDirective } from '../core/directives/czrc-mask.directive';
import { CzTelDirective } from '../core/directives/cztel-mask.directive';
import { NumberMaskDirective } from '../core/directives/number-mask.directive';

import { FormlyModule, FORMLY_CONFIG } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { configExtension } from '../core/formly/config';

import { KeysPipe, MenaFormatInfoPipe, MenaFormatPipe, SpolFormatPipe, TelefonFormatPipe, TipsPipe } from '../core/pipes';

import { FormlyFieldButton, FormlyFieldProgressBar, FormlyFieldOptDisabled, FormlyFieldNumberMask, FormlyFieldHledejRZ } from '../core/formly/fields/';
import { FormlyFieldRcMask } from '../core/formly/fields/rc.type';
import { FormlyFieldCzTelMask } from '../core/formly/fields/tel.type';
import { FormlyFieldSwitch } from '../core/formly/fields/switch.type';
import { FormlyFieldBtnRadio } from '../core/formly/fields/';
import { FormlyFieldRange } from '../core/formly/fields/range.type';
import { FormlyFieldDatepicker } from '../core/formly/fields/datepicker.type';
import { FormlyFieldTypeahead } from '../core/formly/fields/typeahead.type';
import { FormlyFieldAdresa } from '../core/formly/fields/adresa.type';
import { FormlyFieldNgxSelect } from '../core/formly/fields/ngx-select.type';

import { PanelWrapperComponent, MyFormFieldWrapper, HledejRZFieldWrapper } from '../core/formly/wrappers/';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function httpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
    return () => new Promise<any>((resolve: any) => {
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const lang = 'cs';
            translate.addLangs(['cs', 'en']);
            translate.setDefaultLang('cs');
            translate.use(lang).subscribe(() => {
                console.info(`Jazyková sada '${lang}' úspěšně načtena.'`);
            }, err => {
                console.error(`Problém s načtením jazykové sady: '${lang}'.'`);
            }, () => {
                resolve(null);
            });
        });
    });
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxSelectModule.forRoot({ optionValueField: 'value', optionTextField: 'label', keepSelectedItems: false }),
        TranslateModule.forRoot({
            defaultLanguage: "cs",
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            },
        }),
        FormlyBootstrapModule,
        FormlyModule.forRoot({
        }),
    ],
    declarations: [
        AlertComponent,
        PrubehComponent,
        PageNotFoundComponent,
        CzRcMaskDirective,
        CzTelDirective,
        NumberMaskDirective,
        FormlyFieldNumberMask,
        FormlyFieldButton,
        FormlyFieldHledejRZ,
        FormlyFieldProgressBar,
        FormlyFieldOptDisabled,
        FormlyFieldRcMask,
        FormlyFieldCzTelMask,
        FormlyFieldSwitch,
        FormlyFieldBtnRadio,
        FormlyFieldRange,
        FormlyFieldDatepicker,
        FormlyFieldTypeahead,
        FormlyFieldAdresa,
        FormlyFieldNgxSelect,
        PanelWrapperComponent,
        MyFormFieldWrapper,
        HledejRZFieldWrapper,
        KeysPipe,
        MenaFormatInfoPipe,
        MenaFormatPipe,
        SpolFormatPipe,
        TelefonFormatPipe,
        TipsPipe,
    ],
    exports: [
        AlertComponent,
        PrubehComponent,
        PageNotFoundComponent,
        CzRcMaskDirective,
        CzTelDirective,
        NumberMaskDirective,
        FormlyFieldNumberMask,
        FormlyFieldButton,
        FormlyFieldHledejRZ,
        FormlyFieldProgressBar,
        FormlyFieldOptDisabled,   
        FormlyFieldRcMask,
        FormlyFieldCzTelMask,
        FormlyFieldSwitch,
        FormlyFieldBtnRadio,
        FormlyFieldRange,
        FormlyFieldDatepicker,
        FormlyFieldTypeahead,
        FormlyFieldAdresa,
        FormlyFieldNgxSelect,
        PanelWrapperComponent,
        MyFormFieldWrapper,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        BsDatepickerModule,
        TypeaheadModule,
        TabsModule,
        ModalModule,
        PopoverModule,
        TooltipModule,
        NgxSelectModule,
        TranslateModule,
        FormlyBootstrapModule,
        FormlyModule,
        KeysPipe,
        MenaFormatInfoPipe,
        MenaFormatPipe,
        SpolFormatPipe,
        TelefonFormatPipe,
        TipsPipe,        
    ],
    providers: [
        {
            provide: FORMLY_CONFIG,
            multi: true,
            useFactory: configExtension,
            deps: [TranslateService],
        },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            deps: [ParamsService],
            useFactory: (paramsService: ParamsService) =>
                () => paramsService.onAppStart(),
            multi: true
        },
    ],
})

export class SharedModule { }
