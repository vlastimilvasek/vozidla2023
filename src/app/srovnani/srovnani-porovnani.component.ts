import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation, slideRightLeftAnimation } from '../core/animations/index';
import { KalkulaceService, DataService, IPartner, IProdukt, IVozidla } from '../core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-srovnani',
    templateUrl: './srovnani-porovnani.component.html',
    styleUrls: ['./srovnani.component.scss'],
    animations: [slideRightLeftAnimation],
    host: { '[@slideRightLeftAnimation]': '' },
})
export class SrovnaniPorovnaniComponent implements OnInit {
    
    produkty: IProdukt[];
    data: IVozidla;

    nabModal = {
        loaded: false,
        status: false,
        docs: []
    };
    public modalRef: BsModalRef;
    public porovnaniSubs: Subscription;

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
       
        this.data = this.dataService.getDataValue();
        if (!this.data.kod) {
            this.router.navigate(['../../zadani'], { relativeTo: this.route });
            return;
        }

        this.porovnaniSubs = this.kalkulaceService.PorovnavaneProdukty().subscribe(produktyIds => {
            if (!produktyIds.length) {
                this.router.navigate(['/srovnani']);
                return;
            }
            this.produkty = [];
            produktyIds.forEach((produktId, index) => {
                this.produkty.push( this.kalkulaceService.getProduktValue(produktId) );
            });
        });
    }

    ngOnDestroy(): void {
        this.porovnaniSubs.unsubscribe();
    }

    public sjednatProdukt(produktId: string): void {
        this.kalkulaceService.setVybranyProdukt(produktId);
        this.router.navigate(['/sjednani']);
    }

    public detailProduktu(produktId: string): void {     
        this.kalkulaceService.setVybranyProdukt(produktId);
        this.router.navigate(['../detail'], { relativeTo: this.route });
    }

    public resetPorovnaniProduktu(): void {
        this.kalkulaceService.setPorovnavaneProdukty([]);
        this.router.navigate(['..'], { relativeTo: this.route });
    }

    public odebratProdukt(produktId: string): void {
        if (!produktId) {
            return;
        }        
        let produkty = this.kalkulaceService.getPorovnavaneProdukty();
        produkty.push(produktId);
        produkty = produkty.filter(item => item !== produktId);
        this.kalkulaceService.setPorovnavaneProdukty(produkty);
        // this.router.navigate(['./produktu'], { relativeTo: this.route });
    }
}
