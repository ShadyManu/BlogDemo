import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePostDTO } from 'src/dto/Post/CreatePostDTO';
import { PostService } from 'src/service/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  constructor(
    private postService: PostService,
    private form: FormBuilder,
    private route: Router
  ) {}

  postForm: FormGroup;
  createPost: CreatePostDTO;
  result: boolean = false;
  checkTitle: boolean = false;
  checkBody: boolean = false;
  checkForm: boolean = false;
  button: string = "Submit";
  errorMessage: string;
  showAlert: boolean = false;
  countCheck: number = 0;

  // NELL'INIZIALIZZAZIONE DEL COMPONENT SI INIZIALIZZA E COSTRUISCE IL FORM GROUP
  ngOnInit(): void {
    this.buildForm();
  }

  // INIZIALIZZA E COSTRUISCE IL FORM GROUP, AGGIUNGENDO I VALIDATORS REQUIRED E SOTTOSCRIVENDOSI AI CAMBIAMENTI DI
  // STATO, PER CONTROLLARE CHE TUTTO IL FORM E' VALIDO O MENO (PER BLOCCARE E SBLOCCARE IL PULSANTE DI SUBMIT)
  buildForm() {
    this.postForm = this.form.group({
      title: [, Validators.required],
      body: [, Validators.required],
    });
    this.postForm.statusChanges.subscribe(() => {
      if (this.postForm.get('title')?.valid) {
        this.checkTitle = true;
      } else {
        this.checkTitle = false;
      }
      if (this.postForm.get('body')?.valid) {
        this.checkBody = true;
      } else {
        this.checkBody = false;
      }
      if (this.checkTitle && this.checkBody) {
        this.checkForm = true;
      }
    });
  }

  // BLOCCA IL PULSANTE PER INVIARE PER EVITARE RICHIESTE MULTIPLE, PRENDE IL TITOLO ED IL BODY DAL FORM, CHIAMA IL 
  // SERVICE PER EFFETTUARE LA CHIAMATA POST AL BACKEND PER INSERIRE IL POST, SE TUTTO VA BENE LO RIPORTA INDIETRO
  // ALLA SCHERMATA DEI POSTS, ALTRIMENTI SE C'E' UN ERRORE APRE L'APP-ALERT PASSANDO IL MESSAGGIO DI ERRORE
  sendPost() {
      this.result = true;
    this.createPost = new CreatePostDTO(
      this.postForm.get('title')?.value,
      this.postForm.get('body')?.value
    );
    this.postService.createPost(this.createPost).subscribe((result) => {
      if (result.data != null) {
        this.button = "Post inserito correttamente";
        setTimeout(() => {
          this.route.navigateByUrl('Home/Posts');
          this.countCheck = 0;
          this.result = true;
        }, 1000);
      }
    }, (error) => {
      console.log(error);
      this.errorMessage = error.message;
      this.showAlert = true;
      setTimeout(()=>{
        this.showAlert = false;
      }, 3000)
    });
  }

  // FUNZIONE COLLEGATA AL PULSANTE INDIETRO CHE RIMANDA AI POSTS
  goBack(){
    this.route.navigateByUrl("Home/Posts");
  }

}
