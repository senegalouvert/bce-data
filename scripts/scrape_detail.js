 var request = require("request")
  ,cheerio = require("cheerio")
  ,fs      = require("fs")
  ,async   = require("async")
  ,_       = require("underscore")


var HEAD  ='\
Denonimation,\
Date creation,\
Siege social,\
Forme juridique,\
Secteur d activite,\
url,\
Registre de commerce,\
Capital\n'

//scrapper main
function scraperDetails(){
  fs.readFile('datas/link.json', function (err, data) {
    if (err){throw err}
    // No error, so we split line and make request over 
    // iterator
    lines =  data.toString().split('\n').filter(function(line){
       return line.length >0
    })
    console.log("line length" + lines.length)
    async.mapSeries(lines
                    ,makeRequest,
                    handleResponses);
  })
}

//make request 
function makeRequest(line, cb){
  var url  = line.split(",").pop()
  console.log(url)
  var q = {
    url: url,
    timeout:20000
  }
  request(q, function(err, res, body){
   (err)? cb(null, [line, err]) : cb(null, [line, body])
  })
}

//handleResponse
function handleResponses(err,results){
  data = []
  _.each(results,function(result){
    var parse = parseBody(result[1])
    parse = parse.join(",")
    parse = result[0] +","+ parse
    data.push(parse)
  })
  console.log( data)
  writeFile(data)
}

// parse body 
function parseBody(body){
  var row  =[]
  $ = cheerio.load(body)
  $("div .content ").each(
    function(idx, html){
      //var row =[]
      $(this).find(".field").each(function(idx, html){
        var ok = $(this).text().indexOf("de commerce:") !=-1 
		 || $(this).text().indexOf("Capital:")  !=-1
	if(ok){
          console.log($(this).text())
          row.push($(this).text().split(":").pop())
        }
      })
  })
  return _.unique(row)
}

//store into file
function writeFile(data){
  fs.appendFile('datas/data.csv',HEAD)
  fs.appendFile('datas/data.csv',data.join("\n"),function(err){
    if(err){throw err; return;};
      console.log("data was wrote into tmp file")
  });
}

scraperDetails()
