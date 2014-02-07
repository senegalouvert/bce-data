 var request = require("request")
    ,cheerio = require("cheerio")
    ,fs      = require("fs")
    ,async   = require("async")
    ,_       = require("underscore")

//scrapper main
function scraper_details(){
  console.log("scraper_details")
  fs.readFile('datas/link.json', function (err, data) {
    if (err){throw err}
    lines =  data.toString().split('\n').filter(function(line){
      return line.length >0
    })
    async.map(lines,
      function(line, cb){
        request(line.split(",").pop(),function(err, res, body){
          if(err){
            cb(null, [line ,err])
          } else {
            cb(null, [line, body])
          }
        })
       },
       function(err, results){
         data  =[]
         _.each(results,function(result){
           data.push(result[0] + "," + parseBody(result[1]).join(","))
         })
         console.log("++++++++++++++++++++"  + data)
         store_details(data)
    })
  });
}
// parse body 
function parseBody(body){
  var row  =[]
  $ = cheerio.load(body)
  $("div .content ").each(
    function(idx, html){
      //var row =[]
      $(this).find(".field").each(function(idx, html){
        if( $(this).text().indexOf("de commerce:") !=-1 ||$(this).text().indexOf("Capital:") !=-1){
	    console.log($(this).text())
          row.push($(this).text().split(":").pop())
        }
      })
    })
    return _.unique(row)
}
//store into file
function store_details(data){
fs.appendFile(
'datas/data.csv',
'\
Denonimation,\
Date creation,\
Siege social,\
Forme juridique,\
Secteur d activite,\
url,\
Registre de commerce,\
Capital\n')
  fs.appendFile('datas/data.csv',data.join("\n"), function(err){
    if(err){throw err; return;};
      console.log("data was wrote into tmp file")
  });
}
scraper_details()
