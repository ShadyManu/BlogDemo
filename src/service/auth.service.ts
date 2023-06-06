import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDTO } from 'src/dto/Auth/LoginDTO';
import { RegisterDTO } from 'src/dto/Auth/RegisterDTO';
import { Observable } from 'rxjs';
import { ServiceResponse } from 'src/dto/ServiceResponse';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookie: CookieService) {
  }

  type: string = 'api/Auth';
  rememberMe: boolean;
  isLogged: boolean;

  register(registerDTO: RegisterDTO): Observable<ServiceResponse<boolean>> {
    return this.http.post<ServiceResponse<boolean>>(environment.APIEndpoint + this.type + '/Register', registerDTO);
  }

  login(loginDTO: LoginDTO): Observable<ServiceResponse<string>> {
    return this.http.post<ServiceResponse<string>>(environment.APIEndpoint + this.type + "/Login", loginDTO);
  }

  // ALL'AVVIO DI APP-COMPONENT, SETTA LA VARAIBILE rememberMe IN BASE ALLA PRESENZA DEL TOKEN NEI COOKIE O MENO
  setRememberMe(){
    if(this.cookie.get("token")) this.rememberMe = true;
    else this.rememberMe = false;
  }

  // RITORNA LA VARIABILE rememberMe, PER CONTROLLARE SE L'UTENTE HA DECISO DI SALVARE I COOKIES
  isLoggedIn(): boolean{
    if(this.rememberMe) return true;
    else return false;
  }

  // PRENDE IL TOKEN DAI COOKIE
  getToken(): string{
    return this.cookie.get("token") || '';
  }

}
