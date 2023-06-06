import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private authService: AuthService, private route: Router){}

  // CAN ACTIVATE COLLEGATO AL ROUTING. SE SI E' LOGGATI RITORNA TRUE E PERMETTE L'ACCESSO ALLE ROUTES, ALTRIMENTI 
  // LO RIMANDA DIRETTAMENTE AL LOGIN
  canActivate():boolean {
    if(this.authService.isLoggedIn() == true){
      return true;
    } else {
      this.route.navigateByUrl("");
      return false;
    }
  }
  
}
