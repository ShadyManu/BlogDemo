import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostDTO } from 'src/dto/Post/PostDTO';
import { TokenInterceptorService } from 'src/security/token-interceptor.service';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-blog-home',
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.css'],
  providers:[TokenInterceptorService]
})
export class BlogHomeComponent implements OnInit {

  constructor(private route: Router, private authService: AuthService) {}

  // CONTROLLA SE L'UTENTE E' LOGGATO TRAMITE L'AUTH SERVICE: SE SI LO RIMANDA AI POST, ALTRIMENTO LO RIMANDA AL LOGIN
  ngOnInit(): void {
    if (this.authService.isLoggedIn() != null) {
      this.route.navigateByUrl('Home/Posts');
    } else {
      this.route.navigateByUrl('');
    }
  }

}