class ViewOnePost{
    constructor(PostId = null, GoBackView = null){
        this._PostId = PostId
        this._GoBackView = GoBackView
        this._DivApp = NanoXGetDivApp()
        this._TextWaiting = NanoXBuild.DivText("Loading Post Data...", "textwaiting", null, "margin-top:2rem;")

        this._IdConteneurOnePostMap = "IdConteneurOnePostMap"
        this._IdMoreInfoData = "IdMoreInfoData"
        this._IdButtonMoreInfo = "IdButtonMoreInfo"

        this._MapOnePost = null
        this._GpsPointer = null
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
        // Titre
        box.appendChild(NanoXBuild.DivText(PostData.Name, null, "SousTitre", "height: 3rem; margin: auto; text-align: center; text-wrap: balance; display: flex; align-items: center;"))
        // Div OnePost
        box.appendChild(NanoXBuild.Div(this._IdConteneurOnePostMap, null, "flex-grow : 1; margin: 0.2rem;")) 
        // RenderMap
        let InitialMapData= {CenterPoint:{Lat:PostData.StartPoint.Lat, Long:PostData.StartPoint.Lng}, Zoom:8}
        this._MapOnePost = new GeoXMap(this._IdConteneurOnePostMap,InitialMapData) 
        this._MapOnePost.RenderMap()
        this._MapOnePost.AddTrackOnMap(PostData._id, PostData.GeoJson, true)
        // Box information
        let divinfo = NanoXBuild.Div(null, "DivBlackTransparent DivPostData", "width: 340px;")
        box.appendChild(divinfo)
        // Numerical data
        divinfo.appendChild(this.RenderNumericalData(PostData))
        // More info data
        divinfo.appendChild(this.RenderMoreInfoData(PostData))
        // Add More information Button
        divinfo.appendChild(this.AddButtonMoreInfo())
        // Elevation chart
        divinfo.appendChild(this.AddElevationGraph())
        this.RenderElevationGraph(PostData)
        

        console.log(PostData)
    }

    /**
     * Render all numerial data of post
     * @param {Object} PostData Data of one post
     */
    RenderNumericalData(PostData){
        // Box numerical data
        let divdatanumeric = NanoXBuild.Div(null, null, "display: flex; flex-direction: row; justify-content: center; align-content: center; align-items: center; lex-wrap: wrap;")
        // info : Distance
        let DivDistData = NanoXBuild.Div(null, "DivPostDataInfo TextSmall", "")
        divdatanumeric.appendChild(DivDistData)
        let DivDist = NanoXBuild.DivText("Distance", null, "", null)
        DivDistData.appendChild(DivDist)
        let DivDistVal = NanoXBuild.DivText(PostData.Length.toFixed(1) + " Km", null, "", "margin-top:0.2rem")
        DivDistData.appendChild(DivDistVal)
        let DivCumulPData = NanoXBuild.Div(null, "DivPostDataInfo TextSmall", "")
        divdatanumeric.appendChild(DivCumulPData)
        let DivCumulP = NanoXBuild.DivText("Cumul +", null, "", null)
        DivCumulPData.appendChild(DivCumulP)
        let DivCumulPVal = NanoXBuild.DivText(PostData.InfoElevation.ElevCumulP + " m", null, "", "margin-top:0.2rem")
        DivCumulPData.appendChild(DivCumulPVal)
        // Data cumulM
        let DivCumulMData = NanoXBuild.Div(null, "DivPostDataInfo TextSmall", "")
        divdatanumeric.appendChild(DivCumulMData)
        let DivCumulM = NanoXBuild.DivText("Cumul -", null, "", null)
        DivCumulMData.appendChild(DivCumulM)
        let DivCumulMVal = NanoXBuild.DivText(PostData.InfoElevation.ElevCumulM + " m", null, "", "margin-top:0.2rem")
        DivCumulMData.appendChild(DivCumulMVal)
        return divdatanumeric
    }

    /**
     * Build div and canvas for chart
     * @returns Div of the chart
     */
    AddElevationGraph(){
        let chartdiv = NanoXBuild.Div(null, null, "height: 16vh; width: 100%; margin-top: 0.2rem;")
        let canvas = document.createElement("canvas")
        canvas.setAttribute("id", "myChart")
        canvas.addEventListener ("mouseout", this.CanvansMouseOutEvent.bind(this), false);
        canvas.addEventListener('touchend', function (event) {
            if (event.target && event.target.tagName.toLowerCase() === "canvas") {
              canvas.dispatchEvent(new Event('mouseout'));
            }
        });
        chartdiv.appendChild(canvas)
        return chartdiv
    }

    /**
     * Render elevation graph of post
     * @param {Object} PostData Data of one post
     */
    RenderElevationGraph(PostData){
        let me = this
        let ctx = document.getElementById('myChart').getContext('2d')
        Chart.plugins.register ( {
            afterDatasetsDraw: function(chart) {
                let chart_type = chart.config.type;
                if (chart.tooltip._active && chart.tooltip._active.length && chart_type === 'scatter') {
                    let activePoint = chart.tooltip._active[0],
                    ctx = chart.chart.ctx,
                    x_axis = chart.scales['x-axis-1'],
                    y_axis = chart.scales['y-axis-1'],
                    x = activePoint.tooltipPosition().x,
                    topY = y_axis.top,
                    bottomY = y_axis.bottom;
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, topY+1);
                    ctx.lineTo(x, bottomY+1);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'red';
                    ctx.stroke();
                    ctx.restore();
           }
        }
        });
        this._scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    data: PostData.Elevation,
                    showLine: true,
                    fill: false,
                    borderColor: 'white',
                    pointRadius: 0
                }]
            },
            options: {
                animation: false,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                    display: false
                },
                tooltips: {
                    intersect: false,
                    mode: 'x-axis',
                    custom: function(tooltip) {
                        if (!tooltip) return;
                        // disable displaying the color box;
                        tooltip.displayColors = false;
                    },
                    callbacks: {
                      label: function(tooltipItem, data) {
                          me.DrawElevationPoint(PostData.Elevation[tooltipItem.index])
                          let x = "Distance: " + tooltipItem.label + "m"
                          let multistringText = [x]
                          let y = "Elevation: " + tooltipItem.value + "m"
                          multistringText.push(y);
                          return multistringText;
                      },
                      title: function(tooltipItem, data) {
                        return;
                      }
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            beginAtZero: true,
                            fontColor: "white",
                            callback: function(value, index, values) {
                                if (value >= 1000){
                                    return  value / 1000 + " Km"
                                } else {
                                    return value + ' m'
                                }
                            }
                        },
                        gridLines: {
                            zeroLineColor: 'white',
                            color: "white",
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontColor: "white",
                            stepSize: 10,
                            callback: function(value, index, values) {
                                return value + ' m'
                            }
                        },
                        gridLines: {
                            zeroLineColor: 'white',
                            color: "white",
                        }
                    }]
                }
            }
        });
    }

    CanvansMouseOutEvent(){
        if (this._GpsPointer){
            let map = this._MapOnePost.Map
            map.removeLayer(this._GpsPointer)
            this._GpsPointer = null
        }
    }

    DrawElevationPoint(ElevationPoint){
        let latlng = [ElevationPoint.coord.lat, ElevationPoint.coord.long]
        if (this._GpsPointer == null){
            let map = this._MapOnePost.Map
            this._GpsPointer = L.circleMarker([50.709446,4.543413], {radius: 8, weight:4,color: 'white', fillColor:'red', fillOpacity:1}).addTo(map)
        }
        this._GpsPointer.setLatLng(latlng)
    }

    RenderMoreInfoData(PostData){
        let divMoreInfo = NanoXBuild.Div(this._IdMoreInfoData, "TextSmall", "width: 100%; padding: 0 0.5rem; display: none;")
        // Div date and user
        let DivInfo1 = NanoXBuild.DivFlexRowSpaceBetween(null, null, "width: 100%;")
        divMoreInfo.appendChild(DivInfo1)
        DivInfo1.appendChild(NanoXBuild.DivText(new Date(PostData.Date).toLocaleDateString()))
        DivInfo1.appendChild(NanoXBuild.DivText(PostData.Owner))
        // Div Comment
        let DivInfo2 = NanoXBuild.DivFlexRowSpaceBetween(null, null, "width: 100%; margin-top: 0.2rem;")
        divMoreInfo.appendChild(DivInfo2)
        DivInfo2.appendChild(NanoXBuild.DivText(PostData.Description))
        return divMoreInfo
    }

    AddButtonMoreInfo(){
        let divbutton = NanoXBuild.Div(this._IdButtonMoreInfo, "Buttoninformation", null)
        divbutton.innerHTML = IconModule.Information("white")
        divbutton.onclick = this.ClickOnButtonMoreInfo.bind(this)
        return divbutton
    }

    ClickOnButtonMoreInfo(){
        let div = document.getElementById(this._IdMoreInfoData)
        if (div){
            if (div.style.display == "none"){
                div.style.display = "block"
                document.getElementById(this._IdButtonMoreInfo).innerHTML = "X"
            } else {
                div.style.display = "none"
                document.getElementById(this._IdButtonMoreInfo).innerHTML = IconModule.Information("white")
            }
        }
    }
}