const path = require('path')
const fs = require('fs')
const { TileSet } = require("node-hgt")


// creation du folder si il n'existe pas encore
var dir = path.resolve(__dirname, "TempHgt")
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log("TempHgt folder created")
} else {
    console.log("TempHgt folder exist")
}

/**
 * Fustion d'un GeoJson MultiLineString en un GeoJson LineString
 * @param {GeoJson} GeoJson objet GeoJson contenant les données de la trace
 * @returns GeoJson en mode LineString
 */
function GeoJsonMultiLineToOneLine(GeoJson){
    if (GeoJson.features[0].geometry.type == "MultiLineString"){
        // Changer le type en LineString
        GeoJson.features[0].geometry.type = "LineString"
        // Fusionner les coodronnee
        const listofcoordonate = GeoJson.features[0].geometry.coordinates
        let NewListofcoordonate = []
        listofcoordonate.forEach(OneListe => {
            OneListe.forEach(element => {
                NewListofcoordonate.push(element)
            });
        });
        GeoJson.features[0].geometry.coordinates = NewListofcoordonate
    }
    return GeoJson
}

/**
 * Calcule la distance d'une line GeoJson
 * @param {GeoJSon} GeoJson objet GeoJson contenant les données de la trace
 * @returns distance en km
 */
function GeoJsonCalculateTrackLength(GeoJson){
    let distance = 0
    let Coord = GeoJson.features[0].geometry.coordinates
    const { getDistance } = require("geolib")
    for (let i = 1; i < Coord.length; i++){
        const [prelng, prelat] = Coord[i - 1]
        const [lng, lat] = Coord[i]
        // Get distance from first point
        let DistBetweenTwoPoint = getDistance(
            { latitude: prelat, longitude: prelng },
            { latitude: lat, longitude: lng }
        )
        distance += DistBetweenTwoPoint
    }
    return distance/1000 
}

/**
 * Retourne l'élévation d'un point { lat, lng }
 * @param {Object} { lat, lng }
 * @returns l'elevation du point
 */
function PromiseGetElevation({ lat, lng }){
    return new Promise ((resolve) => {
        let Reponse = {Error: true, ErrorMsg:"InitError PromiseGetElevation", Data:null}
        
        const tileset = new TileSet(path.resolve(__dirname, "TempHgt"))
        tileset.getElevation([lat, lng], (err, ele) => {
            if (!err){
                Reponse.Error = false
                Reponse.ErrorMsg = null
                Reponse.Data = ele.toFixed(0)
            } else {
                Reponse.Error = true
                Reponse.ErrorMsg = "PromiseGetElevation error : " + err
                Reponse.Data = null
            }
            resolve(Reponse)
        })
    })
}

/**
 * Calcule l'elevation des points d'une trace geojson
 * @param {GeoJSon} GeoJson objet GeoJson contenant les données de la trace
 * @returns pormise : array avec l'élévation de tous les points et des inforamtions sur l'elevation
 */
async function GeoJsonGetElevationOftrack(GeoJson){
    return new Promise (async (resolve) => {
        let Reponse = {Error: true, ErrorMsg:"InitError GeoJsonGetElevationOftrack", Data:null}

        let Coord = GeoJson.features[0].geometry.coordinates
        let ElevationMin = 0
        let ElevationMax = 0
        let ElevationCumulP = 0
        let ElevationCumulM = 0
        let ElevationPrevious = 0
    
        let AllElevation = []
        let distance = 0
        let IntermediereDist = 0
        const MinDistBetweenTwoPoint = 50
        const [lng, lat] = Coord[0]

        let ReponseGetElevation = await PromiseGetElevation({ lat, lng })
        if(ReponseGetElevation.Error){
            Reponse.Error = true
            Reponse.ErrorMsg = "GetElevation error : " + ReponseGetElevation.ErrorMsg
            Reponse.Data = null
            return resolve(Reponse)
        }
        let ele = parseInt(ReponseGetElevation.Data)
        AllElevation.push({ x: distance, y: ele, coord:{lat:lat, long: lng}})
    
        ElevationMin = ele
        ElevationMax = ele
        ElevationCumulP = 0
        ElevationCumulM = 0
        ElevationPrevious = ele
        
        
        const { getDistance } = require("geolib")
        for (let i = 1; i < Coord.length; i++){
            const [prelng, prelat] = Coord[i - 1]
            const [lng, lat] = Coord[i]
            // Get distance from first point
            let DistBetweenTwoPoint = getDistance(
                { latitude: prelat, longitude: prelng },
                { latitude: lat, longitude: lng }
            )
            distance += DistBetweenTwoPoint
            IntermediereDist += DistBetweenTwoPoint
    
            if ((IntermediereDist > MinDistBetweenTwoPoint) || (i == Coord.length -1)){
                IntermediereDist = 0
                // Get elevation
                let ReponseGetElevationInterm = await PromiseGetElevation({ lat, lng })
                if(ReponseGetElevationInterm.Error){
                    Reponse.Error = true
                    Reponse.ErrorMsg = "GetElevation error : " + ReponseGetElevation.ErrorMsg
                    Reponse.Data = null
                    return resolve(Reponse)
                }
                let eleP = parseInt(ReponseGetElevationInterm.Data)

                // Add Elevation point
                AllElevation.push({ x: distance, y: eleP, coord:{lat:lat, long: lng}})
                // Get ElevationMin
                if (eleP < ElevationMin){
                    ElevationMin = eleP
                }
                // Get ElevationMax
                if (eleP > ElevationMax){
                    ElevationMax = eleP
                }
                // Get ElevationCumulP ElevationCumulM
                const Delta = eleP - ElevationPrevious
                if ((Delta)>0){
                    ElevationCumulP += Delta
                } else {
                    ElevationCumulM += Delta
                }
                ElevationPrevious = eleP
            }
        }
        Reponse.Error= false
        Reponse.ErrorMsg= null
        Reponse.Data= {AllElevation: AllElevation, InfoElevation: {ElevMax:ElevationMax, ElevMin:ElevationMin, ElevCumulP:ElevationCumulP, ElevCumulM:Math.abs(ElevationCumulM)}}
        resolve(Reponse)
    })
}


module.exports.GeoJsonMultiLineToOneLine = GeoJsonMultiLineToOneLine
module.exports.GeoJsonCalculateTrackLength = GeoJsonCalculateTrackLength
module.exports.GeoJsonGetElevationOftrack = GeoJsonGetElevationOftrack