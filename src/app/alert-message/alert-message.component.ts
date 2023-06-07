import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
// COMPONENTE DEDICATA PER GENERARE L'ALERT DEGLI ERRORI PROVENIENTI DAL BACKEND
export class AlertMessageComponent implements OnInit {

  @Input() errorMessage: string; // INPUT CHE RICEVERA' IL MESSAGGIO DI ERRORE PROVENIENTE DAL BACKEND
  showAlert: boolean = false; // MOSTRA L'ALERT IN BASE A QUESTA VARIABILE SE E' VERA O FALSA

  // IN Input ARRIVA IL MESSAGGIO DELL'ERRORE COME STRINGA, E CON UNA VARIABILE BOOLEANA MOSTRIAMO L'ALERT NELL'HTML
  // DOPO TRE SECONDI RIPORTIAMO LA VARIABILE SU FALSE COSI DA FAR SCOMPARIRE L'ALERT
  ngOnInit(): void {    
    if(this.errorMessage != '' && this.errorMessage != undefined && this.errorMessage != null) { 
      this.showAlert = true;
      setTimeout(()=> {
        this.showAlert = false;
      }, 3000);
    }
    else this.showAlert = false;
  }

}
