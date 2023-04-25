import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CoreModule } from './core';
import { SharedModule } from './shared';

import { ConfigurationService } from './core/services/configuration.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
      /*
    {
        provide: APP_INITIALIZER,
        deps: [ConfigurationService],
        useFactory: (configService: ConfigurationService) =>
            () => configService.startmeup(),
        multi: true
    }, */
  ],
  exports: [
    HttpClientModule,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
