class GpxToGeoJson {
    
    constructor(Gpx=null){
        this._Gpx = Gpx
        this._GeoJson = null
    }

    Convert(){
        let ConvertReponse = {Error: true, ErrorMsg: "GpxToGeoJson : InitError", GeoJson: null, TrackName: null, TrackDescription: null, TrackDate: null}
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(this._Gpx,"text/xml");
        // Concersion en GeoJson
        this._GeoJson = toGeoJSON.gpx(xmlDoc)
        // Si la conversion est OK
        if (this._GeoJson.features.length > 0){
            // Si on a un GeoJson avec plusieurs line pour une track on le modifie
            if (this._GeoJson.features[0].geometry.type == "MultiLineString"){
                // Changer le type en LineString
                this._GeoJson.features[0].geometry.type = "LineString"
                // Fusionner les coodronnee
                const listofcoordonate = this._GeoJson.features[0].geometry.coordinates
                let NewListofcoordonate = []
                listofcoordonate.forEach(OneListe => {
                    OneListe.forEach(element => {
                        NewListofcoordonate.push(element)
                    });
                });
                this._GeoJson.features[0].geometry.coordinates = NewListofcoordonate
            }
            // Calcule de la date 
            let xmltime = null
            if(xmlDoc.childNodes[0].getElementsByTagName("metadata")[0]){
                const A = xmlDoc.childNodes[0].getElementsByTagName("metadata")[0]
                if(A.getElementsByTagName("time")[0]){
                    xmltime = A.getElementsByTagName("time")[0].childNodes[0].nodeValue
                }
            }
            if (xmltime == null){
                if(this._GeoJson.features[0].properties.time){
                    xmltime = this._GeoJson.features[0].properties.time
                } else {
                    xmltime = Date.now()
                }
            }
            ConvertReponse.Error = false
            ConvertReponse.ErrorMsg = null
            ConvertReponse.GeoJson = this._GeoJson
            ConvertReponse.TrackName = (this._GeoJson.features[0].properties.name) ? this._GeoJson.features[0].properties.name : null
            ConvertReponse.TrackDescription = (this._GeoJson.features[0].properties.desc) ? this._GeoJson.features[0].properties.desc : ""
            ConvertReponse.TrackDate = xmltime
        } else {
            ConvertReponse.ErrorMsg = "GpxToGeoJson : GeoJson not converted from gpx"
        }
        return ConvertReponse
    }
}