class ViewAddPostChoice {
    constructor(GoBackView = null){
        this._GoBackView = GoBackView

        this._DivApp = NanoXGetDivApp()
    }

    /**
     * Load start view
     */
    LoadView(){
        // Clear view
        this._DivApp.innerHTML=""
        // Build Menu Button
        this.BuildMenuButton()
        // Contener
        const Conteneur = NanoXBuild.DivFlexColumn("Conteneur", null, "width: 100%;")
        this._DivApp.appendChild(Conteneur)
        // Add titre
        Conteneur.appendChild(NanoXBuild.DivText("Publier une route", null, "Titre"))
        // Box add fichier
        const DivBoxFichier = NanoXBuild.DivFlexRowSpaceBetween(null, "ConteneurBox ConteneurButton", null)
        DivBoxFichier.onclick = this.ClickOnAddFile.bind(this)
        Conteneur.appendChild(DivBoxFichier)
        const DivImageAddFile = NanoXBuild.DivFlexColumn(null, null, "width: 18%; height: 12vh;")
        DivImageAddFile.innerHTML = IconModule.AddFileMonitor()
        DivBoxFichier.appendChild(DivImageAddFile)
        DivBoxFichier.appendChild(NanoXBuild.DivText("Sélectionner le fichier GPS contenant la route", null, "Text", "width: 80%;"))
        // Boxconstructeur de track
        const DivBoxConstruire = NanoXBuild.DivFlexRowSpaceBetween(null, "ConteneurBox ConteneurButton", null)
        DivBoxConstruire.onclick = this.ClickOnConstructTrack.bind(this)
        Conteneur.appendChild(DivBoxConstruire)
        const DivImageCreate = NanoXBuild.DivFlexColumn(null, null, "width: 18%; height: 12vh;")
        DivImageCreate.innerHTML = IconModule.CreateFileMonitor()
        DivBoxConstruire.appendChild(DivImageCreate)
        DivBoxConstruire.appendChild(NanoXBuild.DivText("Dessiner votre route manuellement", null, "Text", "width: 80%;"))

        // Log serveur load module Blog
        NanoXApiPostLog("Load view Add post choice")
    }

    /**
     * Build button menu
     */
    BuildMenuButton(){
        // Menu bar Translucide
        NanoXSetMenuBarTranslucide(true)
        // Show name in menu bar
        NanoXShowNameInMenuBar(false)
        // Menu bar on top
        NanoXSetMenuBarOnTop(false)

        // clear menu button left
        NanoXClearMenuButtonLeft()
        // clear menu button right
        NanoXClearMenuButtonRight()
        // clear menu button setttings
        NanoXClearMenuButtonSettings()

        // Button Back
        NanoXAddMenuButtonLeft("ButtonBack", "Back", IconModule.LeftArrow(NanoXGetColorIconMenuBar()), this._GoBackView.bind())
    }

    ClickOnAddFile(){
        const view = new ViewAddPostFile(this._GoBackView)
        view.GetGPXFile()
    }

    ClickOnConstructTrack(){
        alert("Construct Track")
        // ToDo
    }
}