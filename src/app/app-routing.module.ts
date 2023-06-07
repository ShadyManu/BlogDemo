import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/security/auth.guard';
import { AppComponent } from './app.component';
import { BlogHomeComponent } from './blog-home/blog-home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { PostsComponent } from './posts/posts.component';
import { SinglePostComponent } from './posts/single-post/single-post.component';

// GESTIONE DELLE ROUTES DELL'APLICATIVO. HOME E' LA HOMEPAGE, ED HA I SUOI CHILD (PROTETTI DALL'AUTH GUARD)
const routes: Routes = [
  { path: 'Login', component: LandingPageComponent},
  { path: '', component: AppComponent},
  { path: 'Home', component: BlogHomeComponent, canActivate:[AuthGuard],
  children:[
    { path: '', component: BlogHomeComponent},
    { path: "Posts", component: PostsComponent},
    { path: 'NewPost', component: CreatePostComponent},
    { path: 'Post/:id', component: SinglePostComponent}
]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
