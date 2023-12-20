import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-museo',
  templateUrl: './museo.component.html',
  styleUrls: ['./museo.component.scss']
})
export class MuseoComponent implements OnInit {

  navigations: string[] = ['Missione', 'Storia e sede', 'Attività espositiva', 'Mediazione e didattica', 'Staff', 'Partner', 'Carta dei servizi', 'Cataloghi' ];
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
