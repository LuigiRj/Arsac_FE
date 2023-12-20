import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxUploadService } from '@sinapsys/ngx-upload';
import { Subscription } from 'rxjs';
import { News } from 'src/app/models/news.model';
import { AuthService } from 'src/app/services/auth.service';
import { TimelineService } from 'src/app/services/schede/timeline.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NewsService } from '../../services/news.service';
import { TimelineComponent } from '../shared/timeline/timeline.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  privato!: boolean;
  news!: News;
  id!: number;
  immagine!: string;
  newsSubscription!: Subscription;

  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;
  @ViewChild(TimelineComponent) timeline!: TimelineComponent;
  dialogRef!: MatDialogRef<any, any>;


  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {

   }

   ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getImmagine();
    this.getNews()
    this.auth()

  }

  async auth() {
    this.privato = await this.authService.can('opere:*:*')
  }

  getNews() {
    if(!this.id) return;

    this.newsService.get(this.id).subscribe((res: any) => {
      this.news = res;
    }, (err: any) => {
        console.log(err);
    });
  }

  getImmagine() {
    if(!this.id) return;
    if(this.newsSubscription) this.newsSubscription.unsubscribe();
    this.newsSubscription = this.newsService.getImmagini(this.id).subscribe((res: any) => {
      this.immagine = res.immagini[0];
    }, (err: any) => {
        console.log(err);
    });
  }

  openImage() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dialogRef = this.dialog.open(this.detailsModal, {
      maxWidth: window.innerWidth,
      maxHeight: window.innerHeight - 10
    });
  }


}
