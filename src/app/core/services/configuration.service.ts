import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import { Configuration } from './configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
    private readonly configUrlPath: string = 'Home/Configuration';
    private configData; //: Configuration;

    constructor(
        private http: HttpClient,
        ) { }

      startmeup()
      {
          return this.http.get('../assets/i18n/cs.json').toPromise().then(async x => 
            {
              await new Promise(resolve => setTimeout(resolve, 10));
              console.log('Configuration loaded');
            });          
      }

    loadConfigurationData() {
        this.http
            .get(`${this.configUrlPath}`) // <Configuration> ${this.originUrl}
            .subscribe(result => {
                this.configData = {
                    test1ServiceUrl: result["test1ServiceUrl"],
                    test2ServiceUrl: result["test2ServiceUrl"]        
                }
            });
    }

    get config() { // config(): Configuration
        return this.configData;
    }
}