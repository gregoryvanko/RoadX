class GpxToGeoJson {
    
    constructor(Gpx=null){
        this._Gpx = Gpx
        this._GeoJson = null
    }

    Convert(){
        let ConvertReponse = {Error: true, ErrorMsg: "GpxToGeoJson : InitError", GeoJson: null, TrackName: null, TrackDescription: null, TrackDate: null}
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(this._Gpx,"text/xml");
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
            //this.BuildVirutalMap()
            ConvertReponse.Error = false
            ConvertReponse.ErrorMsg = null
            ConvertReponse.GeoJson = this._GeoJson
            ConvertReponse.TrackName = (this._GeoJson.features[0].properties.name) ? this._GeoJson.features[0].properties.name : null
            ConvertReponse.TrackDescription = (this._GeoJson.features[0].properties.desc) ? this._GeoJson.features[0].properties.desc : null
            ConvertReponse.TrackDate = (this._GeoJson.features[0].properties.time) ? this._GeoJson.features[0].properties.time : Date.now()
        } else {
            ConvertReponse.ErrorMsg = "GpxToGeoJson : GeoJson not converted from gpx"
        }
        return ConvertReponse
    }
}