import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/dto/Post/PostDTO';
import { PostService } from 'src/service/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  
  constructor(private postService: PostService, private route: Router) {}

  posts: PostDTO[] = []; // VARIABILE CHE CONTERRA' TUTTI I POST CHE RITORNANO DAL BACK
  pages: number[] = []; // ARRAY PER CALCOLARE QUANTE PAGINE DEVONO ESSERE GENERATE (DIPENDE DA itemsPerPage)
  switchIndex: number = 1; // INDEX INIZIALE DELL'IMPAGINAZIONE
  itemsPerPage: number = 6; // POSTS VISUALIZZATI PER OGNI PAGINA
  loader = true; // VARIABILE BOOLEANA COLLEGATA AL CARICAMENTO DELLO SKELETON PATTERN
  totalCountSkeleton = 6; // NUMERO DI POST DEL LOADER SKELETON DA CREARE
  errorMessage: string; // STRINGA CHE SALVA IL MESSAGGIO DI UN EVENTUALE ERRORE CHE ARRIVA DAL BACKEND
  showAlert: boolean = false; // VARIABILE BOOLEANA CHE MOSTRA O MENO L'ALERT CONTENENTE IL MESSAGGIO DI ERRORE DAL BACK

  // NELL'INIZIALIZZAZIONE DEL COMPONENTE, VA A LEGGERE DAL BACK TUTTI I POST PRESENTI, IN PIU CREA UN ARRAY DI NUMERI
  // CON UN CICLO FOR LA CUI LUNGHEZZA è this.itemsPerPage, OSSIA QUANTI POST SI VOGLIONO VISUALIZZARE PER OGNI PAGINA 
  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(result => {      
      if(result.data != null){
        this.posts = result.data.reverse();
        this.loader = false;
        for(let i=0; i < result.data.length; i += this.itemsPerPage){
          this.pages.push(i);
        };
      }
    }, error => {
      this.showAlert = true;
      this.errorMessage = error.message;
    })
  }

  // RIMANDA AL COMPONENT 'create-post' PER CREARE UN NUOVO POST
  createPost(){
    this.route.navigate(["Home/NewPost"]);
  }

  // COLLEGATO ALL'IMPAGINAZIONE, CAMBIA IL NUMERO DELLA PAGINA IN CUI CI SI TROVA
  setPage(i: number){
    this.switchIndex = i;
  }

  // RIMANDA AL COMPONENT 'single-post' PER VISUALIZZARE UN DETERMINATO ARTICOLO, PASSANDO L'ID NEL PATH/ROUTE
  openPost(postId: number){
    this.route.navigate(["Home/Post/" + postId])
  }

}
