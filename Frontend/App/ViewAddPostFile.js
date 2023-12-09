class ViewAddPostFile {
    constructor(GoBackView = null){
        this._GoBackView = GoBackView

        this._DivApp = NanoXGetDivApp()
        this._IdOfMap = "IdOfMap"

        this._TraceName = "Titre"
        this._TraceDescription = ""
        this._TraceDate = new Date().toLocaleDateString("fr")
        this._TraceColor = "#0000FF"
        this._TraceImageBase64 = null
    }

    LoadView(){
        // Clear view
        this._DivApp.innerHTML=""
        // Contener
        const Conteneur = NanoXBuild.DivFlexColumn("Conteneur", null, "width: 100%;")
        this._DivApp.appendChild(Conteneur)
        // Add titre
        Conteneur.appendChild(NanoXBuild.DivText("Ajouter un fichier GPX", null, "Titre"))
        // Input Name
        Conteneur.appendChild(NanoXBuild.InputWithLabel("InputBox", "Name:", "Text", "InputTrackName","", "Input Text", "text", this._TraceName, null, true))
        // Description
        let DivDescription = NanoXBuild.Div(null, "InputBox Text")
        Conteneur.appendChild(DivDescription)
        DivDescription.appendChild(NanoXBuild.DivText("Description", null, "Text", ""))
        let DivContDesc = NanoXBuild.Div("DivContDesc", "DivContentEdit")
        DivContDesc.innerText = this._TraceDescription
        DivContDesc.contentEditable = "True"
        DivContDesc.style.fontSize = "1rem"
        DivDescription.appendChild(DivContDesc)
        // Date
        let divDate = NanoXBuild.Div(null, "InputBox", "display: -webkit-flex; display: flex; flex-direction: row; justify-content:start; align-content:center; align-items: center; flex-wrap: wrap;")
        Conteneur.appendChild(divDate)
        let TextDate = NanoXBuild.DivText("Date:", null, "Text", "margin-right: 1rem;")
        divDate.appendChild(TextDate)
        let InputDate = NanoXBuild.Input(this._TraceDate, "text", "InputDate", "", "InputDate", "Input Text", "width: 50%; text-align: right;")
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
        // Color
        let divColor = NanoXBuild.Div(null, "InputBox", "display: -webkit-flex; display: flex; flex-direction: row; justify-content:start; align-content:center; align-items: center; flex-wrap: wrap;")
        let TextColor = NanoXBuild.DivText("Color:", null, "Text", "margin-right: 1rem;")
        divColor.appendChild(TextColor)
        let inputcolor = document.createElement("input")
        divColor.appendChild(inputcolor)
        inputcolor.setAttribute("id","SelectColor")
        inputcolor.setAttribute("type","color")
        inputcolor.setAttribute("style","background-color: white;border-radius: 8px; cursor: pointer; height: 2rem; border: 1px solid black; padding: 0.1rem;")
        inputcolor.value = this._TraceColor
        Conteneur.appendChild(divColor)
        // Selection file
        let divSelectFile = NanoXBuild.Div(null, "InputBox", "display: -webkit-flex; display: flex; flex-direction: row; justify-content:start; align-content:center; align-items: center; flex-wrap: wrap;")
        Conteneur.appendChild(divSelectFile)
        let TextSelectFile = NanoXBuild.DivText("Select GPX file:", null, "Text", "margin-right: 1rem;")
        divSelectFile.appendChild(TextSelectFile)
        divSelectFile.appendChild(NanoXBuild.Button("Select GPX",this.ClickSelectGPX.bind(this), "SelectGPX","Text Button ButtonWidth30"))
        //Input file
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
                me.LoadViewImageTrack(evt.target.result)
            }
            reader.onerror = function (evt) {
                me.ShowErrorMessage("Error reading gpx file: " + evt);
            }
        }, false)
        Conteneur.appendChild(Input)

        // Log serveur load module Blog
        NanoXApiPostLog("Load view Add post file")
    }

    ShowErrorMessage(Error){
        let Content = NanoXBuild.DivFlexColumn(null, null, "width: 100%;")
        // Empty space
        Content.appendChild(this.BuildEmptySpace())
        // Texte waiting
        Content.appendChild(NanoXBuild.DivText(Error, null, "Text", "color:red;"))
        // Empty space
        Content.appendChild(this.BuildEmptySpace())
        // Show window
        NanoXBuild.PopupCreate(Content)
    }

    BuildEmptySpace(){
        let divempty = document.createElement('div')
        divempty.style.height = "2rem"
        return divempty
    }

    ClickSelectGPX(){
        if (document.getElementById("InputTrackName").value != ""){
            // Save Data
            this._TraceName = document.getElementById("InputTrackName").value
            this._TraceDescription = document.getElementById("DivContDesc").innerText
            this._TraceDate = document.getElementById("InputDate").value
            this._TraceColor = document.getElementById("SelectColor").value
            // Open file selector
            var fileCmd = "FileSelecteur.click()"
            eval(fileCmd)
        } else {
            this.ShowErrorMessage("Enter a name before selecting your file")
        }
    }

    async LoadViewImageTrack(GPX){
        // Clear view
        this._DivApp.innerHTML=""
        // Contener
        const Conteneur = NanoXBuild.DivFlexColumn("Conteneur", null, "width: 100%;")
        this._DivApp.appendChild(Conteneur)
        // Add titre
        Conteneur.appendChild(NanoXBuild.DivText(this._TraceName, null, "Titre"))
        // Add Div image
        const DivMapAddTrack = NanoXBuild.Div("", "DivMapAddTrack")
        Conteneur.appendChild(DivMapAddTrack)
        // GPX to IMG
        let MyGpxToMap = new GpxToMap(GPX, DivMapAddTrack, this._IdOfMap)
        let ReponseGpxToImg = MyGpxToMap.Convert()
        if (ReponseGpxToImg.Error){
            this.ShowErrorMessage(ReponseGpxToImg.ErrorMsg)
        } else {
            const DivBoxButton = NanoXBuild.DivFlexRowSpaceAround(null, "ConteneurBox", null)
            Conteneur.appendChild(DivBoxButton)
            DivBoxButton.appendChild(NanoXBuild.Button("Save",this.ClickSave.bind(this), "Save","Text Button ButtonWidth30"))
        }
    }

    async ClickSave(){
        // Convert div to image base64
        this._TraceImageBase64 = await domtoimage.toPng(document.getElementById(this._IdOfMap))
        // Save data
        //this.SendAddTrack(GPX, ReponseGpxToImg.Img, ReponseGpxToImg.GeoJson) //ToDo
    }
}