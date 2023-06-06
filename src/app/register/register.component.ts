import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { RegisterDTO } from 'src/dto/Auth/RegisterDTO';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [NgbPopover]
})
export class RegisterComponent implements OnInit {
  @ViewChild('popOver') public myPopover: NgbPopover; // PRENDE IL PULSANTE CON IL POPOVER DAL DOM(DOCUMENT OBJECT MODEL)
  @Output() isRegistered = new EventEmitter<boolean>(); // MANDA L'EVENTO AL PADRE PER FAR TORNARE LA LOGIN VISIBILE

  // COSTRUTTORE PER LE DIPENDENZE
  constructor(private authService: AuthService, private form: FormBuilder) {  }

  registerForm: FormGroup; // FORM GROUP RELATIVO ALLA REGISTRAZIONE DI UN NUOVO UTENTE
  registerDTO: RegisterDTO; // DTO CHE ANDRA' NEL BACK CON I DATI DI REGISTRAZIONE
  checkUsername?: boolean = false; // CONTROLLO DEL VALIDATOR REQUIRED DELLO USERNAME NEL FORM GROUP
  checkPassword?: boolean = false; // CONTROLLO DEL VALIDATOR REQUIRED DELLA PASSWORD NEL FORM GROUP
  checkName?: boolean = false; // CONTROLLO DEL VALIDATOR REQUIRED DEL NOME NEL FORM GROUP 
  isRegisterValid: boolean = false; // CONTROLLO COMPLESSIVO DELLA VALIDITA' DEL FORM
  button: string = "Register"; // STRINGA CHE CAMBIA IN MODO DINAMICO UNA VOLTA CHE SI E' REGISTRATI CON SUCCESSO
  colorButton: boolean = false; // CONTROLLA SE FAR DIVENTARE IL PULSANTE ROSSO IN CASO DI ERRORE
  message: string | null = ''; // VARIABILE CHE CONTERRA' UN EVENTUALE MESSAGGIO DI ERRORE CHE RITORNA DAL BACKEND
  checkSendRegister: boolean = false; // DISABILITA IL PULSANTE APPENA SI CLICCA SU REGISTER PER EVITARE RICHIESTE MULTIPLE

  // NELL'INIZIALIZZAZIONE DEL COMPONENTE VA A CREARE IL FORM DI REGISTRAZIONE
  ngOnInit(): void {
    this.buildRegisterForm();
  }

  // CREA IL FORM DI REGISTRAZIONE CON I VALIDATORS REQUIRED
  buildRegisterForm(){
    this.registerForm = this.form.group({
      username: [, [Validators.required]],
      password: [, [Validators.required]],
      name: [, [Validators.required]]
    });

    this.registerForm.statusChanges.subscribe((status) => {      
      this.checkUsername = this.registerForm.get("username")?.valid;
      this.checkPassword = this.registerForm.get("password")?.valid;
      this.checkName = this.registerForm.get("name")?.valid;
      if(this.checkUsername && this.checkPassword && this.checkName){
        this.isRegisterValid = true;
      } else {
        this.isRegisterValid = false;
      }
    });
  }

  // COLLEGATO AL PULSANTE PER REGISTRARSI, DISABILITA IL PULSANTE PER EVITARE RICHIESTE MULTIPLE, CREA UN RegisterDTO
  // DA INVIARE AL BACKEND CON I DATI PRESI DAL FORM, CONTROLLA SE LA RISPOSTA E' POSITIVA O SE CI SONO ERRORI, POI
  // EMETTE L'EVENTO AL PARENT (LANDING-PAGE-COMPONENT) PER FAR RICOMPARIRE LA SCHERMATA DAL LOGIN
  register(){
    this.checkSendRegister = true;
    this.registerDTO = new RegisterDTO(
      this.registerForm.get("username")?.value, 
      this.registerForm.get("password")?.value, 
      this.registerForm.get("name")?.value)
    
    this.authService.register(this.registerDTO).subscribe(result => {
      if(result.data == true){
        this.message = "Registrazione avvenuta con successo";
        this.popoverAnimation(false);
        setTimeout(()=>{
          this.isRegistered.emit(true);
          this.checkSendRegister = false;
        }, 1000)
      }
    }, error =>{
      if(error.message){
        this.message = error.message;
        this.checkSendRegister = false;      
        this.popoverAnimation(true);
    } else if(error.title){
      this.message = error.title;    
      this.checkSendRegister = false;  
      this.popoverAnimation(true);
    }
  }) 
}

  // CAMBIA IL PULSANTE DELLA REGISTRAZIONE CON IL COLORE ROSSO SE C'E' QUALCHE ERRORE DAL BACKEND
  redBtn(){
    return {
      'background-color':this.colorButton ? 'red' : '',
      'border-color':this.colorButton ? 'red' : ''
    }
  }

  // ANIMAZIONE PER MOSTRARE O NON MOSTRARE IL POPOVER DAL PULSANTE REGISTRATI. SI ATTIVA SE C'E' UN ERRORE DAL
  // BACKEND, MOSTRANDO NEL POPOVER IL MESSAGGIO DI ERRORE
  popoverAnimation(redbutton: boolean){
    setTimeout(() => {
      this.myPopover.open();
    }, 0);     
    
    this.colorButton = redbutton;
    setTimeout(()=>{
      this.colorButton = !redbutton;
      this.myPopover.close();
    }, 1000
  )}

}
