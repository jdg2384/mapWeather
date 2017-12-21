mapboxgl.accessToken = 'pk.eyJ1IjoiamRnMjM4NCIsImEiOiJjajk3bDB2em0wMTM3MnhwYXpndjR5azluIn0.rF-lTJv--A2S4vQFUaGwAQ';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/outdoors-v9',
    center: [-105.26974497642829, 40.01359304820019], // starting position
    zoom: 9 // starting zoom
});
// Map Box on click getting lat & lng
map.on('click', function (e) {
    event.preventDefault();
    document.getElementById('info').innerHTML =
    JSON.stringify(e.point) + '<br />' +
    JSON.stringify(e.lngLat);
    console.log(e.lngLat.lat , e.lngLat.lng);

    $( document ).ready(function() {
        // Multiple API Urls
        var sliceLat = e.lngLat.lat + .1
        var sliceLng = e.lngLat.lng + .1

        //console.log('slice lat ', sliceLat, 'slice long', sliceLng);
        var dSkyapi = $.ajax(`/api/weather/${e.lngLat.lat},${e.lngLat.lng}`)
            flickrApi = $.ajax(`/api/flickrurl/${e.lngLat.lng}%2C${e.lngLat.lat} %2C${sliceLng}%2C${sliceLat}&format=json&nojsoncallback=1accuracy=1`);
        //console.log(flickrApi)
        var pictureArray =[]; 

        $.when(dSkyapi,flickrApi).done(function(apiOne,apiTwo) {
            
            let objOne = JSON.parse(apiOne[0].data);
            let objTwo = JSON.parse(apiTwo[0].data);
            var pictureArray =[];
            var highTemp = ['High']
            var minTemp = ['Low']
            console.log(objOne)
            for(var i =0; i< 8; i++){
                // Dark Sky objects
                highTemp.push(objOne.daily.data[i].apparentTemperatureMax)
                minTemp.push(objOne.daily.data[i].apparentTemperatureMin)
                var currentTemp = objOne.daily.data[0].apparentTemperatureMax
                var summary = objOne.daily.data[i].summary
                console.log(summary)
                //console.log(summary)
                // Flicker objects
                var farm = objTwo.photos.photo[i].farm;
                var id = objTwo.photos.photo[i].id;
                var server = objTwo.photos.photo[i].server;
                var secret = objTwo.photos.photo[i].secret;
                pictureArray.push('http://farm'+farm+'.static.flickr.com/'+server+'/'+id+'_'+secret+'_c.jpg');
            }
            for(var i =0; i<pictureArray.length;i++){
                $("#placesPictures" ).append(`<div class="col-md-3"><img class="flickrPhoto img-responsive" style="height:300px;width:100%;" src=${pictureArray[i]}></div>`);
            }
            // Temp High low chart
            var chart = c3.generate({
                data: {
                    columns: [
                        highTemp,
                        minTemp
                    ]
                },
                axis: {
                    y: {
                        max: 124,
                        min: -50,
                    }
                },
                bindto: '#chart'
            });
            // Temp High low chart
            $("#weather").append('Current Tempature');
            var chart = c3.generate({
                data: {
                    columns: [
                        ['data', currentTemp]
                    ],
                    type: 'gauge',
                    onclick: function (d, i) { console.log("onclick", d, i); },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                },
                gauge: {
                    label: {
                        format: function(value, ratio) {
                            return value;
                        },
                        show: false // to turn off the min/max labels.
                    },
                min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                max: 100, // 100 is default
                units: ' %',
                width: 39 // for adjusting arc thickness
                },
                color: {
                    pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                    threshold: {
            //            unit: 'value', // percentage is default
            //            max: 200, // 100 is default
                        values: [30, 60, 90, 100]
                    }
                },
                size: {
                    height: 180
                },
                bindto: '#chartTwo'
            });
        });
    });
});
map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));


