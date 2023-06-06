import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from 'src/service/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { BlogHomeComponent } from './blog-home/blog-home.component';
import { HeaderComponent } from './header/header.component';
import { AvatarComponent } from './avatar/avatar.component';
import { PostsComponent } from './posts/posts.component';
import { TokenInterceptorService } from 'src/security/token-interceptor.service';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { SinglePostComponent } from './posts/single-post/single-post.component';
import { CommentComponent } from './posts/comment/comment.component';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { CookieService } from 'ngx-cookie-service';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LandingPageComponent,
    LoginComponent,
    BlogHomeComponent,
    HeaderComponent,
    AvatarComponent,
    PostsComponent,
    CreatePostComponent,
    SinglePostComponent,
    CommentComponent,
    AlertMessageComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgxSkeletonLoaderModule,
    NgbAlertModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/dist/front-end-blog-demo'},
    AuthService,
    CookieService,
    {provide:HTTP_INTERCEPTORS, useClass:TokenInterceptorService, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
