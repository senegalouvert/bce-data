var request = require("request")
    ,cheerio = require("cheerio")
    ,fs      = require("fs")
    ,async   = require("async")
    ,_       = require("underscore")
var config  ={
   nb_row    : 794
  ,base_url : '\
http://www.creationdentreprise.sn/rechercher-une-societe?\
field_rc_societe_value=&field_ninea_societe_value=&\
denomination=&field_localite_nid=All&field_siege_societe_value=\
&field_forme_juriduqe_nid=All&field_secteur_nid=\
All&field_date_crea_societe_value=&page='
 ,base_site: "http://www.creationdentreprise.sn"
}
//content 
var  rx  = /<a[^>]*>([^<]+)<\/a>/
    ,rx2 = /<span[^>]*>([^<]+)<\/span>/
    ,rx3 = /Voir/
    ;
//scrapper main
function scraper_main(){
   var rows  = config.nb_row 
      ,urls = [];
   while(rows--){
     urls.push(config.base_url + rows)
   }
   //End building urls
   async.mapSeries(urls,function(url, cb){
     request(url,function(err,res, body){
       if(err){
         cb(null,err)
       } else {
         cb(null,body)
       }
     })
    },
    function(err, results){
      data  =[]
      _.each(results,function(result){
        data.push(parseBody(result))
      })
      console.log(data)
      store_main(data)
    }
   )  
}
//store into file
function store_main(parsed_data){
  fs.appendFile('datas/link.json',parsed_data.join("\n"), function(err){
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
    $(this).find("td").each(function(idx , html){
      if(rx3.test($(this).html())){
	  raw = config.base_site + $(this).find("a").attr("href")
      }else if(rx.test($(this).html())){
	  raw = $(this).html().match(rx)[1]
	}else if(rx2.test($(this).html())){
	  raw = $(this).html().match(rx2)[1]
	}else{
	  raw = $(this).html()
	}
        row.push(_.unescape(new String(raw).trim().replace(/\n/g, "").replace(/,/g," ")))
      })
      rows.push(row.join(','))
  })
  return rows.join('\n')
}
scraper_main()
