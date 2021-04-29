BCE-DATA
========

Le BCE est le bureau d'appui à la création d'entreprises du Sénégal. C'est une institution publique de l'état du Sénégal qui offre a tout. Entrepreneur un guichet unique pour l'accomplissement des formalités de création d'entreprise BCE. [BCE](http://www.creationdentreprise.sn/).

## [Données](data)

[19051 Entreprises](data/link.json)

[17626 Détails Entreprises](data/data.csv)

* Denonimation
* Date creation
* Ninéa
* Registre de commerce
* url
* Siège social
* Localité
* Secteur d activite
* Forme juridique
* Objet social
* Capital

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

    mkdir data

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

    //nb_rows    : 19051,
    //For test
     nb_rows      : 10,
