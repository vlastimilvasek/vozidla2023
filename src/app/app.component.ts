import { Component, HostListener } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { DataService, Vozidla } from './core';
import { slideRightLeftAnimation } from './core/animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [slideRightLeftAnimation]
})
export class AppComponent {
    title = 'Pojištění vozidel';
    layouthelper = 'none';

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Ł' || event.key === 'ø') { this.layouthelper = this.layouthelper === 'none' ? '' : 'none'; }
    }  

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
    ) {}

    ngOnInit() {

        
        // Následující neproběhne - router přesměrovává na /zadani  this.route.snapshot.queryParams.data je vždy undefined
        /*
        if (this.route.snapshot.queryParams['kod'] !== undefined ) {
            this.dataService.nactiKalkulaci( this.route.snapshot.queryParams['kod'] ).subscribe( resp => console.log('nactiKalkulaci', resp));
            // this.formlyOptions.formState.layout.rzLoaded = true;
        } else if (this.route.snapshot.queryParams.data !== undefined ) {
            try {
                this.dataService.updateData( new Vozidla(JSON.parse(this.route.snapshot.queryParams.data)) );
                // this.formlyOptions.formState.layout.rzLoaded = true;
            } catch (e) {
                console.log(e);
            }
        }
        // this.router.navigate(['./zadani'], { relativeTo: this.route });
        */
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }
}
