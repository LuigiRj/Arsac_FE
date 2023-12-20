import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxCrudService, PageRequest } from "@sinapsys/ngx-crud";
import { map, Observable } from "rxjs";
import { Scheda, TipoScheda } from "src/app/models/scheda.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SchedeService extends NgxCrudService<Scheda, string> {
  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl
    });
    this._baseUrl += 'schede/';
  }

  private _cache: any = {};
  private _loaded: boolean = false;

  public vocabulary: any = {"campi": []};

  getTipiScheda(): Observable<TipoScheda[]> {
    return this.http.get<TipoScheda[]>(this._baseUrl + '_types', { withCredentials: true, responseType: 'json' });
  }

  loadVocabolari(tsk: string) {
    this._loaded = false;
    return this.http.get<any[]>(this._baseUrl + '_voc/' + tsk, { withCredentials: true, responseType: 'json' }).pipe(res => {
      res.subscribe(r => {
        this._cache = r;
        this._loaded = true;
      });
      return res;
    });
  }


  loadOrGetSigleWord(wrd: string){

   console.log('utilizzo vocablario per', wrd)
    if(!this.checkSingleWord(wrd, false))
    {
      console.log('Scarico vocablario per', wrd)
      this.loadSingleWord(wrd);
    }

    return this.getSingleWord(wrd);

  }

  loadSingleWord(wrd: string) {

  if(!this.checkSingleWord(wrd, false))
  {
    return this.http.get<any[]>(this._baseUrl + '_word/' + wrd, { withCredentials: true, responseType: 'json' }).pipe(res => {
      res.subscribe(r => {
        //console.log(`{${wrd}: [${r}] }`);
        if(r != null)
        {
          this.vocabulary.campi[wrd] = [r];
        }

      });
      return res;
    });
  }
   return;
  }

  getSingleWord(wrd: string) {
    return new Observable<any[]>(observer => {
      const interval = setInterval(() => {
        if (this._loaded) {
          clearInterval(interval);
          observer.next(this.vocabulary.campi[wrd] || []);
          observer.complete();
        }
      }, 100);
    });
  }

  checkSingleWord(wrd: string, word: boolean){
    var hasMatch =false;
    var element = this.vocabulary.campi[wrd];

    if(element != undefined)
    {
      hasMatch =true;
    }

    if(word == true)
    {
      return element;
    }
    else
    {
      return hasMatch;
    }

  }

  findArraySingleWord(wrd: string){
    this.vocabulary.campi
  }

  getVocabolario(acr: string) {
    return new Observable<any[]>(observer => {
      const interval = setInterval(() => {
        if (this._loaded) {
          clearInterval(interval);
          observer.next(this._cache[acr] || []);
          observer.complete();
        }
      }, 100);
    });
  }

  restore(id: string): Observable<Scheda> {
    return this.http.post<Scheda>(this._baseUrl + id + '/_restore', {}, { withCredentials: true, responseType: 'json' });
  }

  getAutocomplete(sq: string): Observable<Scheda[]> {
    return this.search({ __denominazione: { $like: sq } }, new PageRequest(0, 25, "desc", "id")).pipe(map(c => c.items.map(s => new Scheda(s))));
  }
}
