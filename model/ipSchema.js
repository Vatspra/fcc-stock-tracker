var mongoose = require('mongoose');

var IpSchema = mongoose.Schema({
 
  ip:String
  
});


var Ip= module.exports = mongoose.model('Ip',IpSchema);
