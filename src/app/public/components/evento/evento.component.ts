import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/models/evento.model';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EventiService } from '../../services/eventi.service';
import { TimelineComponent } from '../shared/timeline/timeline.component';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss']
})
export class EventoComponent implements OnInit {
  privato!: boolean;
  evento!: Evento;
  id!: number;
  immagine!: string;
  eventoSubscription!: Subscription;

  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;
  @ViewChild(TimelineComponent) timeline!: TimelineComponent;
  dialogRef!: MatDialogRef<any, any>;


  constructor(
    private eventoService: EventiService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {

   }

   ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getImmagine();
    this.getEvento()
    this.auth()

  }

  async auth() {
    this.privato = await this.authService.can('opere:*:*')
  }

  getEvento() {
    if(!this.id) return;

    this.eventoService.get(this.id).subscribe((res: any) => {
      this.evento = res;
    }, (err: any) => {
        console.log(err);
    });
  }

  getImmagine() {
    if(!this.id) return;
    if(this.eventoSubscription) this.eventoSubscription.unsubscribe();
    this.eventoSubscription = this.eventoService.getImmagini(this.id).subscribe((res: any) => {
      this.immagine = res.immagini[0];
    }, (err: any) => {
        console.log(err);
    });
  }

  openImage() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dialogRef = this.dialog.open(this.detailsModal, {
      maxWidth: window.innerWidth - 10,
      maxHeight: window.innerHeight - 10
    });
  }


}
