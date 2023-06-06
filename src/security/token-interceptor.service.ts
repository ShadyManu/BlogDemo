import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { AuthService } from 'src/service/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private inject: Injector, private router: Router) { }

  // INTERCEPTOR DI TUTTE LE RICHIESTE CHE INVIA E LE RESPONSE CHE TORNANO DAL BACKEND
  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
    let authService = this.inject.get(AuthService);
    // SETTA IL TOKEN NELL'HEADER DELLA RICHIESTA DA INVIARE AL BACK
    let token = req.clone({
      setHeaders: {
        Authorization: authService.getToken()
      }
    });

    return next.handle(token).pipe(
      // CATTURA GLI ERRORI CHE PROVENGONO DALLA RESPONSE DEL BACK
      catchError((error: HttpErrorResponse) => {

        // QUI CONTROLLA I VARI STATUS ERROR CHE POSSONO RITORNARE, FACENDO TORNARE LA RESPONSE DEL BACK CHE AL SUO
        // INTERNO CONTERRA' ANCHE IL MESSAGGIO DI ERRORE
        if(error.status == 0){
          return throwError(error);
        }

        if(error.status >= 300){
          return throwError(error.error);
        }

        return throwError(error.error);
      })
    );
  }

}
