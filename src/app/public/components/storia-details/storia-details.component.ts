import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-storia-details',
  templateUrl: './storia-details.component.html',
  styleUrls: ['./storia-details.component.scss']
})
export class StoriaDetailsComponent implements OnInit {

  title =  '';
  routerSubscription: any;

  constructor( private router: Router) {
    this.title = this.prepareTitle(this.router.url)


   }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((val) => {
       this.title = this.prepareTitle(this.router.url)

  });
  }

  ngOnDestroy(){
    this.routerSubscription.unsubscribe();
}


  prepareTitle(title: string){
    var element = title.split("/").pop() || '';
    element = element.replace(/-/g, ' ') ;
    element = this.capitalizeFirstLetter(element);
    return element;
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
    }


}
