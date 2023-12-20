import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/models/evento.model';
import { EventiService } from 'src/app/public/services/eventi.service';

@Component({
  selector: 'app-card-evento',
  templateUrl: './card-evento.component.html',
  styleUrls: ['./card-evento.component.scss']
})
export class CardEventoComponent implements OnInit {

  @Input() evento!: Evento;

  immagine!: string;

  eventoSubscription!: Subscription;

  constructor(
    private eventoService: EventiService
  ) { }

  ngOnInit(): void {

    this.eventoSubscription = this.eventoService.getImmagini(this.evento.id).subscribe((res: any) => {
      this.immagine = res.immagini[0]
    })
  }

}
