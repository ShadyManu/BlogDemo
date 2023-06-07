import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/service/auth.service';
import { UserService } from 'src/service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [CookieService]
})
export class HeaderComponent implements OnInit{

  // COSTRUTTORE PER LE DIPENDENZE
  constructor(
    private userService: UserService, 
    private route: Router, 
    private authService: AuthService, 
    private cookie: CookieService)
    { }

  name: string; // VARIABILE CHE CONTERRA' IL NOME COMPLETO DI CHI E' LOGGATO, CHE VERRA' PASSATA ALL'APP-AVATAR

  // PRENDE LE INFORMAZIONI DELLO USER DAL BACKEND, PER RECUPERARNE IL NOME INTERO
  ngOnInit(): void {
    this.userService.getUser().subscribe(result => {
      this.name = result.data.authorName;      
    })
  }

  // QUANDO SI ESEGUE IL LOGOUT, A PRESCINDERE SE SI AVEVA SCELTO IL 'REMEMBER ME', CANCELLA I COOKIE E RIPORTA AL LOGIN
  logout(){
    this.cookie.deleteAll();
    this.route.navigateByUrl("Login");
  }

}
