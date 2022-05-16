
var kenya = {
    bounds: [[5.4455, 33.7809], [-5.0141, 41.6936]],
    boundary: {
        population: {
            url: "maps/population.png",
            bound: [[5.92760, 30.05425], [-5.176811362, 45.722386033]],
            alt: 'Kenya Population',
            bounds: [[5.416275775, 33.909330246], [-4.705416000, 41.905583473]]
        },
        roads: {
            url: "maps/roads.png",
            bound: [[5.92760, 30.05425], [-5.176811362, 45.722386033]],
            alt: 'Roads',
            bounds: [[5.416275775, 33.909330246], [-4.705416000, 41.905583473]]
        },
        urban: {
            url: "maps/urbanareas.png",
            bound: [[5.92760, 30.05425], [-5.176811362, 45.722386033]],
            alt: 'Urban Centers',
            bounds: [[5.416275775, 33.909330246], [-4.705416000, 41.905583473]]
        },
        counties: {
            url: "maps/counties.png",
            bound: [[5.92760, 30.05425], [-5.176811362, 45.722386033]],
            alt: 'Kenya Counties',
            bounds: [[5.416275775, 33.909330246], [-4.705416000, 41.905583473]]
        }
    },
    counties: {
        meru: {
            alt: 'kenya',
            bound: [[0.65243, 37.09200], [-0.2171, 38.4215]],
            bounds: [[0.820729, 36.965533], [-0.282641592, 38.523077233]],
            population: 1545714,
            ruralPopulation: 1360000,
            ruralPopulationBuffer: 850000,
            urls: {
                pupulationUrl: {
                    url: "population.jpg"
                },
                ruralPopulationUrl: {
                    url: "ruralpopulation.jpg"
                },
                roadsUrl: {
                    url: "roads.jpg"
                },
                goodroadsUrl: {
                    url: "goodroads.jpg"
                },
                roadsBuffer: {
                    url: "roadsbuffer.jpg"
                },
                roadsBufferExcludeUrban: {
                    url: "roadsbufferurban.jpg"
                },
                roadsBufferPopulation: {
                    url: "bufferpopulation.jpg"
                }
            }
        }
    }

};

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var noBase = L.tileLayer('', {
    attribution: "Kenya Roads Board"
});

var kenyaMap = L.imageOverlay(kenya.boundary.population.url, L.latLngBounds(kenya.boundary.population.bound), {
    opacity: 0.6,
    alt: kenya.boundary.population.alt,
    interactive: true
});

var map = L.map('map', {
    center: [0, 36],
    zoom: 10,
    layers: [noBase, kenyaMap]
});
kenyaMap.on('load', () => {
    map.fitBounds(L.latLngBounds(kenya.bounds));
});

var base = {
    'OSM': OpenStreetMap_Mapnik,
    'No Base': noBase,
}

var overlay = {
    'Kenya': kenyaMap,
}

var layerControl = L.control.layers(base,
    overlay).addTo(map);

map.on('click', () => {
    //try to change url here
})

var pixelTop = 0;
function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

if (getWidth() > 720) {
    pixelTop = -400;
}
else {
    pixelTop = -100;
}

window.addEventListener('resize', () => {
    location.reload();
});

//hadnle scroll in side bar
var scrollDiv = document.getElementById('scroll');
var pixelsSet = false;
/*var infoContent = document.querySelector('div.info-content');
var infoChilds = infoContent.children;
console.log(infoChilds.length);*/
var infoChilds = document.querySelectorAll('.content-item');
for (var i = 0; i < infoChilds.length; i++) {
    //if (infoChilds[i].classList.contains("content-item")) {
    var pixelTop = infoChilds[i].offsetHeight + pixelTop;
    infoChilds[i].setAttribute("pixels", pixelTop);
    //}
}


scrollDiv.addEventListener('scroll', (e) => {
    var currentPosition = scrollDiv.scrollTop;
    //calcuate pixel above each div
    for (var i = 0; i < infoChilds.length; i++) {

        if (infoChilds[i].classList.contains('counties')) {
            if (currentPosition >= infoChilds[i].getAttribute("pixels")
                //&& currentPosition < infoChilds[i + 1].getAttribute("pixels")
                && !infoChilds[i].classList.contains('active') && county.length > 0) {
                //reset active
                resetActive();
                //mark new active
                infoChilds[i].classList.add("active");
                var mapImage = kenya.counties[county].urls;
                var ki = 4;
                Object.keys(mapImage).forEach(function (k) {
                    if (i == ki) {
                        switchMap("maps/counties/" + county + "/" + mapImage[k].url, currentPosition);
                    }
                    ki++;
                });

            }
        }
        else {
            if (currentPosition >= infoChilds[i].getAttribute("pixels")
                //&& currentPosition < infoChilds[i + 1].getAttribute("pixels")
                && !infoChilds[i].classList.contains('active')) {
                //reset active
                resetActive();
                //mark new active
                infoChilds[i].classList.add("active");
                //
                var mapImage = kenya.boundary;
                var ki = 0;
                Object.keys(mapImage).forEach(function (k) {
                    //console.log(k);
                    if (i == ki) {
                        switchMap(mapImage[k].url, currentPosition);
                    }
                    ki++;
                });

            }
        }
    }
})

function resetActive() {
    var bbox = document.querySelectorAll('.content-item');
    bbox.forEach(box => {
        box.classList.remove('active');
    });
}

var boundsSetN = false;
var boundsSetC = false;
var mapBounds;
function switchMap(url, currentPosition) {

    kenyaMap.setUrl(url);
    /*
    var pos = document.getElementById('firstCountyItem').getAttribute('pixels');
    console.log(currentPosition + " -- " + pos);
    if (pos < currentPosition && county.length > 0) {
        console.log("bigger");
        if (!boundsSetC) {
            mapBounds = L.latLngBounds(kenya.counties[county].bounds);
        }
        kenyaMap.setBounds(mapBounds)
        map.fitBounds(mapBounds);
    }
    else {
        console.log("a miss");
        if (!boundsSetN) {
            mapBounds = L.latLngBounds(kenya.boundary.population.bound);
        }
        kenyaMap.setBounds(mapBounds)
        map.fitBounds(mapBounds);
    }*/

}
var county = "";
var county_name = document.getElementById("county_name");
var county_change = document.getElementById("county_change");
var countyScroll = document.getElementById("countyname");
var popsScroll = document.getElementById("populationVal");
var popsRuralScroll = document.getElementById("ruralpopulation");
var finalRuralPopScroll = document.getElementById("finalpupulation");
var raicountyScroll = document.getElementById("ruralaccessindexcounty");
var raiScroll = document.getElementById("ruralaccessindex");
county_change.addEventListener("change", (event) => {
    county = event.target.value;
    county_name.innerHTML = county;
    countyScroll.innerHTML = county;
    popsScroll.innerHTML = kenya.counties.meru.population;
    popsRuralScroll.innerHTML = kenya.counties.meru.ruralPopulation;
    finalRuralPopScroll.innerHTML = kenya.counties.meru.ruralPopulationBuffer;
    raiScroll.innerHTML = (kenya.counties.meru.ruralPopulationBuffer / kenya.counties.meru.ruralPopulation) * 100;
    raicountyScroll.innerHTML = county;
    var counties = document.querySelectorAll('.counties');
    counties.forEach(box => {
        if (county.length > 0) {
            box.classList.remove('display-none');
        }
        else {
            box.classList.add('display-none');
        }
        // box.classList.add('small');
    });
});


window.addEventListener("load", () => {
    var counties = document.querySelectorAll('.counties');
    counties.forEach(box => {
        box.classList.add('display-none');
        // box.classList.add('small');
    });
});
