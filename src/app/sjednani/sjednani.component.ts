import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation, slideRightLeftAnimation } from '../core/animations/index';
import { KalkulaceService, DataService, IPartner, IProdukt, IVozidla } from '../core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
    selector: 'app-srovnani',
    templateUrl: './sjednani.component.html',
    animations: [slideRightLeftAnimation],
    host: { '[@slideRightLeftAnimation]': '' },
})
export class SjednaniComponent implements OnInit {
    
    produkt: IProdukt;
    data: IVozidla;

    nabModal = {
        loaded: false,
        status: false,
        docs: []
    };
    public modalRef: BsModalRef;

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
    ) { }

    ngOnInit(): void {       
        this.data = this.dataService.getDataValue();
        if (!this.data.kod) {
            this.router.navigate(['../zadani'], { relativeTo: this.route });
            return;
        }
        this.setFields();
        this.setOptions();
    }
  
    public onSubmit(): void {
        if (this.formlyForm.invalid) {
            return;
        }
        console.log('SROVNANI onSubmit - data: ', this.data)
        this.dataService.updateData(this.data);
        this.router.navigate(['../shrnuti'], { relativeTo: this.route });
    }

    /*
    **** FORMULÁŘE ****
    */
    private setOptions() {
        this.formlyOptions = {
            formState: {
                selectOptionsData: {
                },
            },
        };
    }

    private setFields() {

        this.formlyFields = [
            {
                template: '<h4 class="vagl text-center pb-2">' + this.translate.instant('VOZIDLO.IDENTIFIKACE') + '</h4>',
            },
            {
                fieldGroupClassName: 'row pb-4',
                fieldGroup: [
                    {
                        className: 'col-lg-9',
                        fieldGroup: this.setFormlyVozidloIdentifikace()
                    },
                ]
            },
            {
                template: '<h4 class="vagl text-center pb-2">' + this.translate.instant('SJEDNANI.POJISTNIK.UDAJE') + '</h4>',
            },
            {
                fieldGroupClassName: 'row pb-4',
                fieldGroup: [
                    {
                        className: 'col-lg-9',
                        fieldGroup: this.setPojistnikUdaje()
                    },
                ]
            },
            {
                fieldGroup: [
                    {
                        template: '<h4 class="vagl text-center">' + this.translate.instant('ZADANI.VLASTNIK.UDAJE') + '</h4>',
                    },
                    {
                        key: 'vlastnik.adresaId',
                        type: 'adresa',
                        templateOptions: {
                            label: 'ADRESA.ID.LABEL',
                            tooltip: 'ADRESA.ID.HINT',
                            placeholder: 'ADRESA.ID.PLACEHOLDER',
                            typeaheadOnSelect: (e: TypeaheadMatch): void => {
                                this.data.vlastnik.adresa.castObceId = e['item'].casti_obce_id;
                                this.data.vlastnik.adresa.psc = e['item'].psc;
                                this.data.vlastnik.adresa.obec = e['item'].nazev_obce;
                                this.data.vlastnik.adresa.ulice = e['item'].nazev_ulice;
                                this.data.vlastnik.adresa.cp = e['item'].cislo;
                                console.log(e['item']);
                            }
                        },        
                    },                        
                ],                    
                hideExpression: (model) => (model.parametry.pojistnikvlastnik),
            },
            {
                fieldGroup: [
                    {
                        template: '<h4 class="vagl text-center">' + this.translate.instant('ZADANI.PROVOZOVATEL.UDAJE') + '</h4>',
                    },
                    {
                        key: 'provozovatel.adresaId',
                        type: 'adresa',
                        templateOptions: {
                            label: 'ADRESA.ID.LABEL',
                            tooltip: 'ADRESA.ID.HINT',
                            placeholder: 'ADRESA.ID.PLACEHOLDER',
                            typeaheadOnSelect: (e: TypeaheadMatch): void => {
                                this.data.provozovatel.adresa.castObceId = e['item'].casti_obce_id;
                                this.data.provozovatel.adresa.psc = e['item'].psc;
                                this.data.provozovatel.adresa.obec = e['item'].nazev_obce;
                                this.data.provozovatel.adresa.ulice = e['item'].nazev_ulice;
                                this.data.provozovatel.adresa.cp = e['item'].cislo;
                                console.log(e['item']);
                            }
                        },        
                    },                        
                ],                    
                hideExpression: (model) => (model.parametry.pojistnikprovozovatel || model.parametry.vlastnikprovozovatel),
            },                                 
        ];
    }

    private setFormlyVozidloIdentifikace(): FormlyFieldConfig[] {
        return [                                                     
            {
                key: 'vozidlo.rz',
                type: 'opt-disabled',
                templateOptions: {
                    label: 'VOZIDLO.RZ.LABEL',
                    disLabel: 'VOZIDLO.RZ.ISSUED',
                    tooltip: 'VOZIDLO.RZ.HINT',
                    placeholder: 'VOZIDLO.RZ.PLACEHOLDER',
                    minLength: 6,
                }
            },
            {
                key: 'vozidlo.vtp',
                type: 'input',
                templateOptions: {
                    label: 'VOZIDLO.VTP.LABEL',
                    tooltip: 'VOZIDLO.VTP.HINT',
                    placeholder: 'VOZIDLO.VTP.PLACEHOLDER',
                    required: true,
                    minLength: 8,
                    maxLength: 8,
                }
            },              
            {
                key: 'vozidlo.id',
                type: 'input',
                templateOptions: {
                    label: 'VOZIDLO.VIN.LABEL',
                    tooltip: 'VOZIDLO.VIN.HINT',
                    placeholder: 'VOZIDLO.VIN.PLACEHOLDER',
                    required: true,
                    minLength: 17,
                    maxLength: 17,
                }
            },            
        ]
    }

    private setPojistnikUdaje(): FormlyFieldConfig[] {
        return [                                                     
            {
                key: 'pojistnik.adresaId',
                type: 'adresa',
                templateOptions: {
                    label: 'ADRESA.ID.LABEL',
                    tooltip: 'ADRESA.ID.HINT',
                    placeholder: 'ADRESA.ID.PLACEHOLDER',
                    typeaheadOnSelect: (a): void => {
                        this.data.pojistnik.adresa.castObceId = a.casti_obce_id;
                        this.data.pojistnik.adresa.psc = a.psc;
                        this.data.pojistnik.adresa.obec = a.nazev_obce;
                        this.data.pojistnik.adresa.ulice = a.nazev_ulice;
                        this.data.pojistnik.adresa.cp = a.cislo;
                        // console.log(e['item']);
                    }
                },        
            },
            {
                key: 'pojistnik.email',
                type: 'input',
                templateOptions: {
                    label: 'OSOBA.EMAIL.LABEL',
                    tooltip: 'OSOBA.EMAIL.HINT',
                    placeholder: 'OSOBA.EMAIL.PLACEHOLDER',
                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    required: true,
                },
                validation: {
                    messages: {
                        pattern: this.translate.instant('FORM.VALIDATION.EMAIL'),
                    },
                },                
            }, 
            {
                key: 'pojistnik.telefon',
                type: 'tel-mask',
                templateOptions: {
                    label: 'OSOBA.TELEFON.LABEL',
                    tooltip: 'OSOBA.TELEFON.HINT',
                    placeholder: 'OSOBA.TELEFON.PLACEHOLDER',
                    required: true,
                }
            },        
        ]
    }
}
