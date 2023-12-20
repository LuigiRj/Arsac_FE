import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { News } from 'src/app/models/news.model';
import { NewsService } from 'src/app/public/services/news.service';

@Component({
  selector: 'app-card-news',
  templateUrl: './card-news.component.html',
  styleUrls: ['./card-news.component.scss']
})
export class CardNewsComponent implements OnInit {

  @Input() news!: News;

  immagine!: string;

  newsSubscription!: Subscription;

  constructor(
    private newsService: NewsService
  ) { }

  ngOnInit(): void {
   console.log('news id', this.news.id);
    this.newsSubscription = this.newsService.getImmagini(this.news.id).subscribe((res: any) => {
      this.immagine = res.immagini[0]
    })
  }

}
