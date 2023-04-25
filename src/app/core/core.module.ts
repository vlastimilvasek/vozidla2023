import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { ApiService, ArticlesService, JwtService, AlertService, DataService, ParamsService
  /*
  AuthGuard,
  CommentsService,
  ProfilesService,
  TagsService,
  UserService */
} from './services';



@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        ApiService,
        ArticlesService,
        JwtService,
        TranslateService,
        AlertService,
        DataService,
        ParamsService,
        /* 
        AuthGuard,
        CommentsService,
        ProfilesService,
        TagsService,
        UserService */
    ],
    declarations: [

    ],
    exports: [

    ]
})
export class CoreModule { }
