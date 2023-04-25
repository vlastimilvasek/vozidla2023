import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation, slideRightLeftAnimation } from '../core/animations/index';
import { KalkulaceService, DataService, IPartner, IProdukt, IVozidla } from '../core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-srovnani',
    templateUrl: './srovnani-nastaveni.component.html',
    styleUrls: ['./srovnani.component.scss'],
    animations: [slideRightLeftAnimation],
    host: { '[@slideRightLeftAnimation]': '' },
})
export class SrovnaniNastaveniComponent implements OnInit {
    
    produkt: IProdukt;
    data: IVozidla;
    dataSubs: Subscription;

    formlyForm = new FormGroup({});
    formlyOptions: FormlyFormOptions = {};
    formlyFields: FormlyFieldConfig[];

    nabModal = {
        loaded: false,
        status: false,
        docs: []
    };
    public modalRef: BsModalRef;

    @ViewChild('debugModal', { static: true }) debugModal: any;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Đ' || event.key === 'ð') { this.debugModal.show(); }
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
        private kalkulaceService: KalkulaceService,
        private dataService: DataService,
        private modalService: BsModalService        
    ) { }

    ngOnInit(): void {
        // this.kalkulaceService.updateProdukty([]);
        // const produktId = this.route.snapshot.paramMap.get('id')!;
        const produktId = this.kalkulaceService.getVybranyProdukt();
        console.log('SROVNANI DETAIL - produktId ', produktId);
        
        this.dataSubs = this.dataService.getData().subscribe(data => {
            this.data = {
                ...data
            };
        });

        if (!this.data.kod) {
            this.router.navigate(['../../zadani'], { relativeTo: this.route });
            return;
        }
        if (!produktId) {
            this.router.navigate(['/srovnani']);
            return;
        }

        this.produkt = this.kalkulaceService.getProduktValue(produktId);
        this.setFields();
        this.setOptions();
    }

    public ngOnDestroy(): void {
        this.dataSubs.unsubscribe();
    } 

    onSubmit() {
        console.log('NASTAVENI PRODUKTU extra form ', this.data);
        if (this.formlyForm.invalid) {
            return;
        }
        this.dataService.updateData(this.data);
        this.formlyOptions.formState.recalculating = true;
        this.kalkulaceService.kalkulujProdukt(this.data.kod, this.produkt.id).subscribe(
            produkt => {
                console.log('NASTAVENI PRODUKTU - prepocet ceny ', produkt);
                // this.produktNabidka[produktId] = false;
                this.formlyOptions.formState.recalculating = false;
                this.kalkulaceService.updateProdukt(produkt.id, produkt);
            },
            error => {
                console.log('prepocet ceny - error: ', error);
                this.formlyOptions.formState.recalculating = false;
            }
        );;
        this.router.navigate(['../detail'], { relativeTo: this.route });
    }

    private setOptions() {
        this.formlyOptions = {
            formState: {
                selectOptionsData: {},
                recalculating: false,
            },           
        };
    } 

    private setFields() {
        this.translate.use("cs").subscribe(() => {

            this.formlyFields = [
                {
                    template: '<h4 class="vagl mt-4 text-center">' + this.translate.instant('PRODUKT.TITLE') + '</h4>',
                }
            ];

            Object.keys(this.produkt.extra).forEach(key => {
                const extra = this.produkt.extra[key];
                if (extra.typ === 'RADIO' && extra?.options.length) {
                    this.formlyFields.push(
                        {
                            key: 'rizika.' + key,
                            type: 'btn-radio',
                            wrappers: ['myfield'],
                            templateOptions: {
                                label: extra.label,
                                tooltip: extra.popis,
                                options: extra.options,
                            }
                        }
                    )
                } else if (extra.typ === 'SELECT' && extra?.options.length) {
                    this.formlyFields.push(
                        {
                            key: 'rizika.' + key,
                            type: 'ngx-select',
                            wrappers: ['myfield'],
                            templateOptions: {
                                label: extra.label,
                                tooltip: extra.popis,
                                placeholder: 'FORM.SELECT.DEFAULT',
                                options: extra.options,
                            }
                        }
                    )
                }
            });

        });
    }
}
