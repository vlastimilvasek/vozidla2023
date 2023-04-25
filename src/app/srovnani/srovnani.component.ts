import { Component, OnInit, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation, slideRightLeftAnimation } from '../core/animations/index';
import { PartneriShellModel } from './partneri-shell.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { KalkulaceService, DataService, IPartner, IVozidla, PartneriService } from '../core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-srovnani',
    templateUrl: './srovnani.component.html',
    styleUrls: ['./srovnani.component.scss'],
    animations: [slideRightLeftAnimation],
    host: { '[@slideRightLeftAnimation]': '' },
})
export class SrovnaniComponent implements OnInit {

    data: IVozidla;
    partneri: IPartner[];
    partneriDetail: {};
    url: string;
    pocetPorovnani: number;

    public partnerSubs: Subscription;
    public produktyPartneraSubs: Subscription;
    public porovnaniSubs: Subscription;

    nabModal = {
        loaded: false,
        status: false,
        docs: []
    };
    layout = {
        produktCollapsed: {},
        filtrCollapsed : true,
        emailKalkulaceOdeslan: false,
        kalkulaceAktivni: false,
    };    

    @ViewChild('debugModal', { static: true }) debugModal: any;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Đ' || event.key === 'ð') { this.debugModal.show(); }
    }    

    public modalRef: BsModalRef;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private kalkulaceService: KalkulaceService,
        private partneriService: PartneriService,
        private dataService: DataService,
        private modalService: BsModalService
    ) { }

    ngOnInit(): void {
        // this.kalkulaceService.updateProdukty([]);
        
        this.data = this.dataService.getDataValue();

        if (!this.data.kod) {
            this.router.navigate(['../zadani'], { relativeTo: this.route });
            return;
        }
        this.url = window.location.origin + window.location.pathname + '?id=' + this.data.kod;

        this.partnerSubs = this.partneriService.getPartneri().subscribe(partneri => {
            this.partneri = partneri;
            console.log('SROVNANI - partneri ', partneri);
            if (this.partneri.length) { 
                this.produktyPartnera();
            }
        });

        // počet porovnávaných produktů
        this.porovnaniSubs = this.kalkulaceService.PorovnavaneProdukty().subscribe(produkty => {
            this.pocetPorovnani = produkty.length | 0;
        });        
    }

    ngOnDestroy(): void {
        this.partnerSubs.unsubscribe();
        this.porovnaniSubs.unsubscribe();
    }

    public produktyPartnera(): void {
        this.partneri.forEach((partner) => {
            if (partner.id) this.partneriDetail = { ...this.partneriDetail, [partner.id]: false };
            if (partner.id && !partner?.produkty ) {
                // console.log('SROVNANI partnera ', partner.id);
                partner.minCena = 999999;
                this.produktyPartneraSubs = this.kalkulaceService.getProduktyPartnera(partner.id).subscribe((resp) => {
                    // Produkty partnerů se přidávají postupně, takže změna proběhne, kolik se volá partnerů
                    if (resp.length) {
                        // console.log('SROVNANI produktyPartnera ', partner.id, resp);
                        partner.produkty = resp;
                        partner.nacteno = true;
                        partner.minCena = partner.produkty[0].ceny.lhutniPojistne;
                        if (this.partneri.length > 1) this.partneri.sort((a, b) => a.minCena < b.minCena ? -1 : 1);
                    } else {

                        // console.log('SROVNANI - kalkuluj ', partner.id);
                        // this.kalkulaceService.kalkuluj(this.data.kod, partner.id);
        
                    }
                    
                });
            }
        });
    }

    public sjednatProdukt(produktId: string): void {
        this.kalkulaceService.setVybranyProdukt(produktId);
        this.router.navigate(['../sjednani'], { relativeTo: this.route });
    }

    /*
    otevriNabidku(produktId: string): void {
        console.log('otevriNabidku', produktId);
        if (!this.data.kod || !produktId) {
            return;
        }
        this.produktNabidka[produktId] = true;
        this.kalkulaceService.nabidkaProduktu(this.data.kod, produktId).subscribe((url) => {
            console.log('otevriNabidku - vrácená URL ', url);
            this.produktNabidka[produktId] = false;
            window.open(url, '_' + produktId);
        });
    } */

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

    public detailProduktu(produktId: string): void {
        if (!produktId) {
            return;
        }        
        this.kalkulaceService.setVybranyProdukt(produktId);
        this.router.navigate(['./detail'], { relativeTo: this.route });
    }

    public porovnatProdukt(produktId: string): void {
        if (!produktId) {
            return;
        }        
        let produkty = this.kalkulaceService.getPorovnavaneProdukty();
        produkty.push(produktId);
        this.kalkulaceService.setPorovnavaneProdukty(produkty);
        // this.router.navigate(['./produktu'], { relativeTo: this.route });
    }

    public porovnaniProduktu(partnerId: string): void {
        if (!partnerId) {
            return;
        }        
        const produkty = [];
        this.kalkulaceService.getProduktyPartneraValue(partnerId).forEach((produkt, index) => {
            produkty.push(produkt.id);
        });
        this.kalkulaceService.setPorovnavaneProdukty(produkty);
        this.router.navigate(['./produktu'], { relativeTo: this.route });
    }

    public emailKalkulace(form: any): void {
        // console.log('emailKalkulace ', form);
        /*
        if (form.valid) {
            this.GAEvent('VOZ', 'Kalkulace', 'Zaslání na email', 1);
            if (this.data.id !== '' ) {
                this.data.link = this.url;
                this.dataService.emailKalkulace( this.data ).subscribe(
                    resp => {
                        if (resp) {
                            this.layout.emailKalkulaceOdeslan = true;
                        }
                    }
                );
            }
        }
        */
    }

    public GAEvent(cat: string, label: string, action: string, val: number): void {
        (window as any).ga('send', 'event', {
            eventCategory: cat,
            eventLabel: label,
            eventAction: action,
            eventValue: val
        });
    }  

}
