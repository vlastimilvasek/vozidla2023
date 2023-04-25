import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametryComponent } from './parametry.component';
import { ParametryResolver } from './parametry.resolver';

const routes: Routes = [
    {
        path: '',
        component: ParametryComponent,
        resolve: {
            data: ParametryResolver
        },
        data: { animation: 0 }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ParametryRoutingModule { }
