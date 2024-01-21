class ViewOnePost{
    constructor(PostId = null, GoBackView = null){
        this._PostId = PostId
        this._GoBackView = GoBackView
        this._DivApp = NanoXGetDivApp()
        this._TextWaiting = NanoXBuild.DivText("Loading Post Data...", "textwaiting", null, "margin-top:2rem;")
        this._ConteneurOnePostMap = "ConteneurOnePostMap"

        this._MapOnePost = null
    }

    /**
     * Load start view
     */
    LoadStartView(){
        // Clear view
        this._DivApp.innerHTML=""
        // Clear Data
        this._MapOnePost = null
        // Build Menu Button
        this.BuildMenuBar()
        // Waiting text
        this._DivApp.appendChild(this._TextWaiting)
        // Get Post Data
        this.GetPostData(this._PostId)
        // Log serveur load view one post
        NanoXApiPostLog("Load view one post")
    }

    /**
     * Build button menu
     */
    BuildMenuBar(){
        // Menu bar on top
        NanoXSetMenuBarOnTop(false)
        // Menu bar Translucide
        NanoXSetMenuBarTranslucide(true)
        // Show name in menu bar
        NanoXShowNameInMenuBar(false)
        
        // clear menu button left
        NanoXClearMenuButtonLeft()
        // clear menu button right
        NanoXClearMenuButtonRight()
        // clear menu button setttings
        NanoXClearMenuButtonSettings()

        // Button Back
        if(this._GoBackView != null){
            NanoXAddMenuButtonLeft("ButtonBack", "Back", IconModule.LeftArrow(NanoXGetColorIconMenuBar()), this._GoBackView.bind())
        }
    }

    /**
     * Get post Data
     * @param {String} PostId ID of post
     */
    GetPostData(PostId){
        // Get post data
        NanoXApiGet("/post/" + PostId).then((reponse)=>{  
            this.LoadViewOnePost(reponse) 
            // Log serveur load view one post
            NanoXApiPostLog("Load view one post data: " + reponse.Name)         
        },(erreur)=>{
            this._DivApp.innerHTML = erreur
        })
    }

    /**
     * Load view of data for one post
     * @param {Object} PostData Data of one post
     */
    LoadViewOnePost(PostData){
        // Clear view
        this._DivApp.innerHTML=""
        // Box full screen
        let box = NanoXBuild.Div("box", "BoxFullScreen", null)
        this._DivApp.appendChild(box)
        // Add titre
        box.appendChild(NanoXBuild.DivText(PostData.Name, null, "SousTitre", "height: 3rem; margin: auto; text-align: center; text-wrap: balance; display: flex; align-items: center;"))
        // Div OnePost
        box.appendChild(NanoXBuild.Div(this._ConteneurOnePostMap, null, "flex-grow : 1; margin: 0.2rem;")) 
        // Center of map
        let InitialMapData= {CenterPoint:{Lat:PostData.StartPoint.Lat, Long:PostData.StartPoint.Lng}, Zoom:8}
        // RenderMap
        this._MapOnePost = new GeoXMap(this._ConteneurOnePostMap,InitialMapData) 
        this._MapOnePost.RenderMap()
        this._MapOnePost.AddTrackOnMap(PostData._id, PostData.GeoJson, true)

        // Todo
        console.log(PostData)
    }
}