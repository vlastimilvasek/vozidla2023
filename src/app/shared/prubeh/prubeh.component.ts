import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-prubeh',
    templateUrl: './prubeh.component.html'
})
export class PrubehComponent implements OnInit {
    @Input() krok;

    constructor() { }

    ngOnInit(): void {
    }

}
