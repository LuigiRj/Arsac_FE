import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxUploadService } from '@sinapsys/ngx-upload';
import { Subscription } from 'rxjs';
import { Opera } from 'src/app/models/opera.model';
import { AuthService } from 'src/app/services/auth.service';
import { TimelineService } from 'src/app/services/schede/timeline.service';
import { UtilsService } from 'src/app/services/utils.service';
import { OpereService } from '../../services/opere.service';
import { TimelineComponent } from '../shared/timeline/timeline.component';

@Component({
  selector: 'app-opera',
  templateUrl: './opera.component.html',
  styleUrls: ['./opera.component.scss']
})
export class OperaComponent implements OnInit {

  privato!: boolean;
  opera!: Opera;
  id!: number;
  immagine!: string;
  slides: any[] = []
  operaSubscription!: Subscription;

  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;
  @ViewChild(TimelineComponent) timeline!: TimelineComponent;
  dialogRef!: MatDialogRef<any, any>;

  constructor(
    private opereService: OpereService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private timelineService: TimelineService,
    private utilsService: UtilsService,
    private uploadService: NgxUploadService,
  ) {

   }

   ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getImmagine();
    this.getOpera()
    this.auth()
  }

  async auth() {
    this.privato = await this.authService.can('opere:*:*')
  }

  getOpera() {
    if(!this.id) return;

    this.opereService.get(this.id).subscribe((res: any) => {
      this.opera = res;
    }, (err: any) => {
        console.log(err);
    });
  }

  getImmagine() {
    if(!this.id) return;
    if(this.operaSubscription) this.operaSubscription.unsubscribe();
    this.operaSubscription = this.opereService.getImmagini(this.id).subscribe((res: any) => {
      this.immagine = res.immagini[0];
    }, (err: any) => {
        console.log(err);
    });
  }


}
