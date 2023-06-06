import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommentDTO } from 'src/dto/Comment/CommentDTO';
import { CreateCommentDTO } from 'src/dto/Comment/CreateCommentDTO';
import { PostDTO } from 'src/dto/Post/PostDTO';
import { CommentService } from 'src/service/comment.service';
import { PostService } from 'src/service/post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
  providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class SinglePostComponent implements OnInit {
  @ViewChild("content") modal: NgbActiveModal; // PRENDE LA MODAL DAL DOM(DOCUMENT OBJECT MODEL)

  // COSTRUTTORE PER LE DIPENDENZE
  constructor(
    private postService: PostService, 
    private commentService: CommentService, 
    private route: Router,
    private navigation: ActivatedRoute,
    config: NgbModalConfig, 
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private form: FormBuilder)
    {
      config.backdrop = 'static';
      config.keyboard = false;
      config.centered = true;
      config.size = "lg";
    }
  
  post?: PostDTO; // POST CHE VIENE LETTO DAL DATABASE
  postId: number; // ID DEL POST LETTO DAL DB
  comments: CommentDTO[] = []; // COMMENTI LETTI DAL DATABASE
  commentToSend: CreateCommentDTO; // COMMENTO CHE VERRA' CREATO DAL FORM DENTRO LA MODALE DELL'INSERIMENTO DI UN NUOVO COMMENTO
  commentForm: FormGroup; // FORM GROUP DEL NUOVO COMMENTO
  checkForm: boolean = false; // CONTROLLA SE IL FORM DEL COMMENTO SODDISFA I VALIDATORS OPPURE NO
  result: string = "Send"; // STRINGA COLLEGATA AL PULSANTE DENTRO LA MODALE PER INVIARE UN NUOVO COMMENTO
  loader: boolean = true; // VARIABILE BOOLEANA COLLEGATA AL CARICAMENTO DELLO SKELETON PATTERN
  errorMessage: string = ''; // SE UNA CHIAMATA AL BACK VA IN ERRORE, SALVA IL MESSAGGIO DI ERRORE IN QUESTA VARIABILE
  showAlert: boolean = false; // VRIABILE BOOLEANA CHE MOSTRA O MENO L'ALERT CON IL MESSAGGIO DI ERRORE
  numComments: string = "Comments"; // VARIABILE STRINGA CHE CAMBIA IN BASE A QUANTI COMMENTI CI SONO NEL POST
  name: string; // NOME DELL'AUTORE DEL POST CHE VERRA' PASSATO ALL'APP-AVATAR PER CREARE L'IMMAGINE CON LE INIZIALI
  checkSendButton: boolean = false; // DISABILITA IL PULSANTE PER INVIARE IL COMMENTO PER EVITARE RICHIESTE MULTIPLE

  // PRENDE L'ID DEL POST DA LEGGERE DALLA ROUTE (CHE E' STATO INSERITO NELLA PAGINA PRECEDENTE), QUINDI CHIAMA IL 
  // BACKEND PER LEGGERE IL POST TRAMITE L'ID E TUTTI I COMMENTI FILTRATI PER L'ID DEL POST
  ngOnInit() {
    this.navigation.params.subscribe(params => {
      this.postId = params['id'];
    });

    this.postService.getPostById(this.postId).subscribe(result => {     
      if(result.data != null){
        this.post = result.data;
        this.name = result.data.author;
      }
    })

    this.commentService.getCommentsByPost(this.postId).subscribe(result => {      
      if(result.data != null){
        this.comments = result.data;
        this.countComments();    
        this.loader = false;
      } else {
        this.loader = false;
        this.numComments = "0 Comments"
      }
    }, (error) => {
      this.loader = false;
      this.errorMessage = error.message;
      this.showAlert = true;
    })
    this.createForm();
  }

  // COLLEGATO AL PULSANTE PER INVIARE UN NUOVO COMMENTO
  sendComment(){
    this.checkSendButton = true;
    this.commentToSend = new CreateCommentDTO(this.postId, this.commentForm.get("comment")?.value);
    this.commentService.createComment(this.commentToSend).subscribe(result => {
      if(result.data != null){
        this.comments?.unshift(result.data);
        this.countComments();
        this.result = "Commento inserito correttamente!";
        setTimeout(()=>{
          this.closeModal();
          this.checkSendButton = false;
          this.result = "Send";
          this.commentForm.get("comment")?.reset();
        }, 1000)
      }
    })
  }

  // COLLEGATO ALL'IMMAGINA BACK PER ANDARE UNA PAGINA INDIETRO 
  goBack(){
    this.route.navigateByUrl("Home/Posts");
  }

  // COLLEGATO AL PULSANTE PER INSERIRE UN NUOVO COMMENTO, APRE LA MODAL CON IL RELATIVO FORM
  openModal(content: any) {
		this.modalService.open(content);
	}

  // CHIUDE LA MODAL DELL'INSERIMENTO DI UN NUOVO COMMENTO
  closeModal(){    
    this.modalService.dismissAll();
  }

  // CREA IL FORM GROUP DELL'INSERIMENTO DEL NUOVO COMMENTO CON IL VALIDATOR REQUIRED, E SI SOTTOSCRIVE 
  // AI CAMBIAMENTI DI STATO PER VEDERE SE SODDSIFA IL VALIDATOR O MENO
  createForm(){
    this.commentForm = this.form.group({
      comment: ['', Validators.required]
    })
    this.checkFormStatus();
  }

  // SI SOTTOSCRIVE AI CAMBIAMENTI DI STATO DEL FORM DEL COMMENTO, PER CONTROLLARE LA SUA VALIDITA'
  checkFormStatus(){
    this.commentForm.statusChanges.subscribe(() => {
      if(this.commentForm.get("comment")!.valid){
        this.checkForm = true;
      } else {
        this.checkForm = false;
      }      
    })
  }

  // CONTA QUANTI COMMENTI CI SONO, TRASFORMANDO IL VALORE IN STRING, MOSTRARE DINAMICAMENTE QUANTI COMMENTI CI SONO
  countComments(){
    this.numComments = this.comments.length.toString() + " Comments";
  }

}
