import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DOCUMENT, formatNumber, registerLocaleData } from '@angular/common';
import itIT from "@angular/common/locales/it";
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Model } from '@sinapsys/ngx-crud';
import * as angular2Notifications from "angular2-notifications";
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ConfirmDialogComponent } from '../private/components/shared/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from '../private/components/shared/prompt-dialog/prompt-dialog.component';

registerLocaleData(itIT, 'it-IT')

moment.locale('it');

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  moment = moment;
  player!: AnimationPlayer;
  loadingEl: Element;
  XLSX = XLSX;

  constructor(
    public notificationsService: angular2Notifications.NotificationsService,
    private _animationBuilder: AnimationBuilder,
    private _router: Router,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any
  ) {
    this.loadingEl = this._document.body.querySelector('#loading');
    this._router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.showLoading();
          this.setCurrentAndPreviousUrl(event.url);
        }
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            this.hideLoading();
          });
        }
      });
  }

  static getInstance() {
    return this;
  }

  defaultHttpErrorHandler(error: any): void {
    if (typeof error === 'string') {
      this.notificationsService.error(error);
    }
    else if (error && error.error && error.error.error && typeof error.error.error === 'string') {
      this.notificationsService.error(error.error.error);
    }
    else if (error && error.error && error.error.message && typeof error.error.message === 'string') {
      this.notificationsService.error(error.error.message);
    }
    else if (error && error.error && typeof error.error === 'string') {
      this.notificationsService.error(error.error);
    }
    else if (error && error.message && typeof error.message === 'string') {
      this.notificationsService.error(error.message);
    }
    else {
      this.notificationsService.error('Si è verificato un errore');
    }
  }

  showLoading() {
    this.loadingEl
    this.player =
      this._animationBuilder
        .build([
          style({
            opacity: '0',
            zIndex: '99999'
          }),
          animate('400ms ease', style({ opacity: '1' }))
        ]).create(this.loadingEl);

    setTimeout(() => {
      this.player.play();
    }, 0);
  }

  hideLoading() {
    this.player =
      this._animationBuilder
        .build([
          style({ opacity: '1' }),
          animate('400ms ease', style({
            opacity: '0',
            zIndex: '-10'
          }))
        ]).create(this.loadingEl);

    setTimeout(() => {
      this.player.play();
    }, 0);
  }

  setCurrentAndPreviousUrl(url: string) {
    if (sessionStorage.getItem("currentUrl")) {
      let currentUrl = sessionStorage.getItem("currentUrl");
      if (currentUrl !== url) {
        sessionStorage.setItem("previousUrl", currentUrl || '');
        sessionStorage.setItem("currentUrl", url);
      }
    } else sessionStorage.setItem("currentUrl", url);
  }

  getPreviousUrl() {
    let previousUrl = "/";
    if (sessionStorage.getItem("previousUrl"))
      previousUrl = sessionStorage.getItem("previousUrl") || '';
    return previousUrl;
  }

  compareNumbers(a: any, b: any) {
    return parseFloat(a) === parseFloat(b);
  }

  compare(a: any, b: any) {
    return a === b;
  }

  saveAs(blob: Blob, fileName: string) {
    let url = URL.createObjectURL(blob);
    return this.download(fileName, url);
  }

  download(fileName: string, url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  copyToClipboard(data: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = data;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  getHourDiff(pStartHour: string, pEndHour: string) {
    let res: Boolean;
    let aTmp = [];
    aTmp = pStartHour.split(":");
    let nStartMin = (Number(aTmp[0]) * 60) + Number(aTmp[1]);
    aTmp = pEndHour.split(":");
    let nEndMin = (Number(aTmp[0]) * 60) + Number(aTmp[1]);
    if (nStartMin < nEndMin) {
      res = true;
    } else {
      res = false;
    }
    return res;
  }

  displayEntity(m: Model) {
    return m ? m.toString() : '';
  }

  compareById(a: any, b: any) {
    return a?.id === b?.id;
  }

  compareByCodice(a: any, b: any) {
    return a?.codice === b?.codice;
  }

  compareByUUID(a: any, b: any) {
    return a.uuid === b.uuid;
  }

  compareStrings(a: any, b: any) {
    return a === b;
  }

  xmlToJson(xml: any) {
    var obj: any = {}
    if (xml.nodeType == 1) {
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {}
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j)
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue
        }
      }
    } else if (xml.nodeType == 3) {
      obj = xml.nodeValue
    }
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        item = item == null ? '' : item;
        var nodeName = item.nodeName
        if (nodeName == '#text') nodeName = 'text'
        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = this.xmlToJson(item)
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName]
            obj[nodeName] = []
            obj[nodeName].push(old)
          }
          obj[nodeName].push(this.xmlToJson(item))
        }
      }
    }
    return obj
  }

  base64toBlob(base64Data: string, contentType: string) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  pad(d: any, l: number = 9, p: string = '0'): string {
    let s: string = d.toString();
    if (s.length > l) {
      return s.substring(0, l);
    }
    let rem = l - s.length;
    for (let i = 0; i < rem; ++i) {
      s = p + s;
    }
    return s;
  }

  generateUUID({
    dip, uoc, uos
  }: {
    dip?: number,
    uoc?: number,
    uos?: number
  }): string {
    return 'UUID:' + this.pad(dip || 0, 9, '0') + this.pad(uoc || 0, 9, '0') + this.pad(uos || 0, 9, '0');
  }

  prompt(message: string, defaultValue?: string): Promise<string> {
    return new Promise((resolve, _reject) => {
      const dialogRef = this.dialog.open(PromptDialogComponent, {
        width: '400px'
      });
      dialogRef.componentInstance.text = message;
      dialogRef.componentInstance.afterSave.subscribe(res => {
        resolve(res);
      });
    });
  }

  confirm(message: string): Promise<boolean> {
    return new Promise(resolve => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px'
      });
      dialogRef.componentInstance.text = message;
      dialogRef.componentInstance.afterSave.subscribe(res => {
        resolve(res);
      });
    })
  }

  filter(arr: any[], val: string, fields: string[]): any[] {
    return arr.filter(item => {
      let res = false;
      fields.forEach(field => {
        if (item[field] && item[field].toString().toLowerCase().indexOf(val.toLowerCase()) > -1) {
          res = true;
        }
      });
      return res;
    });
  }

  formatAmount(s: any) {
    return `€ ${formatNumber(s, "it-IT", "1.2-4")}`;
  }

  formatAmountNoEuro(s: any) {
    return `${formatNumber(s, "it-IT", "1.2-4")}`;
  }

  chipsSeparatorKeysCodes = [ENTER, COMMA];
}
