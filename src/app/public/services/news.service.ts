import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxCrudService } from '@sinapsys/ngx-crud';
import { News } from 'src/app/models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends NgxCrudService<News, number> {

  baseUrlAdd: string = 'news';

  constructor(
    protected http: HttpClient
  ) {

    super(http, {
      apiBaseUrl: "http://localhost:3000/public/"
    });
    this._baseUrl += 'news/';
  }

  setBaseUrlAdd(urlstring: string){
    this._baseUrl = this._baseUrl.replace('news/','');
    this._baseUrl += urlstring+'/';
    console.log('service ul', this._baseUrl);
  }

  resetBaseUrl(){
    this._baseUrl = "http://localhost:3000/public/news/";
  }

  getImmagini(id: number): any {
    return this.http.get<any>(`${this._baseUrl}${id}/immagini`)
  }
}
