class ViewAddPostFile {
    constructor(GoBackView = null){
        this._GoBackView = GoBackView

        this._DivApp = NanoXGetDivApp()
    }

    LoadView(){
        // Clear view
        this._DivApp.innerHTML="ToDo"
        // ToDo

        // Log serveur load module Blog
        NanoXApiPostLog("Load view Add post file")
    }
}