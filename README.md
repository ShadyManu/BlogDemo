# BlogDemo
BlogDemo è una web-app sviluppata con dotNET 6 (BackEnd) ed Angular 16 (FrontEnd). Il database, per semplicità di prova, è quello SQL InMemory di dotNET. La web app permette a qualsiasi utente di registrarsi alla piattaforma, effettuare il login (scegliendo anche se rimanere collegato), creare un nuovo Post, commentare un Post e visualizzare Post scritti da altri con tutti i relativi commenti.

# Database
Il database SQL è stato creato con Entity Framework, personalizzando le caratteristiche delle varie entità utilizzando l'approccio Code-First, ossia creando il Database partendo dal codice. Entity Framework mette a disposizione il 'model Builder' per poter utilizzare un set di regole per customizzare l'entità. Andando nel Blog.DataAccessLayer e in Database, troviamo la classe DataContextc (che estende DbContext). Qui dentro notiamo le entità che sono state mappate (tre: User, Post e Comment) e l'override del metodo OnModelCreating(), che ci consente di personalizzare ogni entità a nostro piacimento. Non sono stati usate usate di proposito le annotazioni sopra le Entità, poichè ritengo l'approccio del OnModelCreating() molto più flessibile. 
Panoramica del Database:
Abbiamo lo **User** con:
- Id (Primary Key ed auto increment)
- Username
- PasswordHash
- PasswordSalt
- AuthorName

**Post** :
- Id (Primary Key ed auto increment)
- User (Foreign Key con relazione One To Many, poichè un record di Post può essere associato ad un solo User ma un record di User può essere associato a più record di Post, che punta all'Id dello User, che verrà utilizzato per collegare il Post a chi lo ha scritto)
- Title
- Body

**Comment**
- Id (Primary Key ed auto increment)
- Post (Foreign Key con relazione One To Many, poichè un record di Comment può essere associato ad un solo Post ma un record di Post può essere associato a più Comment, che punta all'Id del Post)
- User (Foreign Key anche quì con relazione One To Many, che punta all'Id dello User, che verrà utilizzato per collegare il commento a chi lo ha scritto)

# Back-End
Per quanto riguarda il Back End, come anticipato, è stato utilizzato dotNET 6 con linguaggio C#. È stata utilizzata un'architettura REST per gestire le chiamate Http tra BackEnd e FrontEnd, sfruttando quindi le chiamate :

- POST: Register, Login, CreateComment, CreatePost
- GET: GetCommentsByPost/{postId}, GetAllPosts, GetPost/{id}, GetUser

Le risposte al FrontEnd, arrivano come ServiceResponse<T>, che utilizza i generics per adattarsi dinamicamente. La ServiceResponse è una classe da me creata (che si trova nei DTO), che al suo interno ha tre attributi: 
- Data di tipo generic <T>, che conterrà qualsiasi dato da restituire al Front End;
- StatusCode di tipo HttpStatusCode, che verrà settato con il relativo StatusCode: di default è impostato su Ok (200), ma nei Service verrà modellato a seconda delle necessità. Esempio, se si incontra un errore con il database, verrà settato su InternalServerError (500), se si crea una risorsa a buon fine su Created (201), se si prova ad inserire qualcosa che è gia presente Conflict (409) etc etc
- Message di tipo string, che contiene un eventuale messaggio di errore da comunicare al FrontEnd. In genere viene utilizzato in combinazione con lo StatusCode, per descrivere più nel dettaglio dove c'è stato il problema. Viene settato da me manualmente, se so a priori cosa è andato storto, mentre è utilizzato insieme al try{} catch{}, inserendo il messaggio dell'errore catturato a Runtime.

Tutte le chiamate (eccetto la registrazione ed il login), sono protette dall'autenticazione JWT Bearer. All'interno della JWT, settiamo alcuni claim che ci tornano utili all'interno del codice, come l'ID appartentente alla persona che ha generato il token (quindi a chi si è loggato) ed il suo Username. Il Service dedicato alla gestione dell'autenticazione è l'AuthService. In linea generale funziona così: 
chi si registra, la sua password viene inserita nel database hashata con crittografia HMACSHA512, inserendo anche un PasswordSalt che viene generato ogni volta che viene istanziata la classe *new System.Security.Cryptography.HMACSHA512()*. Dopodichè, effettua il login (quindi avviene la decodifica della password), e viene generato un nuovo Token, contenente appunto i due claim ID e Username, con la scadenza di 30 giorni. La signatura è fatta con l'algoritmo HmacSha512, ed in più contiene un secret, che è presente nell'ApiLayer dentro le appsettings.json, sotto la voce "TokenKey". Ogni chiamata che arriva ai controller (escluse appunto login e registrazione che devono essere libere, poichè il token non è stato ancora generato) eseguirà il controllo della validità del token: se è valido, verrà concesso l'utilizzo delle API, altrimenti tornerà un HttpStatus FORBIDDEN.

La struttura del BackEnd segue il pattern della Onion Architecture di ASP.NET, ossia stratificato in layer, in questo caso in 3 layers. L'idea è quella di separare la logica di business, le API e le Entities. Difatti, i tre layers sono:
- **ApiLayer**, dove parte l'applicativo, che contiene le appsettings.json, il Program.cs contenente le varie configurazioni, ed i Controller, dove quindi arrivano in ingresso le chiamate dal Front-End. Questo layer può vedere solamente il layer dedicato alla logica di business, e nient'altro.
- **BusinessLayer**, dedicato appunto alla logica di business. Questo è il layer dove utilizziamo i DTO, ossia i Data Transfer Objects. Essi non sono nient'altro che una mappatura delle Entità, che servono a trasportare dati alla View. Si differenziano dalle Entità perchè in essi, mettiamo solamente i dati che ci servono. In questo layer troviamo anche il Mapper, che ci permette appunto di convertire i DTO in Entities e vice-versa. Inoltre troviamo anche i Service (organizzati secondo la concezione del codice mantenibile). Ogni service ha una sua interfaccia, che esplicita che metodi troveremo all'interno. Il service vero e proprio deve implementare tale interfaccia e descrivere il body di ogni metodo. Essi sono configurati con ciclo di vita Scoped (per la dependency injection) nel Program.cs (che si trova nell'ApiLayer). Esso può vedere solamente il layer successivo (quello dedicato al Database), e non vede quello precedentemente descritto (ApiLayer).
- **DataAccessLayer**, layer dedicato alla comunicazione con il Database. Non cè molto da dire, poichè implicitamente è stato spiegato il suo funzionamento già nell'introduzione al Database. C'è da aggiungere che al suo interno troviamo le Entities, che sono praticamente la trasposizione di ciò che troviamo nel database. Questo layer, seguendo sempre i principi della Onion Architecture, non vede nessun altro layer: nessuno dei due precedenti, ed è l'ultimo layer del nostro applicativo.

Il tutto è contenuto nel file soluzione del progetto (BackEnd-BlogDemo.sln), che si trova al di fuori di queste tre cartelle. Inoltre, sempre qui troviamo il Dockerfile, per poter dockerizzare il nostro Backend, ma ne parleremo in modo più approfondito nel prossimo READ-ME-HowToRun, riguardante le indicazioni sui diversi modi per provare e runnare l'applicativo nel suo intero.
All'interno del codice, in ogni classe usata, ci saranno commenti su ogni metodo a spiegare il funzionamento del tale.
  
# FrontEnd
Per quanto riguarda il Front-End, è stato utilizzato il framework Angular 16 (ultima versione) della Google. In aggiunta, è stato utilizzata la libreria di Bootstrap ottimizzata per Angular: ng-bootstrap per poter ottimizzare al meglio il sito sia per desktop che per mobile, rendendolo responsive.
  
La schermata iniziale ti porta in una pagina dove puoi decidere (con i due pulsanti in alto) se scrivere nel Form del Login oppure se registrarti al sito. La registrazione chiede tre parametri obbligatori: Username, Password e Nome. Lo username e la password verranno usati nel Login, mentre il Nome (che può contenere anche più di un nome, ad esempio Nome e Cognome) verrà utilizzato all'interno dell'applicativo per generare un avatar con le proprie iniziali e per mostrare chi ha scritto il post e/o chi ha inserito il commento (evitando di mostrare lo username, che è un dato sensibile).
Nel login, oltre allo username e password (chiaramente obbligatori da inserire, altrimenti il bottone del Login non si sbloccherà), si può scegliere in modo arbitrario se scegliere di essere ricordati, tramite la checkbox: se la si sceglierà, verrà salvato il token generato nei cookies, con una data di scadenza nello storage di 30 giorni (compatibili con la durata del token nel backend). Questo significa che qualvolta si aprirà nuovamente il sito, si entrerà direttamente dentro, senza dover rifare il login. Se non lo si sceglie, il token verrà comunque salvato nei Cookie del browser, ma con una durata di sessione. Questo significa che se si chiude il browser, terminando quindi la sessione, e si riapre il sito, bisognerà rifare il login.
Una volta entrati, ci sarà la Home, che altro non è un insieme di Posts scritti dagli utenti. Viene visualizzato l'avatar con le iniziali del Nome con cui ci si è registrati (è stato creato un component apposta per poterlo riutilizzare in più parti del codice semplicemente richiamandolo con il suo selettore), il titolo, chi lo ha scritto ed una riga anteprima del post. Sotto, c'e l'impaginazione. A prescindere dal device, verranno visualizzati solamente 6 anteprime per pagina. Quindi, se ci sono più di sei post, si potrà scorrere e vedere i post più vecchi. Quelli più nuovi, vengono mostrati nella prima pagina. In alto a destra, c'è un pulsante per creare un nuovo Post. Quindi, si potrà scegliere il titolo ed il body del Post stesso. Tornando indietro, cliccando sulla freccia, lo troveremo in prima pagina, come ultimo post creato. Sempre da quì, si può cliccare su ognuno dei Post disponibili, per entrare e leggere i suoi dettagli. Al suo interno, troveremo tutto il body per esteso, e sotto troveremo la sezione commenti, fatti come uno slider orizzontale. In più c'è il pulsante per aggiungere un nuovo commento. Cliccando su di esso, si apre una modale che ti permette di inserire un nuovo commento (che verrà inserito come ultimo commento e più visibile nella sezione apposita).
Infine, l'header sopra, mostra il pulsante per il logout (che cancellerà il token dai cookies, anche se si era selezionata la checkbox per rimanere collegati), il tuo nome e l'avatar con le tue iniziali.
  
Di seguito, alcune caratteristiche dell'applicativo:
- I form sono stati gestiti come FormGroup, con al uso interno FormControl. Essi hanno la funzionalità di poter aggiungere i Validators di Angular (Required, MinLength, Email, etc), e ci si può sottoscrivere ad essi per vedere se il form è valido o meno;
- Nella pagina dei Posts e in quella del singolo post, è stato aggiunto lo Skeleton Loader, per mostrare un'anteprima 'scheletro' prima di ricevere i dati dal Back (due tipi diversi: quello dei post e quello che simula i commenti presenti nell'articolo);
- Ogni form che ha un pulsante per inviare dati al back, è protetto e si disattiva nello stesso istante in cui ci si clicca sopra, per evitare richieste multiple;
- E' stato usato ovunque il display: flex di CSS, per poter organizzare il layout, in combinazione con ng-bootstrap;
- Lo skeleton loader è stato creato dalla libreria ngx-skeleton-loader;
- Il pattern è MVVM (Model View View-Model). Ci sono quindi i Services che chiamano il backend, i DTOs che contengono i dati, ed il View-Model è la parte Typescript-HTML-CSS dei componenti Angular;
- Per quanto riguarda l'autorizzazione e la gestione degli errori, è stato introdotto l' Interceptor (che si trova nella cartella security): quì verrà intercettata ogni richiesta in uscita ed ogni risposta in entrata. Per le richieste in uscita, viene preso il token dai cookies ed  inserito nell'header della request (così da abilitare le API del backend), mentre per quanto riguarda le response, controlla l'HttpStatus: se è 0, c'è probabilmente un errore del client stesso, se è maggiore o uguale di 300, si ritorna ai component la Response del back, al cui interno contiene il Message dell'errore. Ogni component, nel Typescript, quando esegue la chiamata asincrona, è adibito a ricevere un eventuale callback di errore. Ho creato il component alert-message che viene richiamato per mostrare un banner nella parte inferiore dello schermo, che mostra il messaggio di errore;
- È stato aggiunto il routing di Angular, nell'app-routing-module, dove si gestiscono le routes e viene rimandado alle componenti. C'è anche l'AuthGuard, che controlla se si ha accesso o meno a quelle routes. Ricordo che Angular crea SPA (Single Page Applications), quindi non sono vere e proprie ricaricamenti di pagina, ma una parvenza di routing, poichè le Single Page Applications modificano il DOM (Document Object Model) per mostrare o meno i components;
- Sono stati passati dati dove necessario da padre a figlio e viceversa con Input() e Output();
- Il blog-home-component è come se fosse un layout: al suo interno viene richiamato l'header, e sotto il router-outlet per consentire la navigazione;
- Concetto simile con il landing-page component, che al suo interno mostra o meno il component login o quello register;
- Sono state usate le direttive di angular, come ad esempio ngClass nel create-post.component, ngStyle nel login.component e register.component, ngFor in posts.component (due volte) e in single-post.component (due volte);
- Gli errori nella registrazione e nel login, sono stati realizzati in modo diverso: apparirà un popover sopra il pulsante (o del login o registrati) con al suo interno scritto il messaggio di errore che è tornato dal backend;
- Anche quì c'è il Dockerfile, per poter dockerizzare l'applicativo, ma anche in questo caso verrà approfondito nell'altro READ-ME.
  
Questa è stata un'introduzione dettagliata al progetto, sviluppato completamente da solo. 
Per informazioni o contatti, potete contattarmi nei seguenti recapiti:
Email: manuelraso1994@gmail.com
Linkedin: https://www.linkedin.com/in/manuel-raso/

Questa è la mia repository di Dockerhub: https://hub.docker.com/u/shadymanu
