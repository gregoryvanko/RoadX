const LogError = require("@gregvanko/nanox").NanoXLogError
const LogInfo = require("@gregvanko/nanox").NanoXLogInfo
const ModelPost = require("../MongooseModel/Model_Post")

const GeoJsonMultiLineToOneLine = require("./HelperGeoJson").GeoJsonMultiLineToOneLine
const GeoJsonCalculateTrackLength = require("./HelperGeoJson").GeoJsonCalculateTrackLength
const GeoJsonGetElevationOftrack = require("./HelperGeoJson").GeoJsonGetElevationOftrack

// Get One Block of Posts data for list of post view
async function GetBlockOfPosts (BlockNumberOfPostToLoad, res, User = null){
    let Reponse = []
    
    const NumberOfItem = 10
    const cursor = NumberOfItem * BlockNumberOfPostToLoad
    const query = {Owner: User.User}
    const projection ={Id:1, Name:1, Date:1, Description:1, Image:1, Length:1, InfoElevation:1, Owner:1} 

    ModelPost.find(query, projection, (err, result) => {
        if (err) {
            res.status(500).send(err)
            LogError(`GetBlockOfPosts db eroor: ${err}`, user)
        } else {
            if (result.length != 0){
                Reponse = result
            }
            res.status(200).send(Reponse)
        }
    }).limit(NumberOfItem).skip(cursor).sort({Date: -1})
}

// Get data of one post
async function GetPostData(PostId, res, User=null){
    const Projection = { Image: 0}
    ModelPost.findById(PostId, Projection, (err, result) => {
        if (err) {
            res.status(500).send(err)
            LogError(`GetPostData db error: ${err}`, User)
        } else {
            if (result != null){
                res.status(200).send(result) 
            } else {
                let errormsg = "Track Id not found"
                res.status(500).send(errormsg)
                LogError(`GetPostData error: ${errormsg}`, User)
            }
        }
    })
}

// Add or modify data of one post
async function AddModifyPost(TrackPost, res, User = null){
    const GeoJson = GeoJsonMultiLineToOneLine(TrackPost.GeoJson)
    const Length = GeoJsonCalculateTrackLength(GeoJson)
    const StartPoint = {"Lat" : GeoJson.features[0].geometry.coordinates[0][1], "Lng" : GeoJson.features[0].geometry.coordinates[0][0]}
    const ReponseElevation = await GeoJsonGetElevationOftrack(GeoJson)
    if(ReponseElevation.Error){
        res.status(500).send("GeoJsonGetElevationOftrack error : " + ReponseElevation.ErrorMsg)
    } else {
        const PostData = {
            "Name": TrackPost.Name,
            "Description": TrackPost.Description,
            "Date" : TrackPost.Date,
            "Owner" : User.User,
            "Length" : Length,
            "StartPoint" : StartPoint,
            "Elevation" : ReponseElevation.Data.AllElevation,
            "InfoElevation" : ReponseElevation.Data.InfoElevation,
            "GeoJson" : GeoJson,
            "Image": TrackPost.ImageBase64
        }
        // Add or modify post
        if (TrackPost.Id != null){
            // Update de la track existante
            ModelPost.findByIdAndUpdate(TrackPost.Id, PostData, (err, result) => {
                if (err) {
                    res.status(500).send("AddModifyPost update in db error : " + err)
                } else {
                    res.status(200).send("Ok")
                }
            })
        } else {
            // Insert new track
            const NewPost = new ModelPost(PostData)
            NewPost.save((err, result) => {
                if (err) {
                    res.status(500).send("AddModifyPost add in db error : " + err)                   
                } else {
                    res.status(200).send("Ok")
                }
            })
        }
    }
}

module.exports.GetBlockOfPosts = GetBlockOfPosts
module.exports.GetPostData = GetPostData
module.exports.AddModifyPost = AddModifyPost