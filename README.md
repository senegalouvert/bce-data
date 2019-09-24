BCE-DATA
========

Le BCE est le bureau d'appui a la creation d'entreprises du Senegal  
C'est une institution publique de l'etat du Senegal qui offre a tout  
entrepreneur un guichet unique pour l'accomplissement des formalites  
de creation d'entrepise [BCE](http://www.creationdentreprise.sn/).


## Deleloppeurs:

### Intallation :

* Dependence

    Install nodejs > [https://nodejs.org/](https://nodejs.org/en/download/)

Install packages

    npm install request cheerio async underscore

Clone the repo

    git clone https://github.com/aliounedia/bce-data.git
    
### Run :

Create a folder "datas"

    mkdir datas

Open The scripts/app.js and add the this lines:

    main = Scraper.Main()
    //main = Scraper.Detail()

save and run this scripts:

    cd  bce-data
    node scripts/app.js
 
ReOpen The app.js and replace line above with this lines:

    //main = Scraper.Main()
    main = Scraper.Detail()

save and run this scripts:
 
    cd  bce-data
    node scripts/app.js

To scraping more then 10 page change the conf.js file 

    //nb_rows    : 1653,
    //For test
     nb_rows      : 10,



   

