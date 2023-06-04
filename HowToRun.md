# Come testare il progetto
Per poter far funzionare il progetto, abbiamo tre approcci: Visual Studio (Code), Docker, Docker-Compose; consiglio di gran lunga il terzo metodo con docker-compose, poichè praticamente quasi tutto automatizzato e pre-impostato.

# Visual Studio / Visual Studio Code
Aprite Visual Studio Code, e clonate la repository (ci sono tre rami in questa repository: il **main** che contiene solamente i READ-ME e docker-compose, **BackEnd** che contiene il progetto in dotNET 6, **FrontEnd** che contiene il progetto in Angular 16). Potete clonarlo a vosto piacimento (Fork, tramite GitHub Desktop, tramite console, tramite VSC e Version Control, scaricando i due progetti da GitHub e aprendoli con l'IDE);
- Per avviare il BackEnd, vi basterà avere il progetto aperto con Visual Studio Code, posizionarvi con il terminale integrato dentro il Blog.ApiLayer, e digitare:
**dotnet watch run**
Vi scaricherà le dipendenze e, una volta runnato, vi aprirà il sito: https://localhost:7184/swagger/index.html . Da questo sito potete anche testare le APIs individualmente, ricordando che tutte gli endpoints (escluso login e registrazione) sono protetti e serve il Bearer token. Quindi la procedura è prima usare l'API della registrazione, poi eseguire il login, che restituisce il Bearer token nella ServiceResponse.Data, copiare la risposta (incluso di Bearer ...), cliccare su Authorize all'interno di swagger, incollare il Bearer token, e adesso si avrà accesso alle altre API.
- Per quanto riguarda il FrontEnd, similmente clonate la repository sul vostro pc con il metodo che preferite, aprite Visual Studio Code e da terminale digitate:
**npm install**
Ci metterà anche uno o due minuti, perchè vi installerà tutte le dipendenze (vedrete crere la cartella node_modules) che servono per far funzionare il progetto. Fatto ciò, potete digitare, sempre da terminale:
**ng serve -o**
Appena finito, vi aprirà automaticamente il browser (grazie al comando -o) all'indirizzo: http://localhost:4200/Login , e da quì avverrà il vero e proprio testing del sito.

# Docker
Se non avete già Docker Desktop installato sul vostro pc, ecco una mini guida su come fare (dovete anche registrarvi al loro sito DockerHub):
- Installare Docker Desktop dal loro sito ufficiale;
- Installare WSL2 Linux Kernel Update package e riavviare Windows (questo perchè la versione gratuita utilizza Linux, e molto probabilmente dovrete installare questo file);
- Pullare i due progetti dal terminale Visual Studio Code dalla mia repository ( https://hub.docker.com/u/shadymanu ), avendo Docker Desktop avviato: 
  docker pull shadymanu/backend-blogdemo 
  docker pull shadymanu/frontend-blogdemo
- Con DockerDesktop avviato, sempre da terminale di VSC, eseguite questi comandi (Assicurandovi di avere la porta 8080 e 4200 del vostro pc **libera** e non in uso):
  docker run -p 8080:80 -d shadymanu/backend-blogdemo
  docker run -p 4200:80 -d shadymanu/frontend-blogdemo
Le porte sono obbligatoriamente queste due (4200 e 8080), poichè le api all'interno del Front-End chiamano localhost:8080 per le chiamate del backend.
In questo modo, abbiamo prima preso l'immagine dei due progetti con il pull, dopodichè abbiamo runnato un contenitore per il backend (la porta del proprio pc 8080, nel container 80) ed uno per il frontend (porta del proprio pc 4200, nel suo contenitore 80). Potete vedere anche le informazioni dei due container runnati con il comando:
**docker ps**
Oppure semplicemente da Docker Desktop, sotto la voce: Containers.
A questo punto, non vi resta che andare su localhost:4200, ed è già tutto configurato. Il Frontend ascolta sulla porta 4200 del vostro pc, mentre il backend su quella 8080.

# Docker-compose
