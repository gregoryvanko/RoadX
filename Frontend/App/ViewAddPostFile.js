class ViewAddPostFile {
    constructor(GoBackView = null){
        this._GoBackView = GoBackView

        this._DivApp = NanoXGetDivApp()
        this._IdMapToImg = "IdMapToImg"

        this._TraceName = "Titre"
        this._TraceDescription = ""
        this._TraceDate = new Date(Date.now())
        this._Time = Date.now()
        this._TraceImageBase64 = null
        this._TraceGeoJson = null
    }

    GetGPXFile(){
        // Log serveur load module Blog
        NanoXApiPostLog("Load view Add post file")
        //get gpx file
        var Input = document.createElement("input")
        Input.setAttribute("type","file")
        Input.setAttribute("name","FileSelecteur")
        Input.setAttribute("id","FileSelecteur")
        Input.setAttribute("accept", '.gpx')
        Input.setAttribute("style","display: none;")
        Input.addEventListener("change", ()=>{
            var fichierSelectionne = document.getElementById('FileSelecteur').files[0]
            var reader = new FileReader();
            let me = this
            reader.readAsText(fichierSelectionne, "UTF-8");
            reader.onload = function (evt) {
                me.LoadView(evt.target.result)
            }
            reader.onerror = function (evt) {
                me.ShowErrorMessage("Error reading gpx file: " + evt);
            }
        }, false)
        this._DivApp.appendChild(Input)
        // Open file selector
        var fileCmd = "FileSelecteur.click()"
        eval(fileCmd)
    }

    LoadView(GPX){
        // Clear view
        this._DivApp.innerHTML=""
        // Contener
        const Conteneur = NanoXBuild.DivFlexColumn("Conteneur", null, "width: 100%;")
        this._DivApp.appendChild(Conteneur)
        // Add titre
        Conteneur.appendChild(NanoXBuild.DivText("Ajouter un fichier GPX", null, "Titre"))
        // Convert GPX to map
        let MyGpxToGeoJson = new GpxToGeoJson(GPX)
        let ReponseGpxToGeoJson = MyGpxToGeoJson.Convert()
        if (ReponseGpxToGeoJson.Error){
            // Show message
            this.ShowErrorMessage(ReponseGpxToGeoJson.ErrorMsg)
        } else {
            // Get track info
            this._TraceName = ReponseGpxToGeoJson.TrackName
            this._TraceDescription = ReponseGpxToGeoJson.TrackDescription
            this._TraceDate = new Date(ReponseGpxToGeoJson.TrackDate)
            // Save GeoJson
            this._TraceGeoJson = ReponseGpxToGeoJson.GeoJson
            // Input Name
            Conteneur.appendChild(this.BuildEmptySpace("1rem"))
            Conteneur.appendChild(NanoXBuild.InputWithLabel("InputBox", "Name:", "Text", "InputTrackName",this._TraceName, "Input Text", "text", "Name", null, true))
            // Description
            Conteneur.appendChild(this.BuildEmptySpace("1rem"))
            let DivDescription = NanoXBuild.Div(null, "InputBox Text")
            Conteneur.appendChild(DivDescription)
            DivDescription.appendChild(NanoXBuild.DivText("Description", null, "Text", ""))
            let DivContDesc = NanoXBuild.Div("DivContDesc", "DivContentEdit")
            DivContDesc.innerText = this._TraceDescription
            DivContDesc.contentEditable = "True"
            DivContDesc.style.fontSize = "1rem"
            DivDescription.appendChild(DivContDesc)
            // Date
            Conteneur.appendChild(this.BuildEmptySpace("1rem"))
            let divDate = NanoXBuild.Div(null, "InputBox", "display: -webkit-flex; display: flex; flex-direction: row; justify-content:start; align-content:center; align-items: center; flex-wrap: wrap;")
            Conteneur.appendChild(divDate)
            let TextDate = NanoXBuild.DivText("Date:", null, "Text", "margin-right: 1rem;")
            divDate.appendChild(TextDate)
            let InputDate = NanoXBuild.Input(this._TraceDate.toLocaleDateString("fr"), "text", "InputDate", "", "InputDate", "Input Text", "width: 40%; text-align: right;")
            InputDate.setAttribute("inputmode","none")
            divDate.appendChild(InputDate)
            // https://mymth.github.io/vanillajs-datepicker
            const datepicker = new Datepicker(InputDate, {
                autohide : true,
                format : "dd/mm/yyyy",
                language : "fr",
                todayHighlight : true,
                updateOnBlur : false
            });
            // Add Div image
            Conteneur.appendChild(this.BuildEmptySpace("1rem"))
            const DivMapAddTrack = NanoXBuild.Div("", "InputBox")
            Conteneur.appendChild(DivMapAddTrack)
            DivMapAddTrack.appendChild(NanoXBuild.Div(this._IdMapToImg, null, `width: 100%; padding-top: 56.25%;`))
            // Build Map
            let Map = new GeoXMap(this._IdMapToImg)
            Map.RenderMap(false, false)
            Map.AddTrackOnMap("TraclToImg", this._TraceGeoJson, true, "#0000FF")
            // Add save boutton
            const DivBoxButton = NanoXBuild.DivFlexRowSpaceAround(null, "ConteneurBox", null)
            Conteneur.appendChild(DivBoxButton)
            DivBoxButton.appendChild(NanoXBuild.Button("Save",this.ClickSave.bind(this), "Save","Text Button ButtonWidth30"))
        }
    }

    ShowErrorMessage(Error){
        let Content = NanoXBuild.DivFlexColumn(null, null, "width: 100%;")
        // Empty space
        Content.appendChild(this.BuildEmptySpace())
        // Texte
        let text = NanoXBuild.DivText("", null, "Text", "color:red;")
        text.innerHTML = Error
        Content.appendChild(text)
        // Empty space
        Content.appendChild(this.BuildEmptySpace())
        // Show window
        NanoXBuild.PopupCreate(Content)
    }

    BuildEmptySpace(Space = "2rem"){
        let divempty = document.createElement('div')
        divempty.style.height = Space
        return divempty
    }

    async ClickSave(){
        if (document.getElementById("InputTrackName").value != ""){
            // Save Data
            this._TraceName = document.getElementById("InputTrackName").value
            this._TraceDescription = document.getElementById("DivContDesc").innerText
            let dateParts = document.getElementById("InputDate").value.split("/");
            this._TraceDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0],this._Time.getHours(), this._Time.getMinutes(), this._Time.getSeconds());
            // Convert div to image base64
            this._TraceImageBase64 = await domtoimage.toPng(document.getElementById(this._IdMapToImg))
            // Send data to server
            const DataToSend= {
                "Name": this._TraceName,
                "Description" : this._TraceDescription,
                "Date" : this._TraceDate,
                "ImageBase64": this._TraceImageBase64,
                "GeoJson" : this._TraceGeoJson
            }
            NanoXApiPost("/post", DataToSend).then((reponse)=>{
                this._GoBackView()
            },(erreur)=>{
                // Show error
                this.ShowErrorMessage(erreur)
            })

        } else {
            this.ShowErrorMessage("Enter a name before selecting your file")
        }
    }
}