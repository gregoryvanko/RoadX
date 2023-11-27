class ClassPost{
    constructor(){}

    static Render (PostData) {
        // Conteneur du post
        const conteneur = NanoXBuild.DivFlexColumn("ConteneurPost", "ConteneurPost", "")
        // Description
        const DivDescription = NanoXBuild.Div(null, null, "width:100%")
        conteneur.appendChild(DivDescription)
        // Titre
        const DivTitre = NanoXBuild.DivFlexRowSpaceBetween(null, "ConteneurTitre", null)
        DivTitre.appendChild(NanoXBuild.DivText(PostData.Titre, null, "PostTitre", null))
        DivDescription.appendChild(DivTitre)
        // Date
        const DivDate = NanoXBuild.DivFlexRowSpaceBetween(null, "ConteneurInfo", null)
        DivDate.appendChild(NanoXBuild.DivText(PostData.Date, null, "PostInfo", null))
        DivDescription.appendChild(DivDate)
        // Description
        if(PostData.Description != ""){
            const DivDesc = NanoXBuild.DivFlexRowSpaceBetween(null, "ConteneurInfo", null)
            DivDesc.appendChild(NanoXBuild.DivText(PostData.Description, null, "PostInfo", null))
            DivDescription.appendChild(DivDesc)
        }

        return conteneur
    }
}