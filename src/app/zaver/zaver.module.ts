import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { ZaverRoutingModule } from './zaver-routing.module';
import { ZaverComponent } from '../zaver/zaver.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ZaverRoutingModule
  ],
  declarations: [
    ZaverComponent
  ]
})
export class ZaverModule { }
