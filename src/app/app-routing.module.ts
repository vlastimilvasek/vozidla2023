import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./zadani/zadani.module').then(m => m.ZadaniModule)
    },
    {
        path: 'zadani',
        loadChildren: () => import('./zadani/zadani.module').then(m => m.ZadaniModule)
    },
    {
        path: 'rozsah',
        loadChildren: () => import('./parametry/parametry.module').then(m => m.ParametryModule)
    },
    {
        path: 'srovnani',
        loadChildren: () => import('./srovnani/srovnani.module').then(m => m.SrovnaniModule)
    },      
    {
        path: 'sjednani',
        loadChildren: () => import('./sjednani/sjednani.module').then(m => m.SjednaniModule)
    },
    {
        path: 'shrnuti',
        loadChildren: () => import('./rekapitulace/rekapitulace.module').then(m => m.RekapitulaceModule)
    },    
    {
        path: 'zaver',
        loadChildren: () => import('./zaver/zaver.module').then(m => m.ZaverModule)
    },
    // { path: '', component: AppComponent },
    // { path: '**', component: AppComponent }
    // { path: '', redirectTo: '/zadani', pathMatch: 'full' },
    { path: '**', redirectTo: '/zadani' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules,
        relativeLinkResolution: 'legacy',
        scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }