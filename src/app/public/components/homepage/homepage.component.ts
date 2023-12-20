import { NewsService } from 'src/app/public/services/news.service';
import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { EventiService } from '../../services/eventi.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    items: 1,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    nav: true,
  }

  slides: any[] = [
    {
      id: 1,
      url: '../../../../assets/images/Screenshot 2023-03-07 102020.png',
    },
    {
      id: 2,
      url: 'https://www.museoman.it/.galleries/img-collezione/Ernesto-Ceccarelli-Paesaggio-1964-olio-su-tela-cartonata-photo-Confinivisivi.jpg?__scale=w:1140,h:797,t:3,p:8,c:transparent',
    },
    {
      id: 3,
      url: 'https://www.museoman.it/.galleries/img-collezione/Pietro-Collu-Valverde-1938-olio-su-cartone-Ph.-Confinivisivi-Pierluigi-Dessi.jpg?__scale=w:1140,h:946,t:3,p:6,c:transparent'
    }
  ]

  eventi: any[] = []
  news: any[] = []

  constructor(
    private eventiService: EventiService,
    private newsService: NewsService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.searchEventi()
    this.searchNews()
  }
  searchNews() {
    this.newsService.search({}).subscribe(
      res => {
        this.news = res.items
        console.log('item-->', res.items);
      },
      err => {
        this.utilsService.defaultHttpErrorHandler(err)
      }
    )
  }

  searchEventi(keepPage?: boolean) {
   this.eventiService.search({}).subscribe(
      res => {
        this.eventi = res.items
      },
      err => {
        this.utilsService.defaultHttpErrorHandler(err)
      }
    )
  }

}
