import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FrontEnd-BlogDemo';

  constructor(private route: Router, private authService: AuthService) {
  }

  // APPENA SI AVVIA L'APPLICATIVO, SETTA LA VARIABILE NELL'AUTH SERVICE SE SI E' LOGGATI O MENO (A SECONDA SE C'E'
  // IL TOKEN NEI COOKIES). POI CONTROLLA IL VALORE DELLA VARIABILE, E SE E' TRUE LO RIMANDA ALLA HOME, ALTRIMENTI 
  // LO RIMANDA AL LOGIN. RITORNA TRUE SE SI SPUNTA LA CASELLA 'Remember Me' DURANTE IL LOGIN. DIFATTI VIENE SALVATO
  // IL TOKEN NEI COOKIES PER 30 GIORNI.
  ngOnInit(): void {
    this.authService.setRememberMe();
    if(this.authService.isLoggedIn() == true) this.route.navigateByUrl("Home/Posts");
    else this.route.navigateByUrl("Login");
  }

}
