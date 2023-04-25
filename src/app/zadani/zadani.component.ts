import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DataService, ParamsService, Seznamy, IVozidla, Vozidla } from '../core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, debounceTime, tap } from 'rxjs/operators';
// import { slideRightLeftAnimation } from '../core/animations';

@Component({
    selector: 'app-zadani',
    templateUrl: './zadani.component.html',
})
export class ZadaniComponent implements OnInit {

    data: IVozidla;
    lists: Seznamy;
    layout;
    dataSubs: Subscription;

    bsConfig: Partial<BsDatepickerConfig>;
    minDate: Date;
    maxDate: Date;

    formlyForm = new FormGroup({});
    formlyOptions: FormlyFormOptions = {};
    formlyFields: FormlyFieldConfig[];

    @ViewChild('debugModal', { static: true }) debugModal: any;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Đ' || event.key === 'ð') { this.debugModal.show(); }
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
        private translate: TranslateService,
        private alertService: AlertService,
        private paramsService: ParamsService,
        private localeService: BsLocaleService
    ) {
    }

    ngOnInit() {
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default', adaptivePosition: false, dateInputFormat: 'D.M.YYYY' });
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - 365 * 100);
        this.maxDate.setDate(this.maxDate.getDate() + 30);
        this.localeService.use('cs');

        this.dataSubs = this.dataService.getData().subscribe(data => {
            this.data = {
                ...data
            };
        });
        this.lists = this.paramsService.getListsValue();

        this.setFields();
        this.setOptions();
        // nezobrazovat vyhledavani vozidla, když už mám údaje (při návratu
        if (this.data.vozidlo.id || this.data.vozidlo.vtp || (this.data.vozidlo.druhId || this.data.vozidlo.vykonMotoru)) {
            this.formlyOptions.formState.layout.rzLoaded = true;
        }

        if (this.route.snapshot.queryParams['kod'] !== undefined ) {
            // TODO
            this.dataService.nactiKalkulaci( this.route.snapshot.queryParams['kod'] ).subscribe( resp => console.log('ZADANI - nactiKalkulaci', resp));
            this.formlyOptions.formState.layout.rzLoaded = true;
        } else if (this.route.snapshot.queryParams.data !== undefined ) {
            try {
                this.dataService.updateData( new Vozidla(JSON.parse(this.route.snapshot.queryParams.data)) );
                this.formlyOptions.formState.layout.rzLoaded = true;
            } catch (e) {
                console.log(e);
            }
        } 
    }

    public ngOnDestroy(): void {
        this.dataSubs.unsubscribe();
    } 

    onSubmit() {
        // console.log('ZADANI form ', this.formlyForm.invalid);
        if (this.formlyForm.invalid) {
            return;
        }
        this.dataService.updateData(this.data);
        this.router.navigate(['../rozsah'], { relativeTo: this.route });
    }

    private setOptions() {
        this.formlyOptions = {
            formState: {
                selectOptionsData: {
                    vozidloZnacka: this.lists.znacka,
                    vozidloModel: this.lists.model,
                    pojisteni: [
                        { value: 'POV', label: '<i class="icon shape-pov fa-3x"></i><br />Povinné ručení', show: ['ALL'] },
                        { value: 'POVHAV', label: 'Povinné ručení<br /><i class="icon shape-pov"></i> + <i class="icon shape-hav"></i><br />Havarijní pojištění', show: ['OSOBNI', 'UZITKOVY'] },
                        { value: 'HAV', label: '<i class="icon shape-hav fa-3x"></i><br />Havarijní pojištění', show: ['OSOBNI', 'UZITKOVY'] },
                    ],
                },
                layout: {
                    rzProgress: 0,
                    rzLoading: false,
                    rzLoaded: false,
                },                 
            },           
        };
    }    

    public hledejVozidlo(): void {
        this.alertService.clear();
        if (this.formlyForm.invalid) {
            // console.log(this.formlyForm);
            // return;
        }
        console.log("hledejVozidlo - RZ", this.data.vozidlo.rz);
        this.formlyOptions.formState.layout.rzLoading = true;
        for (let i = 1; i <= 300; i++) {
            setTimeout(() => {
                this.formlyOptions.formState.layout.rzProgress = i;
            }, i * 100);
        }
        this.dataService.getVozidloCKP(this.data.vozidlo.rz).subscribe((result: boolean) => {
            if (result) {
                this.alertService.success(this.translate.instant('ZADANI.RZ.SUCCESS', { vozidlo: this.data.vozidlo.specifikace ? this.data.vozidlo.specifikace : this.data.vozidlo.rz }), { keepAfterRouteChange: true });
            } else {
                this.alertService.info(this.translate.instant('ZADANI.RZ.FAILED'), { keepAfterRouteChange: true });
            }
            this.formlyOptions.formState.layout.rzLoaded = true;
            this.formlyOptions.formState.layout.rzLoading = false;
        });
    }

    obecList(osoba: string, psc = null): Observable<any[]> {
        const options = [];
        return this.paramsService.adresaHledej('obec-cast', '', this.data[osoba].adresa).pipe(
            map(casti => {
                // console.log('casti obce : ', casti);
                casti.forEach(opt => {
                    options.push({
                        label: opt.nazev,
                        value: opt.id,
                        obec: opt.nazev_obce
                    });
                });
                if (casti.length === 1) {
                    this.data[osoba].adresa.castObceId = casti[0].id;
                    // this.data[osoba].adresa.obec = casti[0].nazev_obce;
                }
                this.lists[osoba].castiobce = options;
                // console.log('options : ', options);
                return options;
            })
        );
    }

    nastavRizika(pojisteniKategorieId: string): void {
        console.log('nastavRizika - pojisteniKategorieId : ', pojisteniKategorieId);
        if (pojisteniKategorieId !== 'POV') {
            this.data.rizika.havarie = this.data.rizika.odcizeni = this.data.rizika.vandalismus = Math.max(1, this.data.vozidlo.cena);
            this.data.rizika.zivel = this.data.rizika.srazkaSeZviretem = this.data.rizika.poskozeniZviretem = Math.max(1, this.data.vozidlo.cena);
        }
        if (pojisteniKategorieId === 'POV') {
            this.data.rizika.havarie = this.data.rizika.odcizeni = this.data.rizika.gap = this.data.rizika.vandalismus = 0;
            this.data.rizika.zivel = this.data.rizika.srazkaSeZviretem = this.data.rizika.poskozeniZviretem = 0;
        }
        if (pojisteniKategorieId !== 'HAV') {
            this.data.rizika.povinneRuceni = 1;
        }
        if (pojisteniKategorieId === 'HAV') {
            this.data.rizika.povinneRuceni = 0;
        }
    }    

    private setFields() {
        this.translate.use("cs").subscribe(() => {
            this.formlyFields = [
                {
                    template: '<h3 class="head-title">' + this.translate.instant('ZADANI.DRUH.TITLE') + '</h3>',
                },
                {
                    key: 'vozidlo.druhId',
                    type: 'btn-radio',
                    wrappers: ['centered'],
                    templateOptions: {
                        label: 'VOZIDLO.DRUH.LABEL',
                        tooltip: 'VOZIDLO.DRUH.HINT',
                        class: 'text-center mb-4',
                        options: [
                            { value: 'OSOBNI', label: '<i class="icon shape-car72 fa-3x"></i><br />Osobní vůz - M1' },
                            { value: 'UZITKOVY', label: '<i class="icon shape-car72 fa-3x"></i><br />Užitkový vůz - N1' },
                            { value: 'MOTOCYKL', label: '<i class="icon shape-motorcycle3 fa-3x"></i><br />Motocykl' }
                        ],
                    }
                },                
                {
                    key: 'vozidlo.druhId',
                    type: 'ngx-select',
                    wrappers: ['centered'],
                    templateOptions: {
                        label: 'VOZIDLO.DRUH.LABEL',
                        tooltip: 'VOZIDLO.DRUH.HINT',
                        placeholder: 'FORM.SELECT.VOZIDLODRUH',
                        required: true,
                        class: 'col-md-6 col-lg-4 text-center mb-4',
                        options: this.lists.druh,
                    }
                },
                {
                    fieldGroup: [
                        {
                            template: '<h4 class="vagl text-center">' + this.translate.instant('ZADANI.POJISTENI.TITLE') + '</h4>',
                        },
                        {
                            key: 'pojisteniKategorieId',
                            type: 'btn-radio',
                            wrappers: ['centered'],
                            templateOptions: {
                                label: '',
                                tooltip: '',
                                class: 'text-center mb-4',
                                options: [],
                            },
                            expressionProperties: { 
                                'templateOptions.options': 'formState.selectOptionsData.pojisteni.filter(o => o.show.indexOf(model.vozidlo.druhId) !== -1 || o.show.indexOf("ALL") !== -1)',
                                // vyresetuje výběr, když pojištění neodpovídá nabídce dle druhu, předvybere při jediné volbě
                                'model.pojisteniKategorieId': `field.templateOptions.options.find(o => o.value == model.pojisteniKategorieId) ? model.pojisteniKategorieId : (field.templateOptions.options.length === 1) ? field.templateOptions.options[0].value : 'POV'`,
                            },
                            hooks: {
                                onInit: (field: FormlyFieldConfig) => {
                                    field.formControl.valueChanges.subscribe(value => {
                                        this.nastavRizika(value);
                                    })
                                },
                            },                                                         
                        },                        
                    ],                    
                    hideExpression: (model) => !model.vozidlo.druhId,
                },
                {
                    fieldGroupClassName: 'text-center',
                    fieldGroup: [        
                        {
                            template: '<p><span>' + this.translate.instant('ZADANI.RZ.INTRO') + '</span></p>',
                        },
                        {
                            type: 'progress-bar',
                            expressionProperties: {
                                'templateOptions.progress': 'formState.layout.rzProgress',
                            },                                        
                            hideExpression: (model, formState) => !formState.layout.rzLoading,
                        },                                            
                        {
                            fieldGroupClassName: 'form-inline justify-content-center',
                            fieldGroup: [                  
                                {
                                    key: 'vozidlo.rz',
                                    type: 'input',
                                    templateOptions: {
                                        tooltip: 'VOZIDLO.RZ.HINT',
                                        placeholder: 'VOZIDLO.RZ.PLACEHOLDER',
                                        required: true,                    
                                        minLength: 6,
                                        keyup: (field, event) => { event.preventDefault() },
                                    },
                                    wrappers: ['hledej-rz'],
                                    parsers: [
                                        value => {
                                            return (value = value.toUpperCase());
                                        }
                                    ],                        
                                },
                                {
                                    type: 'button',
                                    templateOptions: {
                                        text: this.translate.instant('ZADANI.RZ.SUBMIT'),
                                        btnType: 'outline-success',
                                        type: 'button',
                                        className: 'mx-2',
                                        onClick: () => {
                                            // console.log('hledat kliknuto');
                                            this.hledejVozidlo();
                                        },
                                    },
                                },
                                {
                                    type: 'button',
                                    templateOptions: {
                                        text: this.translate.instant('ZADANI.RZ.CANCEL'),
                                        btnType: 'outline-secondary',
                                        onClick: () => {
                                            this.formlyOptions.formState.layout.rzLoaded = true;
                                        },
                                    },
                                },                    
                            ],
                        },
                    ],
                    hideExpression: (model, formState) => !(model.vozidlo.druhId && model.pojisteniKategorieId) || formState.layout.rzLoaded,
                },               
                {
                    fieldGroup: [
                        {
                            template: '<h4 class="vagl text-center pb-4">' + this.translate.instant('ZADANI.VOZIDLO.TITLE') + '</h4>',
                        },
                        {
                            fieldGroupClassName: 'row pb-4',
                            fieldGroup: [
                                {
                                    className: 'col-lg-6',
                                    fieldGroup: this.setFormlyVozidloLevy()
                                },
                                {
                                    className: 'col-lg-6',
                                    fieldGroup: this.setFormlyVozidloPravy()
                                }
                            ],
                        },
                        {
                            fieldGroup: [
                                {
                                    template: '<h4 class="vagl text-center pb-4">' + this.translate.instant('VOZIDLO.ZABEZPECENI.TITLE') + '</h4>',
                                },
                                {
                                    fieldGroupClassName: 'row pb-4',
                                    fieldGroup: [
                                        {
                                            className: 'col-lg-6',
                                            fieldGroup: this.setFormlyZabezpeceniLevy()
                                        },
                                        {
                                            className: 'col-lg-6',
                                            fieldGroup: this.setFormlyZabezpeceniPravy()
                                        }
                                    ],
                                },
                            ],
                            hideExpression: (model) => !(model.pojisteniKategorieId === 'POVHAV' || model.pojisteniKategorieId === 'HAV'),
                        },
                    ],
                    hideExpression: (model, formState) => !(model.vozidlo.druhId && model.pojisteniKategorieId) || !formState.layout.rzLoaded,
                },
                {
                    fieldGroup: [
                        {
                            template: '<h4 class="vagl text-center pb-4">' + this.translate.instant('ZADANI.OSOBY.TITLE') + '</h4>',
                        },
                        {
                            fieldGroupClassName: 'row pb-4',
                            fieldGroup: [
                                {
                                    className: 'col-lg-6',
                                    fieldGroup: this.setFormlyPojistnik()
                                },
                                {
                                    className: 'col-lg-6',
                                    fieldGroup: this.setFormlyOsobyPravy()
                                }
                            ]
                        },
                    ],
                    hideExpression: (model, formState) => !(model.vozidlo.druhId && model.pojisteniKategorieId) || !formState.layout.rzLoaded,
                    /*
                    hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => !this.isValid(field.parent.fieldGroup[4]),   //  { console.log(this.isValid(field.parent.fieldGroup[4])); return false; }
                    hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => { 
                        console.log("fieldGroup 4", field.parent.fieldGroup[5]);
                        console.log("notValid", !this.isValid(field.parent.fieldGroup[5]));
                        console.log("notLoaded", !formState.layout.rzLoaded);
                        console.log("hideExpr", !this.isValid(field.parent.fieldGroup[5]) || !formState.layout.rzLoaded);
                        return false; }
                    */
                }                                
            ];
        });
    }

    isValid(field: FormlyFieldConfig) {
        if (field.key) {
            return field.formControl.valid;
        }
        return field.fieldGroup
            ? field.fieldGroup.every((f) => this.isValid(f))
            : true;
    }

    private setFormlyVozidloLevy(): FormlyFieldConfig[] {
        return [
            {
                key: 'vozidlo.znackaId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'VOZIDLO.ZNACKA.LABEL',
                    tooltip: 'VOZIDLO.ZNACKA.HINT',
                    required: true,
                    options: [],
                },
                hideExpression: (model) => !model.vozidlo.druhId,
                expressionProperties: {
                    'templateOptions.options': (model: any, formState: any, field: FormlyFieldConfig) => {
                        if (formState.selectOptionsData.vozidloZnacka[1]) {
                            let znacky = [];
                            if (['OSOBNI', 'UZITKOVY'].indexOf(model.vozidlo.druhId) >= 0) {
                                znacky.push(formState.selectOptionsData.vozidloZnacka[0]);
                                znacky.push({
                                    value: 0,
                                    label: 'Abecední řazení',
                                    children: formState.selectOptionsData.vozidloZnacka[1].children.filter(znacka => znacka.druhId.indexOf(model.vozidlo.druhId) >= 0)
                                });
                            } else {
                                znacky = formState.selectOptionsData.vozidloZnacka[1].children.filter(znacka => znacka.druhId.indexOf(model.vozidlo.druhId) >= 0);
                                // console.log(znacky);
                            }
                            return znacky;
                        }
                    },
                    // reset při změně druhu, jediná hodnota?
                    'model.vozidlo.znackaId': (model, formState, field: any) => {
                        if (field.templateOptions.options) {
                            let znacky = [];
                            if (['OSOBNI', 'UZITKOVY'].indexOf(model.vozidlo.druhId) >= 0) {
                                znacky = field.templateOptions.options[1].children;
                            } else {
                                znacky = field.templateOptions.options;
                            }
                            if (znacky.length === 1) return znacky[0].value;
                            // console.log(field.templateOptions.options);
                            return znacky.find((o: any) => o.value === model.vozidlo.znackaId) ? model.vozidlo.znackaId : null;
                        }
                    }
                    // 'model.vozidlo.znacka': `formState.selectOptionsData.vozidloZnacka.length == 1 ? formState.selectOptionsData.vozidloZnacka[0].value : null`,
                    // 'model.vozidlo.znacka': `field.templateOptions.options.find(o => o.value === model.vozidlo.znacka) ? model.vozidlo.znacka : null`,
                },               
            },
            {
                key: 'vozidlo.modelId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'VOZIDLO.MODEL.LABEL',
                    tooltip: 'VOZIDLO.MODEL.HINT',
                    required: true,
                    options: this.lists.model,
                },
                hideExpression: (model) => !model.vozidlo.znackaId || ["OSOBNI", "UZITKOVY", "MOTOCYKL"].indexOf(model.vozidlo.druhId) === -1,
                expressionProperties: { // model je vyhrazená proměnná Formly
                    'templateOptions.options': 'formState.selectOptionsData.vozidloModel.filter(item => item.znackaId === model.vozidlo.znackaId)',
                    'model.vozidlo.modelId': (model, formState, field: any) => {
                        return field.templateOptions.options.length === 1 ? field.templateOptions.options[0].value : model.vozidlo.modelId;
                    },
                },
            },
            {
                key: 'vozidlo.palivoId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'VOZIDLO.PALIVO.LABEL',
                    tooltip: 'VOZIDLO.PALIVO.HINT',
                    required: true,
                    options: this.lists.palivo,
                },
                hideExpression: (model) => model.vozidlo.druhId === 'PRIPOJNE_VOZIDLO',
                expressionProperties: { // model je vyhrazená proměnná Formly
                    'model.vozidlo.objemMotoru': (model, formState, field: any) => {
                        return model.vozidlo.palivoId === 'ELEKTRO' ? null : model.vozidlo.objemMotoru;
                    },
                },
            },
            {
                key: 'vozidlo.uzitiId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'VOZIDLO.UZITI.LABEL',
                    tooltip: 'VOZIDLO.UZITI.HINT',
                    required: true,
                    options: this.lists.uziti,
                },
            },
            {
                key: 'vozidlo.najezdId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'VOZIDLO.NAJEZD.LABEL',
                    tooltip: 'VOZIDLO.NAJEZD.HINT',
                    required: true,
                    options: this.lists.najezd,
                },
            },         
        ]
    }

    private setFormlyVozidloPravy(): FormlyFieldConfig[] {
        return [
            {
                key: 'vozidlo.objemMotoru',
                type: 'number-mask',
                templateOptions: {
                    label: 'VOZIDLO.OBJEM.LABEL',
                    tooltip: 'VOZIDLO.OBJEM.HINT',
                    placeholder: 'VOZIDLO.OBJEM.PLACEHOLDER',
                    maskOptions: { separateThousands: true },
                    required: true,
                    min: 20,
                    max: 5000,
                    addonRight: {
                        text: this.translate.instant('FORM.CCM'),
                    }
                },
                expressionProperties: {
                    'templateOptions.max': '["OSOBNI", "UZITKOVY", "MOTOCYKL", "CTYRKOLKA"].indexOf(model.vozidlo.druhId) !== -1 ? 5000 : 50000',
                },
                hideExpression: (model) => model.vozidlo.druhId === 'PRIPOJNE_VOZIDLO' || model.vozidlo.palivoId === 'ELEKTRO',
            },            
            {
                key: 'vozidlo.vykonMotoru',
                type: 'number-mask',
                templateOptions: {
                    label: 'VOZIDLO.VYKON.LABEL',
                    tooltip: 'VOZIDLO.VYKON.HINT',
                    placeholder: 'VOZIDLO.VYKON.PLACEHOLDER',
                    maskOptions: { separateThousands: true },
                    required: true,
                    min: 1,
                    max: 600,                    
                    addonRight: {
                        text: this.translate.instant('FORM.KW'),
                    }
                },
                expressionProperties: {
                    'templateOptions.max': '["OSOBNI", "UZITKOVY", "MOTOCYKL", "CTYRKOLKA"].indexOf(model.vozidlo.druhId) !== -1 ? 500 : 50000',
                },
                hideExpression: (model) => model.vozidlo.druhId === 'PRIPOJNE_VOZIDLO',
            },
            {
                key: 'vozidlo.hmotnost',
                type: 'input',
                templateOptions: {
                    label: 'VOZIDLO.HMOTNOST.LABEL',
                    tooltip: 'VOZIDLO.HMOTNOST.HINT',
                    placeholder: 'VOZIDLO.HMOTNOST.PLACEHOLDER',
                    maskOptions: { separateThousands: true },
                    required: true,
                    min: 50,
                    max: 3500,                    
                    addonRight: {
                        text: this.translate.instant('FORM.KG'),
                    }
                },
                expressionProperties: {
                    'templateOptions.max': '["OSOBNI", "UZITKOVY", "MOTOCYKL", "CTYRKOLKA"].indexOf(model.vozidlo.druhId) !== -1 ? 3500 : 50000',
                },
            },
            {
                key: 'vozidlo.uvedeniDoProvozu',
                type: 'datepicker',
                templateOptions: {
                    label: 'VOZIDLO.UVEDENIDP.LABEL',
                    tooltip: 'VOZIDLO.UVEDENIDP.HINT',
                    placeholder: 'VOZIDLO.UVEDENIDP.PLACEHOLDER',
                    required: true,
                    minDate: new Date('1930-01-01T00:00:00'),
                    maxDate: new Date(),
                    bsConfig: {
                        dateInputFormat: 'D.M.YYYY',
                        showWeekNumbers: false,
                        startView: 'year',
                        containerClass: 'theme-default',
                    },
                    // change: (field, $event) => { console.log('DP change ', field ) // bere pouze manuální přepis }    
                }
            },            
            {
                key: 'vozidlo.stavTachometr',
                type: 'number-mask',
                templateOptions: {
                    label: 'VOZIDLO.TACHOMETR.LABEL',
                    tooltip: 'VOZIDLO.TACHOMETR.HINT',
                    placeholder: 'VOZIDLO.TACHOMETR.PLACEHOLDER',
                    maskOptions: { separateThousands: true },
                    required: true,
                    min: 0,
                    max: 1000000,                     
                    addonRight: {
                        text: this.translate.instant('FORM.KM'),
                    },
                },
                hideExpression: (model) => model.pojisteniKategorieId === 'POV',
            }, 
            {
                key: 'vozidlo.cena',
                type: 'number-mask',
                templateOptions: {
                    label: 'VOZIDLO.CENA.LABEL',
                    tooltip: 'VOZIDLO.CENA.HINT',
                    placeholder: 'VOZIDLO.CENA.PLACEHOLDER',
                    maskOptions: { separateThousands: true },
                    required: true,
                    min: 10000,
                    max: 5000000,
                    addonRight: {
                        text: this.translate.instant('FORM.KC'),
                    },
                },
                expressionProperties: {
                    'templateOptions.required': 'model.pojisteniKategorieId !== "POV"',
                },
                hideExpression: (model) => ["OSOBNI", "UZITKOVY", "MOTOCYKL", "CTYRKOLKA"].indexOf(model.vozidlo.druhId) === -1,
            },                                      
        ]
    }

    private setFormlyZabezpeceniLevy(): FormlyFieldConfig[] {
        return [
            {
                key: 'vozidlo.zabezpeceni.imobilizer',
                type: 'switch',
                templateOptions: {
                    label: 'VOZIDLO.ZABEZPECENI.IMOB.LABEL',
                    tooltip: 'VOZIDLO.ZABEZPECENI.IMOB.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                }
            },
            {
                key: 'vozidlo.zabezpeceni.piskovaniSkel',
                type: 'switch',
                templateOptions: {
                    label: 'VOZIDLO.ZABEZPECENI.SKLO.LABEL',
                    tooltip: 'VOZIDLO.ZABEZPECENI.SKLO.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                }
            },
            {
                key: 'vozidlo.zabezpeceni.alarm',
                type: 'switch',
                templateOptions: {
                    label: 'VOZIDLO.ZABEZPECENI.ALARM.LABEL',
                    tooltip: 'VOZIDLO.ZABEZPECENI.ALARM.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                }
            },                        
        ]
    }

    private setFormlyZabezpeceniPravy(): FormlyFieldConfig[] {
        return [
            {
                key: 'vozidlo.zabezpeceni.mechanicke',
                type: 'switch',
                templateOptions: {
                    label: 'VOZIDLO.ZABEZPECENI.MECH.LABEL',
                    tooltip: 'VOZIDLO.ZABEZPECENI.MECH.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                }
            },
            {
                key: 'vozidlo.zabezpeceni.pasivniVyhledavani',
                type: 'switch',
                templateOptions: {
                    label: 'VOZIDLO.ZABEZPECENI.PASIV.LABEL',
                    tooltip: 'VOZIDLO.ZABEZPECENI.PASIV.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                }
            },
            {
                key: 'vozidlo.zabezpeceni.aktivniVyhledavani',
                type: 'switch',
                templateOptions: {
                    label: 'VOZIDLO.ZABEZPECENI.AKTIV.LABEL',
                    tooltip: 'VOZIDLO.ZABEZPECENI.AKTIV.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                }
            },                        
        ]
    }    

    private setFormlyPojistnik(): FormlyFieldConfig[] {
        return [
            {
                template: '<h5 class="vagl">' + this.translate.instant('OSOBA.POJISTNIK.TITLE') + '</h5>',
            },
            {
                key: 'pojistnik.typOsobyId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'OSOBA.POJISTNIK.LABEL',
                    tooltip: 'OSOBA.POJISTNIK.HINT',
                    required: true,
                    options: this.lists.osobaTyp,
                },
            },
            {
                key: 'pojistnik.jmeno',
                type: 'input',
                templateOptions: {
                    label: 'OSOBA.JMENO.LABEL',
                    tooltip: 'OSOBA.JMENO.HINT',
                    placeholder: 'OSOBA.JMENO.PLACEHOLDER',
                    minLength: 2,
                    required: true,
                },
                hideExpression: (model) => (model.pojistnik.typOsobyId === 'PO'),
            },
            {
                key: 'pojistnik.id',
                type: 'rc-mask',
                templateOptions: {
                    label: 'OSOBA.RC.LABEL',
                    tooltip: 'OSOBA.RC.HINT',
                    placeholder: 'OSOBA.RC.PLACEHOLDER',
                    maskOptions: { emitInvalid: true, emitAll: false },
                    required: true,
                },
                hideExpression: (model) => (model.pojistnik.typOsobyId === 'PO'),
            },
            {
                key: 'pojistnik.ic',
                type: 'input',
                templateOptions: {
                    label: 'OSOBA.IC.LABEL',
                    tooltip: 'OSOBA.IC.HINT',
                    placeholder: 'OSOBA.IC.PLACEHOLDER',
                    pattern: /\d{8,8}/,
                    required: true,
                },
                hideExpression: (model) => (model.pojistnik.typOsobyId === 'FO'),
                validation: {
                    messages: {
                        pattern: (error, field) => this.translate.instant('FORM.VALIDATION.IC', { value: field.formControl.value }),
                    },
                },                
            },                               
            {
                key: 'pojistnik.adresa.psc',
                type: 'number-mask',
                templateOptions: {
                    label: 'ADRESA.PSC.LABEL',
                    tooltip: 'ADRESA.PSC.HINT',
                    placeholder: 'ADRESA.PSC.PLACEHOLDER',
                    typeahead: [],
                    typeaheadAsync: true,
                    typeaheadOptionField: 'psc',         
                    maskOptions: { formatZip: true },
                    required: true,
                    min: 10000,
                    max: 79999,
                },
                hooks: {
                    onInit: (field: FormlyFieldConfig) => {
                        field.formControl.valueChanges.pipe(
                            distinctUntilChanged(),
                            debounceTime(300)
                        ).subscribe(psc => {
                            if (psc < 10000) {
                                field.templateOptions.typeahead = this.paramsService.adresaHledej('psc', psc, this.data.pojistnik.adresa);
                                // console.log('PSC změna ', psc);
                            }
                        })
                    },
                },           
            },
            {
                key: 'pojistnik.adresa.castObceId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'ADRESA.OBEC.LABEL',
                    tooltip: 'ADRESA.OBEC.HINT',
                    required: true,
                    options: [],
                },
                hideExpression: (model) => (model.pojistnik.adresa.psc < 10000),             
                hooks: {
                    onInit: (field: FormlyFieldConfig) => {
                        const pscField = field.parent.fieldGroup.find(f => f.key === 'pojistnik.adresa.psc');
                        pscField.formControl.valueChanges.pipe(
                            distinctUntilChanged(),
                            debounceTime(300)
                        ).subscribe(psc => {
                            if (psc >= 10000) {
                                console.log('ZADANI - volání o části obce při změně PSČ ', psc);
                                this.obecList('pojistnik', psc).subscribe(items => {
                                    field.templateOptions.options = items;
                                    if (field.templateOptions.options.length === 1) {
                                        field.formControl.setValue( field.templateOptions.options[0].value );
                                    }
                                });
                                
                            } else {
                                field.templateOptions.options = [];
                            }
                        });
                        /*
                        // při psč načteném z URL
                        if (pscField.formControl.value >= 10000) { 
                            this.obecList('pojistnik', pscField.formControl.value).subscribe(items => { 
                                field.templateOptions.options = items;
                                if (field.templateOptions.options.length === 1) {
                                    field.formControl.setValue( field.templateOptions.options[0].value );
                                    field.focus = true;
                                }
                            });
                            // console.log('část obce', this.data.pojistnik.adresa.castObceId); console.log('části obce', items);
                        }
                        */
                    },
                },
            },
        ]
    }

    private setFormlyVlastnik(): FormlyFieldConfig[] {
        return [
            {
                template: '<h5 class="vagl">' + this.translate.instant('OSOBA.VLASTNIK.TITLE') + '</h5>',
            },
            {
                key: 'vlastnik.typOsobyId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'OSOBA.VLASTNIK.LABEL',
                    tooltip: 'OSOBA.VLASTNIK.HINT',
                    required: true,
                    options: this.lists.osobaTyp,
                },
            },
            {
                key: 'vlastnik.jmeno',
                type: 'input',
                templateOptions: {
                    label: 'OSOBA.JMENO.LABEL',
                    tooltip: 'OSOBA.JMENO.HINT',
                    placeholder: 'OSOBA.JMENO.PLACEHOLDER',
                    minLength: 2,
                    required: true,
                },
                hideExpression: (model) => (model.vlastnik.typOsobyId === 'PO'),
            },
            {
                key: 'vlastnik.id',
                type: 'rc-mask',
                templateOptions: {
                    label: 'OSOBA.RC.LABEL',
                    tooltip: 'OSOBA.RC.HINT',
                    placeholder: 'OSOBA.RC.PLACEHOLDER',
                    maskOptions: { emitInvalid: true, emitAll: false },
                    required: true,
                },
                hideExpression: (model) => (model.vlastnik.typOsobyId === 'PO'),
            },   
            {
                key: 'vlastnik.ic',
                type: 'input',
                templateOptions: {
                    label: 'OSOBA.IC.LABEL',
                    tooltip: 'OSOBA.IC.HINT',
                    placeholder: 'OSOBA.IC.PLACEHOLDER',
                    pattern: /\d{8,8}/,
                    required: true,
                },
                hideExpression: (model) => (model.vlastnik.typOsobyId === 'FO'),
                validation: {
                    messages: {
                        pattern: (error, field: FormlyFieldConfig) => this.translate.instant('FORM.VALIDATION.IC', { value: field.formControl.value }), // `"${field.formControl.value}" is not a valid IP Address`,
                    },
                },                
            },                               
            {
                key: 'vlastnik.adresa.psc',
                type: 'number-mask',
                templateOptions: {
                    label: 'ADRESA.PSC.LABEL',
                    tooltip: 'ADRESA.PSC.HINT',
                    placeholder: 'ADRESA.PSC.PLACEHOLDER',
                    typeahead: [], //this.lists.vlastnik.psc,
                    typeaheadAsync: true,
                    typeaheadOptionField: 'psc',         
                    maskOptions: { formatZip: true },
                    required: true,
                    min: 10000,
                    max: 79999,
                },
                hooks: {
                    onInit: (field: FormlyFieldConfig) => {
                        field.formControl.valueChanges.subscribe(psc => {
                            field.templateOptions.typeahead = this.paramsService.adresaHledej('psc', psc, this.data.vlastnik.adresa);
                        })
                    },
                },                
            },
            {
                key: 'vlastnik.adresa.castObceId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'ADRESA.OBEC.LABEL',
                    tooltip: 'ADRESA.OBEC.HINT',
                    required: true,
                    options: [],
                },
                hideExpression: (model) => (model.vlastnik.adresa.psc < 10000),
                hooks: {
                    onInit: (field: FormlyFieldConfig) => {
                        const pscField = field.parent.fieldGroup.find(f => f.key === 'vlastnik.adresa.psc');
                        pscField.formControl.valueChanges.pipe(
                            distinctUntilChanged(),
                            debounceTime(300)
                        ).subscribe(psc => {
                            if (psc >= 10000) {
                                this.obecList('vlastnik', psc).subscribe(items => { field.templateOptions.options = items });
                            } else {
                                field.templateOptions.options = [];
                            }
                        })

                    },
                },
            },
        ]
    }

    private setFormlyProvozovatel(): FormlyFieldConfig[] {
        return [
            {
                template: '<h5 class="vagl">' + this.translate.instant('OSOBA.PROVOZOVATEL.TITLE') + '</h5>',
            },
            {
                key: 'provozovatel.typOsobyId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'OSOBA.PROVOZOVATEL.LABEL',
                    tooltip: 'OSOBA.PROVOZOVATEL.HINT',
                    required: true,
                    options: this.lists.osobaTyp,
                },
            },
            {
                key: 'provozovatel.jmeno',
                type: 'input',
                templateOptions: {
                    label: 'OSOBA.JMENO.LABEL',
                    tooltip: 'OSOBA.JMENO.HINT',
                    placeholder: 'OSOBA.JMENO.PLACEHOLDER',
                    minLength: 2,
                    required: true,
                },
                hideExpression: (model) => (model.provozovatel.typOsobyId === 'PO'),
            },
            {
                key: 'provozovatel.id',
                type: 'rc-mask',
                templateOptions: {
                    label: 'OSOBA.RC.LABEL',
                    tooltip: 'OSOBA.RC.HINT',
                    placeholder: 'OSOBA.RC.PLACEHOLDER',
                    maskOptions: { emitInvalid: true, emitAll: false },
                    required: true,
                },
                hideExpression: (model) => (model.provozovatel.typOsobyId === 'PO'),
            },   
            {
                key: 'provozovatel.ic',
                type: 'input',
                templateOptions: {
                    label: 'OSOBA.IC.LABEL',
                    tooltip: 'OSOBA.IC.HINT',
                    placeholder: 'OSOBA.IC.PLACEHOLDER',
                    pattern: /\d{8,8}/,
                    required: true,
                },
                hideExpression: (model) => (model.provozovatel.typOsobyId === 'FO'),
                validation: {
                    messages: {
                        pattern: (error, field: FormlyFieldConfig) => this.translate.instant('FORM.VALIDATION.IC', { value: field.formControl.value }), // `"${field.formControl.value}" is not a valid IP Address`,
                    },
                },                
            },                               
            {
                key: 'provozovatel.adresa.psc',
                type: 'number-mask',
                templateOptions: {
                    label: 'ADRESA.PSC.LABEL',
                    tooltip: 'ADRESA.PSC.HINT',
                    placeholder: 'ADRESA.PSC.PLACEHOLDER',
                    typeahead: [], //this.lists.provozovatel.psc,
                    typeaheadAsync: true,
                    typeaheadOptionField: 'psc',         
                    maskOptions: { formatZip: true },
                    required: true,
                    min: 10000,
                    max: 79999,                    
                },
                hooks: {
                    onInit: (field: FormlyFieldConfig) => {
                        field.formControl.valueChanges.subscribe(psc => {
                            field.templateOptions.typeahead = this.paramsService.adresaHledej('psc', psc, this.data.provozovatel.adresa);
                        })
                    },
                },                
            },
            {
                key: 'provozovatel.adresa.castObceId',
                type: 'ngx-select',
                templateOptions: {
                    label: 'ADRESA.OBEC.LABEL',
                    tooltip: 'ADRESA.OBEC.HINT',
                    required: true,
                    options: [],
                },
                hideExpression: (model) => (model.provozovatel.adresa.psc < 10000),
                hooks: {
                    onInit: (field: FormlyFieldConfig) => {
                        const pscField = field.parent.fieldGroup.find(f => f.key === 'provozovatel.adresa.psc');
                        pscField.formControl.valueChanges.pipe(
                            distinctUntilChanged(),
                            debounceTime(300)
                        ).subscribe(psc => {
                            if (psc >= 10000) {
                                this.obecList('provozovatel', psc).subscribe(items => { field.templateOptions.options = items });
                            } else {
                                field.templateOptions.options = [];
                            }
                        })

                    },
                },
            },
        ]
    }

    private setFormlyOsobyPravy(): FormlyFieldConfig[] {
        return [
            {
                template: '<h5 class="vagl">' + this.translate.instant('OSOBA.VLASTNIK.TITLE') + '</h5>',
            },
            {
                key: 'parametry.pojistnikvlastnik',
                type: 'switch',
                templateOptions: {
                    label: 'OSOBA.POJISTNIKVLASTNIK.LABEL',
                    tooltip: 'OSOBA.POJISTNIKVLASTNIK.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                }
            },
            {
                fieldGroup: [
                    {
                        hideExpression: (model) => (model.parametry.pojistnikvlastnik),
                        fieldGroup: this.setFormlyVlastnik(),
                    },
                ]
            },       
            {
                template: '<h5 class="vagl">' + this.translate.instant('OSOBA.PROVOZOVATEL.TITLE') + '</h5>',
            },                 
            {
                key: 'parametry.pojistnikprovozovatel',
                type: 'switch',
                templateOptions: {
                    label: 'OSOBA.POJISTNIKPROVOZOVATEL.LABEL',
                    tooltip: 'OSOBA.POJISTNIKPROVOZOVATEL.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                },
                hooks: {
                    onInit: (field: FormlyFieldConfig) => {
                        const pvField = field.parent.fieldGroup.find(f => f.key === 'parametry.pojistnikvlastnik');
                        pvField.formControl.valueChanges.subscribe(pv => {
                            field.formControl.setValue( pv ? true : false);
                        })

                    },
                },                          
            },
            {
                key: 'parametry.vlastnikprovozovatel',
                type: 'switch',
                templateOptions: {
                    label: 'OSOBA.VLASTNIKPROVOZOVATEL.LABEL',
                    tooltip: 'OSOBA.VLASTNIKPROVOZOVATEL.HINT',
                    formCheck: 'inline-switch',
                    hideLabel: true,
                    grid: { label: 'col', input: 'col-12' }
                },
                hideExpression: (model) => (model.parametry.pojistnikprovozovatel),                        
            },
            {
                fieldGroup: [
                    {
                        hideExpression: (model) => (model.parametry.pojistnikprovozovatel || model.parametry.vlastnikprovozovatel),
                        fieldGroup: this.setFormlyProvozovatel(),
                    },
                ]
            },                        
        ]
    } 

}
