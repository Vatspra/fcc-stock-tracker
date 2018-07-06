var mongoose = require('mongoose');

var StockSchema = mongoose.Schema({
 
  stock:String,
  price :String,
  likes:Number
  
});


var Stock = module.exports = mongoose.model('Stock',StockSchema);
