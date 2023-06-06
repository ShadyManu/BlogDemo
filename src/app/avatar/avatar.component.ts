import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
  @Input() name?: string; // INPUT CHE RICEVE IL NOME (DELL'AUTORE DEL POST, DEL COMMENTO O DI CHI E' LOGGATO)
  initials: string = ''; // INIZIALI CHE VERRANNO PASSATE ALL'HTML DA MOSTRARE DENTRO L'IMMAGINE
  arrayName?: string[] = []; // ARRAY CHE CONTIENE TUTTI I NOMI SINGOLI CON CUI SI E' REGISTRATI

  // SPACCHETTA IL NOME CHE ARRIVA E PER OGNUNO DI ESSI PRENDE L'INIZIALE E LA METTE IN MAIUSCOLO
  ngOnInit(): void {   
    this.arrayName = this.name?.split(' ');
    for(let i=0; i < this.arrayName!.length; i++){
      this.initials = this.initials + this.arrayName![i].charAt(0).toUpperCase();
    }
  }
}
