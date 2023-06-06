export class RegisterDTO{
    username: string;
    password: string;
    authorName: string;

    constructor(username: string, password: string, authorName: string){
        this.username = username;
        this.password = password;
        this.authorName = authorName;
       }
}