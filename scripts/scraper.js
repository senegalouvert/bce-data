var request = require("request")
   ,cheerio = require("cheerio")
   ,fs      = require("fs")
   ,async   = require("async")
   ,_       = require("underscore")
   , conf   = require("./conf.js");

var Scraper = {};
module.exports =Scraper;

(function(my){
  "use strict";
  //Make request
  //Url should take line as argument , 

  my.Query = function(url, cb){
    console.log('my url ' + url)
    request(url, function(err, res, body){
     (err)? cb(null, err) : cb(null, body)
    })
  };

  //Query for Detail
  my.QueryDetail = function(line, cb){
    var url = line.split(",").pop()
    console.log(url)
    var q = {
      url: url,
      timeout:20000
    }
    request(q, function(err, res, body){
     (err)? cb(null, [line, err]) : cb(null, [line, body])
    })
  };

  my.WriteFile = function(src, data){
    fs.appendFile(src, data, function(err){
      if(err){
         throw err; return;
      };
    });
  };
              
  my.Main = function(){
    var self  = this
    var rows  = conf.nb_rows
       ,urls  = [];
    while( rows-- ) {
      urls.push(conf.base_url + rows)

    }
    console.log(urls)
    async.mapSeries(urls, my.Query, handler)
    
    function handler(err, results){
      var data  =[]
      _.each(results, function(result){
        var parse = self.parseBody(result)
        data.push(parse)
      })
      console.log(data)
      my.WriteFile('datas/link.json', data.join('\n'))
    }

    // parse body 
    this.parseBody  = function(body){
      var $ = cheerio.load(body)
      var rows= []
      console.log($("div").html())
      $("div .views-table tr").each(function(idx, html){
        var row =[]
        $(this).find("td").each(function(idx, e){
           var raw  = _.unescape(new String(self.getContent($,e)).trim().replace(/\n/g, "").replace(/,/g," "))	  
           row.push(raw)
        })
        rows.push(row.join(','))
      })
      return rows.join('\n')
    }

    //Get content of cell/td 
    this.getContent = function($, e){
      var text = $(e).html()
      if( /Voir/.test(text) ) return conf.base_site + $(e).find("a").attr("href")
      else if( /<a[^>]*>([^<]+)<\/a>/.test(text) ) return text.match( /<a[^>]*>([^<]+)<\/a>/ )[1]
      else if( /<span[^>]*>([^<]+)<\/span>/.test(text) ) return text.match( /<span[^>]*>([^<]+)<\/span>/ )[1]
      else return text
    }
  };

  my.Detail = function(){
    var self =this
    fs.readFile('datas/link.json', function (err, data) {
      if (err){throw err}
      var lines = data.toString().split('\n')
      lines = _.filter(lines, function(line) {
        return (line && line.length >0)
      })
      console.log("line length" + lines.length)
      async.mapSeries(lines, my.QueryDetail, handler);
    })

    //handleResponse
    function handler(err,results){
      var data = []
      _.each(results, function(result){
        data.push( result[0] + ',' +  self.parseBody(result[1]))
      })
      console.log(data)
      my.WriteFile('datas/data.csv', conf.head )
      my.WriteFile('datas/data.csv', data.join('\n'))
    }
    // parse body 
    this.parseBody = function(body){
      var row  =[]
      var $ = cheerio.load(body)
      $("div .content ").each(
        function(idx, html){
          $(this).find(".field").each(
            function(idx, html){
              var text  = $(this).text()
                if(text.indexOf("de commerce:") !=-1) {
                  row.push(text.split(":").pop())
                } else if (text.indexOf("Capital:") !=-1 ) {
                  row.push(text.split(":").pop().replace(/\s/g,""))
                } else {
                  row.push('')
                  console.log("entreprise does not has register of commerce!")
                }
            }
          )
        })
        return _.unique(row)
    }
  };
}(Scraper));


