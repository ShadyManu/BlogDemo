import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { LoginDTO } from 'src/dto/Auth/LoginDTO';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // PRENDE L'ELEMENTO CON #ID = popOver DAL DOM (DOCUMENT OBJECT MODEL) PER POTERLO UTILIZZARE
  @ViewChild('popOver') public myPopover: NgbPopover;

  // COSTRUTTORE PER LE DIPENDENZE
  constructor(
    private router: Router, 
    private form: FormBuilder, 
    private authService: AuthService, 
    private cookie: CookieService) {    
  }

  loginForm: FormGroup; // FORM GROUP RELATIVO AL LOGIN
  checkUsername?: boolean = false; // CONTROLLA SE IL VALIDATOR ASSOCIATO ALLO USERNAME E' VALIDO
  checkPassword?: boolean = false; // CONTROLLA SE IL VALIDATOR ASSOCIATO ALLA PASSWORD E' VALIDO
  isLoginValid?: boolean = false; // CONTROLLA SE TUTTO IL FORM E' VALIDO O MENO
  loginDTO: LoginDTO; // loginDTO CHE SARA' MANDATO AL BACKEND, CON I DATI PRESI DAL FORM
  colorButton: boolean = false; // CONTROLLA SE CI SONO ERRORI AL BACK, E METTE IL PULSANTE DEL LOGIN CON COLORE ROSSO
  message: string | null = ''; // MESSAGGIO CHE CONTIENE EVENTUALI ERRORI PROVENIENTI DAL BACKEND

  // NELL'INIZIALIZZAZIONE DEL COMPONENT, SI COSTRUISCE IL FORM GROUP DEL LOGIN
  ngOnInit(): void {
    this.buildRegisterForm();
  }

  // COSTRUISCE IL FORM GROUP DEL LOGIN, CON DUE VALIDATORS 'REQUIRED', IN PIU SI SOTTOSCRIVE AI CAMBIAMENTI DI STATO
  // DEL FORM, PER CONTROLLARE SE E' VALIDO O MENO
  buildRegisterForm(){
    this.loginForm = this.form.group({
      username: [, [Validators.required]],
      password: [, [Validators.required]],
      rememberMe: [false,]
    });

    this.loginForm.statusChanges.subscribe((status) => {      
      this.checkUsername = this.loginForm.get("username")?.valid;
      this.checkPassword = this.loginForm.get("password")?.valid;
      if(this.checkUsername && this.checkPassword){
        this.isLoginValid = true;
      } else {
        this.isLoginValid = false;
      }      
    });
  }

  // RIEMPIE IL loginDTO CON I CAMPI DEL FORMGROUP, CHIAMA L'authService, SI SOTTOSCRIVE ALLA RISPOSTA:
  // SE LA RISPOSTA E' POSITIVA SALVA IL TOKEN (LOCAL STORAGE O SESSION STORAGE), SE LA RISPOSTA E' NEGATIVA
  // SALVA IL MESSAGGIO DI ERRORE IN UNA VARIABILE, CHE VIENE COLLEGATA AL POPOVER DEL PULSANTE
  login(){
    this.loginDTO = new LoginDTO(this.loginForm.get("username")?.value, this.loginForm.get("password")?.value);
    
    this.authService.login(this.loginDTO).subscribe(result => {       
      if(result.data != null){
        if(this.loginForm.get("rememberMe")?.value){
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30); // Cookies durata di 30 giorni
          this.cookie.set("token", result.data, { expires: expirationDate }); // Setta il token come Cookie con scadenza
          this.authService.rememberMe = true;
        } else {  
          this.authService.rememberMe = false;
          this.cookie.set("token", result.data); // Setta il token come Cookie con scadenza 'session'
        }
        this.router.navigate(["/Home"]);
      } else {
        this.message = result.message;     
        this.popoverAnimation(true);
      }
      
    },(error) => {           
      if(error.message) {
        this.message = error.message;     
        this.popoverAnimation(true);
      } else if (error.title){        
        this.message = error.title;     
        this.popoverAnimation(true);
      }
    })
  }

  // COLLEGATO ALL'ngSwitch DEL PULSANTE LOGIN, PER FARLO DIVENTARE ROSSO
  redBtn(){
    return {
      'background-color':this.colorButton ? 'red' : '',
      'border-color':this.colorButton ? 'red' : ''}
  }

  // APRE IL POPOVER DEL PULSANTE LOGIN CHE CONTIENE L'ERRORE, IMPOSTA IL PULSANTE CON IL COLORE ROSSO, DELAY DI 2s, 
  // PULSANTE RITORNA NORMALE E CHIUDE IL POPOVER.
  popoverAnimation(redbutton: boolean){
    setTimeout(() => {
      this.myPopover.open();
    }, 0);     
    
    this.colorButton = redbutton;
    setTimeout(()=>{
      this.colorButton = !redbutton;
      this.myPopover.close();
    }, 1500)
  }

}
