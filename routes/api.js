/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
//var MongoClient = require('mongodb');
var request           =require('request')
var rp = require('request-promise');
var fs                = require('fs')
var Stock             =require('../model/db');
var Ip              =require('../model/ipSchema')


//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      var query = req.query;
    
    
    
    
      var stock=[];
      var price =[];
      var likes =0;
      var found =false
      var result =[];
      var symbols =[];
     for(var key in query){
      if(key=='stock'){
      stock.push(query[key])
     // var a = query[key].toUpperCase()
     // Stock.findOne({stock:a},)
      }
     }
    
    if(stock.length){
     if(query["like"]){
      likes =1
      var ip =req.headers['x-forwarded-for']
      //var ip1 = ip.split(',')
      console.log(ip)
      Ip.findOne({ip:ip},function(err,ipfound){
          if(err) console.log(err)
        if(ipfound){
          console.log("ip found");
          found=true
        }
        if(!ipfound){
        var newIp = new Ip({ip:ip}).save(function(err,ipadd){
           if(err) console.log(err)
           console.log(ipadd)
        
        })
        }
      })
     
    }
    var stock1 = stock.join()
       
     //console.log(stock1);
    // res.send(stock1)
     var url = 'https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols='+stock1+'&apikey=A0X963A5I15A51UX';
    
    
    
    rp({url,json: true}).then(function(response){
     //console.log(response["Stock Quotes"])
      price = response["Stock Quotes"]
    }).then(function(){
     console.log(price);
      var symbol=""
      var cost=""
      for(var i=0;i<price.length;i++){
          symbol = price[i]["1. symbol"];
          cost   =price[i]["2. price"];
          symbols.push({symbol:symbol,cost:cost})
      }
      
    }).then(function(){
    
      console.log(symbols)
      for(var i=0;i<symbols.length;i++){
        
        
      (function(){
        var a=i
       Stock.findOne({stock:symbols[a].symbol},function(err,doc){
        if(err) console.log(err);
        if(!doc){
          var lk=0
         if(likes){
           lk=1
         }
         var newStock = new Stock({
          stock:symbols[a].symbol,
          price:symbols[a].cost,
          likes:lk
         
         }).save(function(err,stk){
         
          if(err) console.log(err);
           result.push(stk)
            if(result.length==symbols.length) {
                 console.log("finaly")
                 console.log(result)
                 var final =[];
              
              
                 final.push({stock:result[0].stock,price:result[0].price,rel_likes:result[0].likes-result[1].likes})
                final.push({stock:result[0].stock,price:result[0].price,rel_likes:result[1].likes-result[0].likes});
               res.json(final)
            }
         
         })
        }
        if(doc){
        console.log("found " +doc._id)
          
         var like1 = doc.likes;
          if(likes&&!found){
           like1=like1+1
          }
          var obj={stock:doc.stock,likes:like1,price:symbols[a].cost};
          var id=doc._id;
          
          
          Stock.findByIdAndUpdate(id,obj,{new:true},function(err,stk){
          
              
               result.push(stk)
            
            
             if(result.length==symbols.length) {
             console.log("finaly")
             console.log(result)
                var final =[];
               if(result.length==2){
                final.push({stock:result[0].stock,price:result[0].price,rel_likes:result[0].likes-result[1].likes})
                final.push({stock:result[1].stock,price:result[1].price,rel_likes:result[1].likes-result[0].likes});
                res.json(final)
                }
               if(result.length==1){
               res.json({stock:result[0].stock,price:result[0].price,likes:result[0].likes})
               
               }
               if(result.lenght>2){
                res.json(result)
               
               }
             
             
             }
              
              // console.log("result is")
              // console.log(result)
             })
          }
       })
          
       
       })()///end of self invoked function
      }
     // console.log(result.length)
      
       //res.json(symbols)
     })
    
    }
    else{
      res.json({"msg":"please give atleast one stock name "})
    
    }
    });
    
};
