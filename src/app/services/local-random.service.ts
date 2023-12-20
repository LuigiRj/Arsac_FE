import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocalRandomService {


  idForNew: string = ''

  constructor( public route: Router, public ar: ActivatedRoute, ) {
    //this.idForNew = this.randomString(7)
  }

  public setUrlIdScheda(id: string){
    this.idForNew = id;
  }

  getFromLocalOrCreateNew(acr: string, id?: string){
    if(this.getRandFromLocal(acr))
    {
      return this.getRandFromLocal(acr)
    }
    else
    {
      return this.pushRandInLocal(acr)
    }
  }

  pushRandInLocal(acr: string, rand?: string, schId?: string){
    let rnd: string = rand || this.randomString(10);
    let id =  schId || this.idForNew;
    if(id==''){return rnd}
    //console.log('push-->', acr, rnd)
      if (localStorage.getItem("randomEnum_"+id) === null) {
        var data: any = {'id': id,
          stringhe:{[acr] : rnd}
          }
        localStorage.setItem('randomEnum_'+id , JSON.stringify(data));
      }
      else{
        var data: any = JSON.parse(localStorage.getItem('randomEnum_'+id)|| '');
        data.stringhe[acr] = rnd;
        localStorage.setItem('randomEnum_'+id ,JSON.stringify(data));
      }
    return rnd;
    }

    getRandFromLocal(acr: string, idS?: string){
      let id = idS? idS : this.idForNew;
      if(id!='')
      {
        if (localStorage.getItem('randomEnum_'+id ) != null) {
          var data: any = JSON.parse(localStorage.getItem('randomEnum_'+id)|| '');
          return data.stringhe[acr];
        }
        return '';
      }
      return '';
    }

    randomString(length: number) {
      var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for ( var i = 0; i < length; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
  }

  public schedaRecIteration(obj: any, id: string)
  {
    this.eachRecursive(obj, id)
  }

  eachRecursive(obj: any, id: string)
  {
      for (var k in obj)
      {
          if (typeof obj[k] == "object" && obj[k] !== null)
         { var keys = Object.keys(obj[k]).forEach( key =>{this.pushRandInLocal(key.split('_')[0], key.split('_')[1], id)});
              this.eachRecursive(obj[k], id);
      }

      }
  }

  normalizeSezione(sezione: any) {
    Object.keys(sezione).forEach((key) => {
      if(key.indexOf('_') > -1)
      {
        let newKey = key.split('_')[0];
        sezione[newKey] = sezione[key];
        delete sezione[key];
      }

   });
   return sezione;
 }

}
