import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DataService, ParamsService, Seznamy, IVozidla, IRizika } from '../core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
// import { slideRightLeftAnimation } from '../core/animations';

@Component({
    selector: 'app-parametry',
    templateUrl: './rekapitulace.component.html',
})
export class RekapitulaceComponent implements OnInit {

    data: IVozidla;
    lists: Seznamy;
    public dataSubs: Subscription;    
    minDate: Date;
    maxDate: Date;
    bsConfig: Partial<BsDatepickerConfig>;

    formlyForm = new FormGroup({});
    formlyOptions: FormlyFormOptions = {};
    formlyFields: FormlyFieldConfig[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
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
        if (this.formlyForm.invalid) {
            return;
        }
        this.dataService.updateData(this.data);
        this.router.navigate(['../zaver'], { relativeTo: this.route });
    }

    public ngOnDestroy(): void {
        this.dataSubs.unsubscribe();
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
                    fieldGroupClassName: 'pb-4',
                    fieldGroup: [
                        {
                            template: '<h4 class="vagl">' + this.translate.instant('REKAPITULACE.SOUHLAS.TITLE') + '</h4>',
                        },
                        {
                            key: 'souhlas',
                            type: 'switch',
                            templateOptions: {
                                label: 'REKAPITULACE.SOUHLAS.TEXT',
                                tooltip: '',
                                formCheck: 'inline-switch',
                                hideLabel: true,
                                grid: { label: 'col', input: 'col-12 text-smaller' }
                            }
                        },
                    ], 
                },             
            ];
        });
    }  
}
