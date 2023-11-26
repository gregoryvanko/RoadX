class Start {
    constructor(){
        this._DivApp = NanoXGetDivApp()
    }

    Initiation(){
        // Load Start view
        this.LoadStartView()
    }

    LoadStartView(){
        // Clear view
        this._DivApp.innerHTML=""
        // Build Menu Button
        this.BuildMenuButton()
        // Waiting text
        this._DivApp.appendChild(NanoXBuild.DivText("Loading posts...", null, null, "margin-top:2rem;"))
        // Get Log
        // ToDo
        // Log serveur load module Blog
        NanoXApiPostLog("Load module Start")
    }

    BuildMenuButton(){
        // Menu bar Translucide
        //NanoXSetMenuBarTranslucide(false)
        // Show name in menu bar
        //NanoXShowNameInMenuBar(true)
        // Menu bar on top
        NanoXSetMenuBarOnTop(false)
        // clear menu button left
        NanoXClearMenuButtonLeft()
        // clear menu button right
        NanoXClearMenuButtonRight()
        // clear menu button setttings
        NanoXClearMenuButtonSettings()
    }
}

// Creation de l'application
let MyStart = new Start()
// Ajout de l'application
NanoXAddModule("Start", IconModule.Start(), MyStart.Initiation.bind(MyStart), true, false)
