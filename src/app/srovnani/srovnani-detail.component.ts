import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation, slideRightLeftAnimation } from '../core/animations/index';
import { PartneriShellModel } from './partneri-shell.model';
import { KalkulaceService, DataService, IPartner, IProdukt, IVozidla } from '../core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-srovnani',
    templateUrl: './srovnani-detail.component.html',
    styleUrls: ['./srovnani.component.scss'],
    animations: [slideRightLeftAnimation],
    host: { '[@slideRightLeftAnimation]': '' },
})
export class SrovnaniDetailComponent implements OnInit {
    
    produkt: IProdukt;
    data: IVozidla;

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
        private kalkulaceService: KalkulaceService,
        private dataService: DataService,
        private modalService: BsModalService        
    ) { }

    ngOnInit(): void {
        // this.kalkulaceService.updateProdukty([]);
        // const produktId = this.route.snapshot.paramMap.get('id')!;
        const produktId = this.kalkulaceService.getVybranyProdukt();
        console.log('SROVNANI DETAIL - produktId ', produktId);
        
        this.data = this.dataService.getDataValue();
        if (!this.data.kod) {
            this.router.navigate(['../../zadani'], { relativeTo: this.route });
            return;
        }
        if (!produktId) {
            this.router.navigate(['/srovnani']);
            return;
        }

        this.produkt = this.kalkulaceService.getProduktValue(produktId);
    }

    public sjednatProdukt(produktId: string): void {
        this.kalkulaceService.setVybranyProdukt(produktId);
        this.router.navigate(['/sjednani']);
    }

    public stahniNabidku(template: TemplateRef<any>, produktId: string): void {
        if (!this.data.kod || !produktId) {
            return;
        }        
        // this.produktNabidka[produktId] = true;
        this.nabModal.loaded = false;
        this.modalRef = this.modalService.show(template);
        this.kalkulaceService.nabidkaProduktu(this.data.kod, produktId).subscribe(
            nabidka => {
                console.log('stahniNabidku - vrácený objekt ', nabidka);
                // this.produktNabidka[produktId] = false;
                this.nabModal.loaded = true;
                if (nabidka && nabidka?.url) {
                    this.nabModal.status = true;
                    this.nabModal.docs.push(nabidka);
                    console.log('nabidka - resp OK: ', this.nabModal);
                } else {
                    console.log('nabidka - resp prázdná: ', this.nabModal);
                }
            },
            error => {
                console.log('nabidka - error: ', error);
                this.nabModal.loaded = true;
            }
        );
    }
}
