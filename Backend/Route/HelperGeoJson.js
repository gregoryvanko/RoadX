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



module.exports.GeoJsonMultiLineToOneLine = GeoJsonMultiLineToOneLine
module.exports.GeoJsonCalculateTrackLength = GeoJsonCalculateTrackLength