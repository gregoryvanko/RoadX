class ViewAddPostFile {
    constructor(GoBackView = null){
        this._GoBackView = GoBackView

        this._DivApp = NanoXGetDivApp()
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
        Conteneur.appendChild(NanoXBuild.InputWithLabel("InputBox", "Name:", "Text", "InputTrackName","", "Input Text", "text", "Name", null, true))
        // Description
        let DivDescription = NanoXBuild.Div(null, "InputBox Text")
        Conteneur.appendChild(DivDescription)
        DivDescription.appendChild(NanoXBuild.DivText("Description", null, "Text", ""))
        let DivContDesc = NanoXBuild.Div("DivContDesc", "DivContentEdit")
        DivContDesc.innerText = ""
        DivContDesc.contentEditable = "True"
        DivContDesc.style.fontSize = "1rem"
        DivDescription.appendChild(DivContDesc)
        // Date
        let divDate = NanoXBuild.Div(null, "InputBox", "display: -webkit-flex; display: flex; flex-direction: row; justify-content:start; align-content:center; align-items: center; flex-wrap: wrap;")
        Conteneur.appendChild(divDate)
        let TextDate = NanoXBuild.DivText("Date:", null, "Text", "margin-right: 1rem;")
        divDate.appendChild(TextDate)
        // ToDo Date picker
        // Color
        let divColor = NanoXBuild.Div(null, "InputBox", "display: -webkit-flex; display: flex; flex-direction: row; justify-content:start; align-content:center; align-items: center; flex-wrap: wrap;")
        let TextColor = NanoXBuild.DivText("Color:", null, "Text", "margin-right: 1rem;")
        divColor.appendChild(TextColor)
        let inputcolor = document.createElement("input")
        divColor.appendChild(inputcolor)
        inputcolor.setAttribute("id","SelectColor")
        inputcolor.setAttribute("type","color")
        inputcolor.setAttribute("style","background-color: white;border-radius: 8px; cursor: pointer; height: 2rem; border: 1px solid black; padding: 0.1rem;")
        inputcolor.value = "#0000FF"
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
                //me.ConvertGpxToImg(evt.target.result) //ToDo
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
            var fileCmd = "FileSelecteur.click()"
            eval(fileCmd)
        } else {
            this.ShowErrorMessage("Enter a name before selecting your file")
        }
    }
}