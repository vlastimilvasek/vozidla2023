import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DataService, ParamsService, Seznamy, IVozidla, IRizika, PartneriService, KalkulaceService } from '../core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
// import { slideRightLeftAnimation } from '../core/animations';

@Component({
    selector: 'app-parametry',
    templateUrl: './parametry.component.html',
})
export class ParametryComponent implements OnInit {

    data: IVozidla;
    lists: Seznamy;
    public dataSubs: Subscription;
    public partneriSubs: Subscription;
    minDate: Date;
    maxDate: Date;
    bsConfig: Partial<BsDatepickerConfig>;
    souhlas;

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
        private partneriService: PartneriService,
        private kalkulaceService: KalkulaceService,        
        private translate: TranslateService,
        private paramsService: ParamsService,
        private localeService: BsLocaleService
    ) {}

    ngOnInit(): void {
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default', adaptivePosition: false, dateInputFormat: 'D.M.YYYY' });
        this.localeService.use('cs');
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate());
        this.maxDate.setDate(this.maxDate.getDate() + 90);
        this.souhlas = false;

        this.dataSubs = this.dataService.getData().subscribe(data => {
            this.data = {
                ...data
            };
        });
        this.lists = this.paramsService.getListsValue();
        this.setFields();
        this.setOptions();
    }

    onSubmit(): void {
        console.log('PARAMETRY - onSubmit - platná data? ', this.formlyForm.valid);
        if (this.formlyForm.invalid) {
            return;
        }
        // this.dataService.updateData(this.data);
        this.dataService.ulozKalkulaci(this.data).subscribe(resp => {
            // Vymazání produktů
            this.partneriService.resetPartneri();
            this.kalkulaceService.updateProdukty([]);
            console.log('PARAMETRY - resetu partnerů a produktů');
            // setTimeout(() => {
                // Chvilka na provedení resetu partnerů a produktů
                // Obnova partnerů a spočítání jejich produktů
                this.partneriService.nactiPartneri(this.data.vozidlo.druhId);
                console.log('PARAMETRY - po opětovném načtení partnerů');
                this.partneriSubs =  this.partneriService.getPartneri().pipe(take(2)).subscribe(partneri => {  // .pipe(first(val => val === 10))
                    console.log('PARAMETRY - partneri ', partneri.length, partneri.map(item => item.id));
    
                    partneri.forEach((partner) => {
                        if (partner.id) {
                            console.log('PARAMETRY - kalkuluj ', partner.id);
                            this.kalkulaceService.kalkuluj(this.data.kod, partner.id);
                        }
                    });
    
                });
                this.router.navigate(['../srovnani'], { relativeTo: this.route });
            // }, 100);

        });
        
    }

    public ngOnDestroy(): void {
        this.dataSubs.unsubscribe();
        // this.partneriSubs.unsubscribe();
    }

    private setOptions(): void {
        this.formlyOptions = {
            formState: {
                selectOptionsData: {
                    platba: this.lists.platba,
                },
            },
        };
    }

    private setFields(): void {
        this.translate.use("cs").subscribe(() => {
            this.formlyFields = [
                {
                    fieldGroupClassName: 'row pb-4',
                    fieldGroup: [
                        {
                            className: 'offset-md-1 col-md-10 offset-lg-2 col-lg-8 offset-xl-2 col-xl-6',
                            fieldGroup: [
                                {
                                    template: '<h4 class="vagl text-center">' + this.translate.instant('ROZSAH.UDAJE.TITLE') + '</h4>',
                                },
                                {
                                    key: 'parametry.pocatek',
                                    type: 'datepicker',
                                    templateOptions: {
                                        label: 'POJISTKA.POCATEK.LABEL',
                                        tooltip: 'POJISTKA.POCATEK.HINT',
                                        minDate: this.minDate,
                                        maxDate: this.maxDate,
                                        required: true,                                  
                                    },                               
                                }, 
                                {
                                    key: 'parametry.platba',
                                    type: 'btn-radio',
                                    templateOptions: {
                                        label: 'POJISTKA.PLATBA.LABEL',
                                        tooltip: 'POJISTKA.PLATBA.HINT',
                                        options: this.lists.platba,
                                    }
                                },
                            ],
                        },
                    ], 
                },
                {
                    fieldGroupClassName: 'row pb-4',
                    fieldGroup: [
                        {
                            className: 'offset-md-1 col-md-10 offset-lg-2 col-lg-8 offset-xl-2 col-xl-6',
                            fieldGroup: [
                                {
                                    fieldGroup: [
                                        {
                                            template: '<h4 class="vagl text-center">' + this.translate.instant('ROZSAH.HAVARIJNI.TITLE') + '</h4>',
                                        },
                                        {
                                            key: 'rizika.havarie',
                                            type: 'switch',
                                            templateOptions: {
                                                label: 'RIZIKA.HAVARIE.LABEL',
                                                tooltip: 'RIZIKA.HAVARIE.HINT',
                                                formCheck: 'inline-switch',
                                                hideLabel: true,
                                                grid: { label: 'col', input: 'col-12' },
                                                change: (field: FormlyFieldConfig) => {
                                                    console.log("fieldGroup value ", field.formControl.value ? Number(this.data.vozidlo.cena) : 0);
                                                    this.data.rizika.havarie = field.formControl.value ? Number(this.data.vozidlo.cena) : 0;
                                                }                                                
                                            },                                           
                                        },
                                        {
                                            key: 'rizika.odcizeni',
                                            type: 'switch',
                                            templateOptions: {
                                                label: 'RIZIKA.ODCIZENI.LABEL',
                                                tooltip: 'RIZIKA.ODCIZENI.HINT',
                                                formCheck: 'inline-switch',
                                                hideLabel: true,
                                                grid: { label: 'col', input: 'col-12' },
                                                change: (field: FormlyFieldConfig) => {
                                                    this.data.rizika.odcizeni = this.data.rizika.odcizeni ? this.data.vozidlo.cena+0 : 0;
                                                } 
                                            }
                                        },
                                        {
                                            key: 'rizika.vandalismus',
                                            type: 'switch',
                                            templateOptions: {
                                                label: 'RIZIKA.VANDALISMUS.LABEL',
                                                tooltip: 'RIZIKA.VANDALISMUS.HINT',
                                                formCheck: 'inline-switch',
                                                hideLabel: true,
                                                grid: { label: 'col', input: 'col-12' },
                                                change: (field: FormlyFieldConfig) => {
                                                    this.data.rizika.vandalismus = this.data.rizika.vandalismus ? this.data.vozidlo.cena+0 : 0;
                                                } 
                                            }
                                        },
                                        {
                                            key: 'rizika.zivel',
                                            type: 'switch',
                                            templateOptions: {
                                                label: 'RIZIKA.ZIVEL.LABEL',
                                                tooltip: 'RIZIKA.ZIVEL.HINT',
                                                formCheck: 'inline-switch',
                                                hideLabel: true,
                                                grid: { label: 'col', input: 'col-12' },
                                                change: (field: FormlyFieldConfig) => {
                                                    this.data.rizika.zivel = this.data.rizika.zivel ? this.data.vozidlo.cena+0 : 0;
                                                } 
                                            }
                                        },
                                        {
                                            key: 'rizika.srazkaSeZviretem',
                                            type: 'switch',
                                            templateOptions: {
                                                label: 'RIZIKA.STRETSEZVERI.LABEL',
                                                tooltip: 'RIZIKA.STRETSEZVERI.HINT',
                                                formCheck: 'inline-switch',
                                                hideLabel: true,
                                                grid: { label: 'col', input: 'col-12' },
                                                change: (field: FormlyFieldConfig) => {
                                                    this.data.rizika.srazkaSeZviretem = this.data.rizika.srazkaSeZviretem ? this.data.vozidlo.cena+0 : 0;
                                                } 
                                            }
                                        },
                                        {
                                            key: 'rizika.poskozeniZviretem',
                                            type: 'switch',
                                            templateOptions: {
                                                label: 'RIZIKA.POSKOZENIZVIRETEM.LABEL',
                                                tooltip: 'RIZIKA.POSKOZENIZVIRETEM.HINT',
                                                formCheck: 'inline-switch',
                                                hideLabel: true,
                                                grid: { label: 'col', input: 'col-12' },
                                                change: (field: FormlyFieldConfig) => {
                                                    this.data.rizika.poskozeniZviretem = this.data.rizika.poskozeniZviretem ? this.data.vozidlo.cena+0 : 0;
                                                } 
                                            }
                                        },
                                        {
                                            key: 'rizika.spoluucast',
                                            type: 'btn-radio',
                                            templateOptions: {
                                                label: 'RIZIKA.SPOLUUCAST.LABEL',
                                                tooltip: 'RIZIKA.SPOLUUCAST.HINT',
                                                options: [
                                                    { value: 1, label: this.translate.instant('RIZIKA.SPOLUUCAST.VALUE.1') },
                                                    { value: 5, label: this.translate.instant('RIZIKA.SPOLUUCAST.VALUE.5') },
                                                    { value: 10, label: this.translate.instant('RIZIKA.SPOLUUCAST.VALUE.10') }
                                                ],
                                                size: 'small',
                                            }
                                        },                       
                                    ],                    
                                    hideExpression: (model) => { return model.pojisteniKategorieId === 'POV'},
                                },
                                {
                                                             
                                    fieldGroup: [
                                        {
                                            template: '<h4 class="vagl text-center">' + this.translate.instant('ROZSAH.PRIPOJISTENI.TITLE') + '</h4>',
                                        },
                                        {
                                            key: 'rizika.rozsirenaAsistence',
                                            type: 'switch',
                                            templateOptions: {
                                                label: 'RIZIKA.ASISTENCE.LABEL',
                                                tooltip: 'RIZIKA.ASISTENCE.HINT',
                                                formCheck: 'inline-switch',
                                                hideLabel: false,
                                                class: 'form-group mb-0 row',
                                                grid: { label: 'col-sm-5', input: 'col-sm-7 pt-2' }
                                            }
                                        },
                                        {
                                            key: 'rizika.nahradniVozidlo',
                                            type: 'switch',
                                            templateOptions: {
                                                label: 'RIZIKA.NAHRADNIVOZIDLO.LABEL',
                                                tooltip: 'RIZIKA.NAHRADNIVOZIDLO.HINT',
                                                formCheck: 'inline-switch',
                                                hideLabel: false,
                                                class: 'form-group mb-0 row',
                                                grid: { label: 'col-sm-5', input: 'col-sm-7 pt-2' }
                                            }
                                        },
                                        {
                                            key: 'rizika.pojisteniSkel',
                                            type: 'range',
                                            templateOptions: {
                                                label: 'RIZIKA.SKLA.LABEL',
                                                tooltip: 'RIZIKA.SKLA.HINT',
                                                min: 0,
                                                max: 50000,
                                                step: 1000,
                                            },                            
                                        },
                                        {
                                            key: 'rizika.pojisteniUrazu',
                                            type: 'range',
                                            templateOptions: {
                                                label: 'RIZIKA.URAZ.LABEL',
                                                tooltip: 'RIZIKA.URAZ.HINT',
                                                min: 0,
                                                max: 500000,
                                                step: 100000,
                                            },                            
                                        },
                                        {
                                            key: 'rizika.pojisteniZavazadel',
                                            type: 'range',
                                            templateOptions: {
                                                label: 'RIZIKA.ZAVAZADLA.LABEL',
                                                tooltip: 'RIZIKA.SKLA.HINT',
                                                min: 0,
                                                max: 100000,
                                                step: 10000,
                                            },                            
                                        },
                                        {
                                            key: 'rizika.srazkaSeZviretem',
                                            type: 'range',
                                            templateOptions: {
                                                label: 'RIZIKA.STRETSEZVERI.LABEL',
                                                tooltip: 'RIZIKA.STRETSEZVERI.HINT',
                                                min: 0,
                                                max: 100000,
                                                step: 10000,
                                            },
                                            hideExpression: (model) => { return model.pojisteniKategorieId !== 'POV'},                         
                                        },
                                        {
                                            key: 'rizika.poskozeniZviretem',
                                            type: 'range',
                                            templateOptions: {
                                                label: 'RIZIKA.POSKOZENIZVIRETEM.LABEL',
                                                tooltip: 'RIZIKA.POSKOZENIZVIRETEM.HINT',
                                                min: 0,
                                                max: 100000,
                                                step: 10000,
                                            },
                                            hideExpression: (model) => { return model.pojisteniKategorieId !== 'POV'},                      
                                        },                                                       
                                    ],
                                },
                            ],
                        },
                    ],
                    hideExpression: (model) => ["OSOBNI", "UZITKOVY", "OBYTNY"].indexOf(model.vozidlo.druhId) === -1,
                },
                {
                    fieldGroupClassName: 'row pb-4',
                    fieldGroup: [
                        {
                            className: 'offset-md-1 col-md-10 offset-lg-2 col-lg-8 offset-xl-2 col-xl-6',
                            fieldGroup: [
                                {
                                    fieldGroup: [                             
                                    {
                                        template: '<h4 class="vagl text-center">' + this.translate.instant('ROZSAH.SLEVY.TITLE') + '</h4>',
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
                                    },   
                                    ]
                                }
                            ],
                        },
                    ], 
                    hideExpression: (model) => true,                   
                },                
            ];
        });
    }  
}
