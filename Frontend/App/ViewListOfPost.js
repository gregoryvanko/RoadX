class ViewListOfPost {
    constructor(){
        this._DivApp = NanoXGetDivApp()
        this._ConteneurListOfPost = NanoXBuild.DivFlexColumn("ConteneurListOfPost", "ConteneurListOfPost", null)
        this._TextWaiting = NanoXBuild.DivText("Loading Posts...", "textwaiting", null, "margin-top:2rem;")

        this._BlockNumberOfPostToLoad = 0
        this._NumberOfPostPerBlock = 10

        // Gestion des observer
        let me = this
        this._Observer = new IntersectionObserver((entries)=>{
            entries.forEach(function (obersable){
                if (obersable.intersectionRatio > 0.5){
                    me._BlockNumberOfPostToLoad ++
                    me.GetFilOfPost()
                    me._Observer.unobserve(obersable.target)
                }
            })
        }, {threshold: [1]})
    }

    /**
     * Load start view
     */
    LoadStartView(){
        // Reste value
        this._BlockNumberOfPostToLoad = 0
        // Clear view
        this._DivApp.innerHTML=""
        this._ConteneurListOfPost.innerHTML = ""
        // Build Menu Button
        this.BuildMenuBar()
        // Add titre
        this._DivApp.appendChild(NanoXBuild.DivText(NanoXGetAppName(), null, "Titre"))
        // Add conteneur list of post
        this._DivApp.appendChild(this._ConteneurListOfPost)
        // Waiting text
        this._DivApp.appendChild(this._TextWaiting)
        // Get Log
        this.GetLastPost()
        // Log serveur load module Blog
        NanoXApiPostLog("Load view list of posts")
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

        // Button Add track
        NanoXAddMenuButtonSettings("ButtonAddTrack", "Add Track", IconModule.AddPost(NanoXGetColorIconMenuBar()), this.LoadAddView.bind(this))
    }

    /**
     * Get Last post
     */
    GetLastPost(){
        // Get File of Psot
        NanoXApiGet("/post/lastposts/" + this._BlockNumberOfPostToLoad).then((reponse)=>{
            // Si il y a moins de x posts
            if(reponse.length < this._NumberOfPostPerBlock){
                // Add posts without next
                reponse.forEach(Post => {
                    // Add Past
                    const Divpost = ClassPost.Render(Post)
                    Divpost.onclick = this.ClickOnPost.bind(this, Post._id)
                    this._ConteneurListOfPost.appendChild(Divpost)
                });
                // On supprime le waiting text
                if (document.getElementById("textwaiting")){
                    this._TextWaiting.parentNode.removeChild(this._TextWaiting)
                }
                this._ConteneurListOfPost.appendChild(NanoXBuild.DivText("All posts are loaded", "nopost", null, "margin-top:2rem; margin-bottom: 2rem;"))
            } else {
                let TriggerPoint = reponse.length-1
                let Currentpoint = 0
                // Add posts with next
                reponse.forEach(Post => {
                    // Add post
                    const TempPost = ClassPost.Render(Post)
                    TempPost.onclick = this.ClickOnPost.bind(this, Post._id)
                    this._ConteneurListOfPost.appendChild(TempPost)
                    // si l'element est l'element TriggerPoint
                    if (Currentpoint == TriggerPoint){
                        // ajouter le listener pour declancher le GetPosts
                        this._Observer.observe(TempPost)
                    }
                    // Increment Currentpoint
                    Currentpoint ++
                });
            }
        },(erreur)=>{
            this._DivApp.innerHTML = erreur
        })
    }

    /**
     * Load de la vue add track
     */
    LoadAddView(){
        const view = new ViewAddPostChoice(this.LoadStartView.bind(this))
        view.LoadView()
    }

    /**
     * Click on one post
     * @param {Object} PostData Data of one post
     */
    ClickOnPost(PostId){
        // Load view One Post
        const viewonepost = new ViewOnePost(PostId, this.LoadStartView.bind(this))
        viewonepost.LoadStartView()
    }
}