class Start {
    constructor(){
        this._DivApp = NanoXGetDivApp()
    }

    Initiation(){
        // Load view list of post
        const view = new ViewListOfPost()
        view.LoadStartView()
    }
}

// Creation de l'application
let MyStart = new Start()
// Ajout de l'application
NanoXAddModule("Start", IconModule.Start(), MyStart.Initiation.bind(MyStart), true, false)
