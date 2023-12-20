import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-informazioni',
  templateUrl: './informazioni.component.html',
  styleUrls: ['./informazioni.component.scss']
})
export class InformazioniComponent implements OnInit {

  navigations: string[] = ['Come raggiungerci', 'Orari e tariffe', 'Accessibilità', 'Contatti'];
  obj = this.navigations.map(str => ({
    lbl: str,
    url: str.replace(/\s+/g, '-').toLowerCase()
  }));

  public activatedRoute!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute = this.route.snapshot.url[0].path;
  }

}
