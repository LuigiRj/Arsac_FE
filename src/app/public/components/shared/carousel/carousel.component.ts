import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxUploadService } from '@sinapsys/ngx-upload';
import { Subscription } from 'rxjs';
import { Opera } from 'src/app/models/opera.model';
import { OpereService } from 'src/app/public/services/opere.service';
import { AuthService } from 'src/app/services/auth.service';
import { TimelineService } from 'src/app/services/schede/timeline.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input() opera!: Opera

  immagine!: string;
  id!: number;
  operaSubscription!: Subscription;

  items: any = [];
  activeIndex = 0;

  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any, any>;

  dialogWidth: string = '80%';
  dialogHeight: string = '80%';

  constructor(
    private opereService: OpereService,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private dialog: MatDialog,
  ) {
    this.id = this.route.snapshot.params.id;
    this.getImmagine();
  }

  ngOnInit(): void {
    this.setDialogDimensions()
  }

  getImmagine() {
    if(!this.id) return;
    if(this.operaSubscription) this.operaSubscription.unsubscribe();
    this.operaSubscription = this.opereService.getImmagini(this.id).subscribe((res: any) => {
      this.items = res.immagini
    }, (err: any) => {
        console.log(err);
    });
  }

  next() {
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
  }

  prev() {
    this.activeIndex = (this.activeIndex - 1 + this.items.length) % this.items.length;
  }

  openImage(i: number) {
    this.immagine = this.items[this.activeIndex];
    this.dialogRef = this.dialog.open(this.detailsModal, {
      maxWidth: this.dialogWidth,
      maxHeight: this.dialogHeight
    });
  }

  setDialogDimensions() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth >= windowHeight) {
      // Landscape orientation
      this.dialogWidth = '100%';
      this.dialogHeight = 'auto';
    } else {
      // Portrait orientation
      this.dialogWidth = 'auto';
      this.dialogHeight = '80%';
    }
  }
}
