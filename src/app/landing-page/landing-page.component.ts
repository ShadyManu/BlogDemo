import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor() {    
  }

  showLogin: boolean = true; // VARIABILE CHE FA MOSTRARE O MENO IL LOGIN COMPONENT
  showRegister: boolean = false; // VARIABILE CHE FA MOSTRARE O MENO IL REGISTER COMPONENT

  // RICEVE IL VALORE DAL FIGLIO (REGISTER COMPONENT) PER FAR MOSTRARE IL DOPO CHE CI SI E' REGISTRATI
  @Input() isRegisterValid : boolean = false; 

  ngOnInit(): void {
  }

  // SE SI CLICCA SU LOGIN, MOSTRA LOGIN-COMPONENT E NASCONDE REGISTER-COMPONENT
  viewLogin(){
    this.showLogin = true;
    this.showRegister = false;
  }

  // SE SI CLICCA SU REGISTER, MOSTRA REGISTER-COMPONENT E NASCONDE LOGIN-COMPONENT
  viewRegister(){
    this.showLogin = false;
    this.showRegister = true;
  }

}
