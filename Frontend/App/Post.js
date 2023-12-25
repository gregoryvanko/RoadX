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
        // Date and owner
        const DivDate = NanoXBuild.DivFlexRowStart(null, "ConteneurInfo TextSmall PostInfoTextColor", null)
        DivDescription.appendChild(DivDate)
        DivDate.appendChild(NanoXBuild.DivText(new Date(PostData.Date).toLocaleDateString(), null, null, null))
        DivDate.appendChild(NanoXBuild.DivText(PostData.Owner, null, null, "margin-left:0.5rem;"))
        // Description
        if(PostData.Description != ""){
            const DivDesc = NanoXBuild.Div(null, "ConteneurInfo PostInfoTextColor Text", null)
            DivDesc.appendChild(NanoXBuild.DivText(PostData.Description, null, null, null))
            DivDescription.appendChild(DivDesc)
        }
        // Image and info data
        if (PostData.Image){
            let divimg = NanoXBuild.Div(null, "", "position: relative; padding: 0.4rem;")
            DivDescription.appendChild(divimg)
            // Image du post
            let img = document.createElement('img');
            img.classList.add("PostImg")
            img.src = PostData.Image
            divimg.appendChild(img)
            // Data of track
            let divdata = NanoXBuild.Div(null, "DivBlackTransparent DivPostData", "")
            divimg.appendChild(divdata)
            // Data dist
            let DivDistData = NanoXBuild.Div(null, "DivPostDataInfo TextSmallSmall", "")
            divdata.appendChild(DivDistData)
            let DivDist = NanoXBuild.DivText("Distance", null, "", null)
            DivDistData.appendChild(DivDist)
            let DivDistVal = NanoXBuild.DivText(PostData.Length.toFixed(1) + " Km", null, "", "margin-top:0.2rem")
            DivDistData.appendChild(DivDistVal)
            // Line
            let line1 = document.createElement("div")
            line1.setAttribute("Style", "border-left: 2px solid #dfdfe8; height: 2rem; float: left;")
            divdata.appendChild(line1)
            // Data cumulP
            let DivCumulPData = NanoXBuild.Div(null, "DivPostDataInfo TextSmallSmall", "")
            divdata.appendChild(DivCumulPData)
            let DivCumulP = NanoXBuild.DivText("Cumul +", null, "", null)
            DivCumulPData.appendChild(DivCumulP)
            let DivCumulPVal = NanoXBuild.DivText(PostData.InfoElevation.ElevCumulP + " m", null, "", "margin-top:0.2rem")
            DivCumulPData.appendChild(DivCumulPVal)
            // Line
            let line2 = document.createElement("div")
            line2.setAttribute("Style", "border-left: 2px solid #dfdfe8; height: 2rem; float: left;")
            divdata.appendChild(line2)
            // Data cumulM
            let DivCumulMData = NanoXBuild.Div(null, "DivPostDataInfo TextSmallSmall", "")
            divdata.appendChild(DivCumulMData)
            let DivCumulM = NanoXBuild.DivText("Cumul -", null, "", null)
            DivCumulMData.appendChild(DivCumulM)
            let DivCumulMVal = NanoXBuild.DivText(PostData.InfoElevation.ElevCumulM + " m", null, "", "margin-top:0.2rem")
            DivCumulMData.appendChild(DivCumulMVal)
            
        }
        return conteneur
    }
}