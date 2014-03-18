var request = require("request")
   ,cheerio = require("cheerio")
   ,fs      = require("fs")
   ,async   = require("async")
   ,_       = require("underscore")
var config  ={
   nb_row    : 794
   //For test
   //nb_row      : 7
   ,base_url : '\
http://www.creationdentreprise.sn/rechercher-une-societe?\
field_rc_societe_value=&field_ninea_societe_value=&\
denomination=&field_localite_nid=All&field_siege_societe_value=\
&field_forme_juriduqe_nid=All&field_secteur_nid=\
All&field_date_crea_societe_value=&page='
   ,base_site: "http://www.creationdentreprise.sn"
}

//scrapper main
function scraper(){
  var rows  = config.nb_row 
    ,urls = [];
  while(rows--){
    urls.push(config.base_url + rows)
  }
  //End building urls
  async.mapSeries(urls,
    makeRequest,
    handleResponses
  )  
}


//Handle response
function handleResponses(err, results){
  data  =[]
  _.each(results,function(result){
    var parse = parseBody(result)
    data.push(parse)
  })
  console.log(data)
  writeFile(data)
}


//Make request
function makeRequest(url,cb){
  console.log('my url ' + url)
  request(url,encoding="latin-1",function(err,res, body){
    if(err){
       cb(null,err)
    }else {
       cb(null,body)
    }
  })
}
//store into file
function writeFile(data){
  fs.appendFile('datas/link.json',data.join("\n"), function(err){
    if(err){
       throw err; return;
    };
    console.log("data was wrote into tmp file")
  });
}

// parse body 
function parseBody(body){
  $ = cheerio.load(body)
  var rows= []
  console.log($("div").html())
  $("div .views-table tr").each(function(idx, html){
    var row =[]
    $(this).find("td").each(function(idx , e){
       var raw = getContent(e)
       raw     = _.unescape(new String(raw)
                           .trim()
                           .replace(/\n/g, "")
                           .replace(/,/g," "))	  
       row.push(raw)
    })
    rows.push(row.join(','))
  })
  return rows.join('\n')
}

//Get content of cell/td 
function getContent(e){
  //content 
  var  rx  = /<a[^>]*>([^<]+)<\/a>/
      ,rx2 = /<span[^>]*>([^<]+)<\/span>/
      ,rx3 = /Voir/;

  //check html with regex
  if(rx3.test($(e).html())){
      return config.base_site + $(e).find("a").attr("href")
  }else if(rx.test($(e).html())){
      return $(e).html().match(rx)[1]
  }else if(rx2.test($(e).html())){
      return $(e).html().match(rx2)[1]
  }else{
      return $(e).html()
  }
}
//Fire
scraper()
