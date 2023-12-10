const LogError = require("@gregvanko/nanox").NanoXLogError
const LogInfo = require("@gregvanko/nanox").NanoXLogInfo

const GeoJsonMultiLineToOneLine = require("./HelperGeoJson").GeoJsonMultiLineToOneLine
const GeoJsonCalculateTrackLength = require("./HelperGeoJson").GeoJsonCalculateTrackLength

async function GetBlockOfPosts (BlockNumberOfPostToLoad, res, User = null){
    let Reponse = [{Titre:"Titre de mon premier post", Date:"26/11/2023", Description:"Chouette rando"},{Titre:"Titre de mon second post", Date:"27/11/2023", Description:""}]
    //let Reponse = []
    
    const NumberOfItem = 10
    const cursor = NumberOfItem * BlockNumberOfPostToLoad

    res.status(200).send(Reponse)

}

function AddPost(TrackPost, res, User = null){
    const GeoJson = GeoJsonMultiLineToOneLine(TrackPost.GeoJson)
    const StartPoint = {"Lat" : GeoJson.features[0].geometry.coordinates[0][1], "Lng" : GeoJson.features[0].geometry.coordinates[0][0]}
    const Elevation = null // ToDo Get elevation
    const PostData = {
        "Name": TrackPost.Name,
        "Description": TrackPost.Description,
        "Date" : TrackPost.Date,
        "Owner" : User,
        "Length" : GeoJsonCalculateTrackLength(GeoJson),
        "StartPoint" : StartPoint,
        "Elevation" : Elevation,
        "GeoJson" : GeoJson,
        "Image": TrackPost.ImageBase64
    }
    res.status(200).send("Ok")
}


module.exports.GetBlockOfPosts = GetBlockOfPosts
module.exports.AddPost = AddPost