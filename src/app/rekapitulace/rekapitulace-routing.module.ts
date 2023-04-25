import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RekapitulaceComponent } from './rekapitulace.component';
import { RekapitulaceResolver } from './rekapitulace.resolver';

const routes: Routes = [
    {
        path: '',
        component: RekapitulaceComponent,
        resolve: {
            data: RekapitulaceResolver
        },
        data: { animation: 0 }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RekapitulaceRoutingModule { }
