class ClassPost{
    constructor(){}

    static Render (PostData) { // ToDo Add click on post
        // Conteneur du post
        const conteneur = NanoXBuild.DivFlexColumn("ConteneurPost", "ConteneurPost", "")
        // Description
        const DivDescription = NanoXBuild.Div(null, null, "width:100%")
        conteneur.appendChild(DivDescription)
        // Titre
        const DivTitre = NanoXBuild.DivFlexRowSpaceBetween(null, "ConteneurTitre", null)
        DivTitre.appendChild(NanoXBuild.DivText(PostData.Name, null, "PostTitre", null))
        DivDescription.appendChild(DivTitre)
        // Date
        const DivDate = NanoXBuild.DivFlexRowSpaceBetween(null, "ConteneurInfo", null)
        DivDate.appendChild(NanoXBuild.DivText(new Date(PostData.Date).toLocaleDateString(), null, "PostInfo", null))
        DivDescription.appendChild(DivDate)
        // Description
        if(PostData.Description != ""){
            const DivDesc = NanoXBuild.DivFlexRowSpaceBetween(null, "ConteneurInfo", null)
            DivDesc.appendChild(NanoXBuild.DivText(PostData.Description, null, "PostInfo", null))
            DivDescription.appendChild(DivDesc)
        }
        // Image
        if (PostData.Image){
            let img = document.createElement('img');
            img.classList.add("PostImg")
            img.src = PostData.Image
            let divimg = NanoXBuild.DivFlexRowSpaceBetween(null, "", "padding: 0.4rem;")
            divimg.classList.add("PostDivImg")
            divimg.appendChild(img)
            DivDescription.appendChild(divimg)
        }

        return conteneur
    }
}