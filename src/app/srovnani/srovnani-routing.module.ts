import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SrovnaniComponent } from './srovnani.component';
import { SrovnaniDetailComponent } from './srovnani-detail.component';
import { SrovnaniPorovnaniComponent } from './srovnani-porovnani.component';
import { SrovnaniNastaveniComponent } from './srovnani-nastaveni.component';
import { SrovnaniResolver } from './srovnani.resolver';

const routes: Routes = [
    {
        path: '',
        component: SrovnaniComponent,
        /*
        resolve: {
            data: SrovnaniResolver
        }
        */
    },
    {
        path: 'detail',
        component: SrovnaniDetailComponent
    },
    {
        path: 'produktu',
        component: SrovnaniPorovnaniComponent
    },
    {
        path: 'uprava-produktu',
        component: SrovnaniNastaveniComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SrovnaniRoutingModule { }
