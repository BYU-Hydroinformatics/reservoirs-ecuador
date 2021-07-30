
var map = L.map('mapid', {
    zoom: 8.25,
    minZoom: 1.25,
    boxZoom: true,
    maxBounds: L.latLngBounds(L.latLng(-100.0,-270.0), L.latLng(100.0, 270.0)),
    center: [19, -70.6],
});


var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var Esri_Imagery_Labels = L.esri.basemapLayer('ImageryLabels');
basemaps = {"Basemap": L.layerGroup([Esri_WorldImagery, Esri_Imagery_Labels]).addTo(map)}


var GetSitesNow = function(){
    $.ajax({
        type: "GET",
        url: "getMySites/",
        dataType: "JSON",

        success: function(result) {

            var mySites = result.siteInfo;
            const myGoodSites = [];

//           console.log(mySites);

            for(var i=0; i< mySites.length; ++i){
                if (mySites[i]['sitename'].includes("Presa") || mySites[i]['sitename'].includes("presa")) {
                    myGoodSites.push(mySites[i]);
                }}

            for(var i=0; i< myGoodSites.length; ++i){
                var markerLocation = new L.LatLng(myGoodSites[i]['latitude'], myGoodSites[i]['longitude']);
                marker = new L.Marker(markerLocation);
                marker.bindPopup(myGoodSites[i]['sitename']);
                map.addLayer(marker)
            }

            $("#variables").change(function() {

                let curres = $("#variables").val()
                id = curres

                if (id == "none") {
                    map.fitBounds(L.latLngBounds(L.latLng(20.178299, -72.084407), L.latLng(17.609021, -68.267347)))
                } else {
                    for (var i=0; i<myGoodSites.length; ++i) {
                        if (id == i) {
                            var markerLocation = new L.LatLng(myGoodSites[i-1]['latitude'], myGoodSites[i-1]['longitude']);
                            map.setView(markerLocation, 10);
                            marker = new L.Marker(markerLocation);
                            marker.bindPopup(myGoodSites[i]['sitename']);
                            marker.openPopup()

                        }
                    }
                }
            })
        }
    })
}
GetSitesNow();



function getValues() {

    let site_full_code = $("#variables").val();
    let fsc = {
        full_code: site_full_code
    }

    $.ajax({
        type: "GET",
        url: "GetValues",
        dataType: "JSON",
        data: fsc,

        success: function(result) {
            var values = result.myvalues;
            specific_values = values[0]['values'];
            sitename = values[0]['values'][0]['siteName']
            const mydatavalues = [];

            for(var i=0; i<specific_values.length; ++i){
                mydatavalues.push(specific_values[i]['dataValue']);
            }

//is this time series cumulative? for all of the time ever? is there also the whisker plot included?

        $("#mytimeseries").html(`<h2>${sitename}</h2>
                            <p>
                            <div>${mydatavalues}</div>`)

        }
    })
}

function getSiteInfo() {

    let full_site_code = $("#variables").val();
    let fsc = {
      full_code: full_site_code
    }

    $.ajax({
    type: "GET",
    url: "GetSiteInfo/",
    dataType: "JSON",
    data: fsc,

    success: function(result) {
        var myInfo = result.siteInfo;
        const myOtherSites = [];

        for(var i=0; i< myInfo.length; ++i){
            if (myInfo[i]['siteInfo'][0]['siteName'].includes("Presa") || myInfo[i]['siteInfo'][0]['siteName'].includes("presa")) {
                myOtherSites.push(myInfo[i]);
            }
        }
        //console.log(myOtherSites);
        let myreservoir = $("#variables").val();

        for (var i=0; i<myOtherSites.length; ++i) {

            if (myreservoir == i) { break; }

                let MyGoodInfo = myOtherSites[i];

                var mysitename = MyGoodInfo.siteInfo[0].siteName;
                var sitecode = MyGoodInfo.siteInfo[0].siteCode;
                var citation = MyGoodInfo.siteInfo[0].citation;
                var description = MyGoodInfo.siteInfo[0].description;
                var variable = MyGoodInfo.siteInfo[0].variableName
        }
        //console.log(MyGoodInfo)

        $("#siteinfo").html(
            `<h1>${mysitename}</h1>
                <p>
            <div>Site Code: ${sitecode}</div>
                </p>
                <p>
            <div>Citation: ${citation}</div>
                </p>
            <div>${description}</div>
                <p>
            <div>${variable}
                </p>`);
        $("#obsgraph").find('.modal-header').text(mysitename);
    }

    })

}

function load_timeseries() {

    let myreservoir = $("#variables").val();

    if (myreservoir === 'none') {

        alert("You have not selected a reservoir");

    } else {
        $("#siteinfo").html('');
        $("#mytimeseries").html('');
        getSiteInfo();
        getValues();
        $("#obsgraph").modal('show');
    }
}

$("#timeseries").click(function() {
    load_timeseries();
})