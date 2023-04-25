import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DataService, ParamsService, Seznamy, IVozidla, Vozidla } from '../core';

@Component({
  selector: 'app-zaver',
  templateUrl: './zaver.component.html',
  // styleUrls: ['./zaver.component.scss']
})
export class ZaverComponent implements OnInit {
  data: IVozidla; 
  lists: Seznamy;
  loading = false;
  layout;
  sjednani;  
  valid;
  progress = 0;  

  constructor(
    private route: ActivatedRoute,    
    private router: Router,
    private dataService: DataService,
    private alertService: AlertService,
    private paramsService: ParamsService
  ) {}

  ngOnInit() {

    /*
    this.data = this.dataService.data;
    this.layout = this.paramsService.layout;
    this.valid = this.dataService.validate();

    if (!this.valid) {
      this.router.navigate(['/']);
    } else {
      this.loading = true;
      for(let i = 1; i <= 300; i++) {
          setTimeout(() => {
              this.progress = i;
          }, i*100);
      }        
      this.dataService.ulozPoptavkuHAV(this.data).subscribe({
          next: (sjednani) => {
              console.log('sjednat - resp: ', sjednani);
              this.loading = false;
              this.sjednani = sjednani;
              this.GAEvent('HAV', 'Kalkulace', 'Poptávka na email', 1);
              this.dataService.data = new Vozidla(null);
          },
          error: (e) => {
              console.log('sjednat - error: ', e);
              this.loading = false;
              this.sjednani = { status: 0 };
          }
      });      
    }
    */
  }  

  GAEvent(cat: string, label: string, action: string, val: number): void {
    (<any>window).ga('send', 'event', {
        eventCategory: cat,
        eventLabel: label,
        eventAction: action,
        eventValue: val
    });
  }  

}
