class GpxToMap {
    
    constructor(Gpx=null, Div=null, TraceColor = "#0000FF"){
        this._Div = Div
        this._Gpx = Gpx
        this._TraceColor = TraceColor

        this._GeoJson = null
        this._MapId = "GPXMap"
        this._layerTrack1 = null
    }

    Convert(){
        let ConvertReponse = {Error: true, ErrorMsg:"GpxToMap : InitError"}
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
            this.BuildVirutalMap()
            ConvertReponse.Error = false
            ConvertReponse.ErrorMsg = null
        } else {
            ConvertReponse.ErrorMsg = "GpxToMap : GeoJson not converted from gpx"
        }
        return ConvertReponse
    }

    BuildVirutalMap(){
        this._Div.appendChild(NanoXBuild.Div(this._MapId, null, `width: 100%; padding-top: 56.25%;`))
        let Openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        })
        let CenterPoint = {Lat: "50.709446", Long: "4.543413"}
        let Zoom = 14
        let MyMap = L.map(this._MapId , {attributionControl: false, fadeAnimation: false, zoomAnimation: false, zoomControl: false, tapTolerance:40, tap:false, layers: [Openstreetmap]}).setView([CenterPoint.Lat, CenterPoint.Long], Zoom);
        let WeightTrack = (L.Browser.mobile) ? 5 : 3
        var TrackStyle = {
            "color": this._TraceColor,
            "weight": WeightTrack
        };
        this._layerTrack1=L.geoJSON(this._GeoJson , 
            {
                style: TrackStyle, 
                filter: function(feature, layer) {if (feature.geometry.type == "LineString") return true}, 
                arrowheads: {frequency: '100px', size: '15m', fill: true}
            }).addTo(MyMap)

        var numPts = this._GeoJson.features[0].geometry.coordinates.length;
        var beg = this._GeoJson.features[0].geometry.coordinates[0];
        var end = this._GeoJson.features[0].geometry.coordinates[numPts-1];
        let IconPointStartOption = L.icon({
            iconUrl: IconMarker.MarkerVert(),
            iconSize:     [40, 40],
            iconAnchor:   [20, 40],
            popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
        });
        let IconPointEndOption = L.icon({
            iconUrl: IconMarker.MarkerRouge(),
            iconSize:     [40, 40],
            iconAnchor:   [20, 40],
            popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
        });
        const MarkerStart = new L.marker([beg[1],beg[0]], {icon: IconPointStartOption}).addTo(MyMap)
        const MarkerEnd = new L.marker([end[1],end[0]], {icon: IconPointEndOption}).addTo(MyMap)
        // FitBound
        MyMap.fitBounds(this._layerTrack1.getBounds(), {padding: [50,50]});
    }

    ChangeTrackColor(Color){
        if (this._layerTrack1){
            this._layerTrack1.setStyle({"color": Color});
        }
    }
}