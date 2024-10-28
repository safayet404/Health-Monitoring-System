const mongoose = require('mongoose'); 

var healthSchema = new mongoose.Schema({
    temperature:{
        type:Number,
        
    },
    bloodPressure:{
        type:Number,
        
    },
    oxygenLevel:{
        type:Number,
       
    },
    timestamp: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('Health', healthSchema);