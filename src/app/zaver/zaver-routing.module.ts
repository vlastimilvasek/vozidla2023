import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZaverComponent } from './zaver.component';
import { ZaverResolver } from './zaver.resolver';

const routes: Routes = [
  {
    path: '',
    component: ZaverComponent,
    resolve: {
      data: ZaverResolver
    }
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZaverRoutingModule { }
