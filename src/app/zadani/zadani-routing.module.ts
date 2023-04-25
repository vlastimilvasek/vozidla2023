import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZadaniComponent } from './zadani.component';
import { ZadaniResolver } from './zadani.resolver';

const routes: Routes = [
    {
        path: '',
        component: ZadaniComponent,
        resolve: {
            data: ZadaniResolver
        },
        data: { animation: 0 }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ZadaniRoutingModule { }
