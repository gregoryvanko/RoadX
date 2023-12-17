const Mongoose = require("@gregvanko/nanox").Mongoose

let PostSchema = new Mongoose.Schema(
    {
        Name: String,
        Description : String,
        Date: Date,
        Owner : String,
        Length : Number,
        StartPoint:{
            Lat: Number,
            Lng : Number
        },
        Elevation : [],
        InfoElevation : {
            ElevMax : Number,
            ElevMin : Number,
            ElevCumulP : Number,
            ElevCumulM : Number
        },
        GeoJson: Object,
        Image : String
    },
    { collection:'Posts'});
    
module.exports = Mongoose.model('Posts', PostSchema)