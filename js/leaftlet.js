// main leaflet map 
//declare global variables
var map;
var dataStats = {};
var minRadius = 5;
var textContent;

//declare popupContent constructor function
function PopupContent(properties, attribute) {
	this.properties = properties;
	this.attribute = attribute;
	this.year = attribute.split("_")[1];
	this.rate = this.properties[attribute];
	this.formatted = "<p><b>state:</b> " + this.properties.state + "</p><p><b>Unemployment Rate in " + this.year + ":</b> " + this.rate + " % </p>";
};

//create leaflet map
function createMap() {
	//create the map
	map = L.map('map', {
		center: [0, 0],
		zoom: 2
	});

	//add OSM base tilelayer
	L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
	}).addTo(map);

	//call getData function
	getData(map);
};

//import GeoJSON data
function getData(map) {

	//load the data
	fetch("data/Rate.geojson")
		.then(function (response) {
			return response.json();
		})
		.then(function (json) {
			//calling the calculating function
			calcStats(json);

			//create an attributes array
			var attributes = processData(json);

			createSequenceControls(attributes);
			createPropSymbols(json, attributes);
			createLegend(attributes);
		})
};

//create prop symbols
function createPropSymbols(data, attributes) {
	//create a Leaflet GeoJSON layer and add it to the map
	L.geoJson(data, {
		pointToLayer: function (feature, latlng) {
			return pointToLayer(feature, latlng, attributes);
		}
	}).addTo(map);
};

var textControlAdded = false;

//convert markers to circle markers
function pointToLayer(feature, latlng, attributes) {


	//assign the current attribute based on the first index of the attributes array
	var attribute = attributes[0];

	//create marker options
	var options = {
		fillColor: "#a1d99b",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};

	//for each feature, determine its value for the selected attribute
	var attValue = Number(feature.properties[attribute]);

	//Give each feature's circle marker a radius based on its attribute value
	options.radius = calcPropRadius(attValue);

	if (attributes.indexOf(attribute) === 0) {
        // Only add the text control if it hasn't been added before
        if (!textControlAdded) {
            var TextControl = L.Control.extend({
                options: {
                    position: 'topleft'
                },
                onAdd: function(map) {
                    var container = L.DomUtil.create('div');
                    var p = document.createElement('p');
                    p.id = "myParagraph";
					p.className = 'map-text-content';
                    p.textContent = 'In year 2009, which is the first year after the The Global Economic Crisis.';
                    container.appendChild(p);
                    return container;
                }
            });
            
            map.addControl(new TextControl());
            textControlAdded = true; // Set the flag so it's not added again
        } else {
            // If the control has already been added, ensure it's visible
            var elem = document.getElementById("myParagraph");
            if (elem) {
                elem.style.display = 'block';
            }
        }
    } else {
        // Hide the text control if we're not on the first attribute
        var elem = document.getElementById("myParagraph");
        if (elem) {
            elem.style.display = 'none';
        }
    }


	//create circle marker layer
	var layer = L.circleMarker(latlng, options);

	//create popup content - object version	  
	var popupContent = new PopupContent(feature.properties, attribute);
	layer.bindPopup(popupContent.formatted, { offset: new L.Point(0, -options.radius) });


	//return the circle marker to the L.geoJson pointToLayer option
	return layer;

};

// This function toggles the TextControl based on the attribute index
function toggleTextControl(map, index) {
    // Select the TextControl if it exists
    var textControl = document.getElementById('myParagraph');
    // If we're showing the first attribute and the TextControl doesn't exist, create and add it
    if (index === 0 && !textControl) {
        textControl = L.DomUtil.create('p', 'map-text-content');
        textControl.id = 'myParagraph';
        textControl.textContent = 'In year 2009, which is the first year after the Global Economic Crisis,';
        map.getContainer().appendChild(textControl);
    } else if (index !== 0 && textControl) {
        // If we're not showing the first attribute and the TextControl exists, remove it
        textControl.parentNode.removeChild(textControl);
    }
};

//create new sequence controls
function createSequenceControls(attributes) {

	//define sequence control
	var SequenceControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},

		onAdd: function () {
			// create the control container div with a particular class name
			var container = L.DomUtil.create('div', 'sequence-control-container');

			//create range input element (slider)
			container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')

			//add skip buttons
			container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><img src="lib/leaflet/images/reverse.png"></button>');
			container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><img src="lib/leaflet/images/forward.png"></button>');

			//disable any mouse event listeners for the container
			L.DomEvent.disableClickPropagation(container);

			return container;
		}
	});

	//add sequence control
	map.addControl(new SequenceControl());

	//set slider attributes
	document.querySelector(".range-slider").max = 13;
	document.querySelector(".range-slider").min = 0;
	document.querySelector(".range-slider").value = 0;
	document.querySelector(".range-slider").step = 1;

	//input listener for slider
	document.querySelector('.range-slider').addEventListener('input', function () {
		//get the new index value
		var index = this.value;
		toggleTextControl(map,index);

		//pass new attribute to update symbols
		updatePropSymbols(attributes[index]);
	});

	//click listener for buttons
	document.querySelectorAll('.step').forEach(function (step) {
		step.addEventListener("click", function () {
			var index = document.querySelector('.range-slider').value;

			//increment or decrement depending on button clicked
			if (step.id == 'forward') {
				index++;
				//if past the last attribute, wrap around to first attribute
				index = index > 13 ? 0 : index;
			} else if (step.id == 'reverse') {
				index--;
				//if past the first attribute, wrap around to last attribute
				index = index < 0 ? 13 : index;
			};

			//update slider
			document.querySelector('.range-slider').value = index;
			toggleTextControl(map, index)

			//pass new attribute to update symbols
			updatePropSymbols(attributes[index]);
		})
	})
};

//resize proportional symbols according to new attribute values
function updatePropSymbols(attribute) {

	map.eachLayer(function (layer) {
		if (layer.feature && layer.feature.properties[attribute]) {
			//access feature properties
			var props = layer.feature.properties;

			//update each feature's radius based on new attribute values
			var radius = calcPropRadius(props[attribute]);
			layer.setRadius(radius);

			var radius = calcPropRadius(props[attribute]);
			layer.setRadius(radius);

			//createpopup content - object version
			var popupContent = new PopupContent(props, attribute);
			popup = layer.getPopup();
			popup.setContent(popupContent.formatted).update();
		};
	});

	updateLegend(attribute);
};

//create the temporal legend
function createLegend(attributes) {

	var LegendControl = L.Control.extend({
		options: {
			position: 'bottomright'
		},

		onAdd: function () {
			// create the control container with a particular class name
			var container = L.DomUtil.create('div', 'legend-control-container');

			container.innerHTML = '<h3 class="temporalLegend">Unemployment Rate in <span class="year">2009</span></h3>';

			//start attribute legend svg string
			var svg = '<svg id="attribute-legend" width="130px" height="80px">';

			//array of circle names to base loop on
			var circles = ["max", "mean", "min"];

			//loop to add each circle and text to svg string  
			for (var i = 0; i < circles.length; i++) {

				//assign the r and cy attributes  
				var radius = calcPropRadius(dataStats[circles[i]]);
				var cy = 65 - radius;

				//circle string  
				svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#a1d99b" fill-opacity="0.8" stroke="#000000" cx="38"/>';

				//create legend text to label each circle     				          
				var textY = i * 22 + 15;
				svg += '<text id="' + circles[i] + '-text" x="70" y="' + textY + '">' + Math.round(dataStats[circles[i]] * 100) / 100 + " % " + '</text>';

			};
			//close the svg
			svg += "</svg>";
			

            //add attribute legend svg to container
			container.insertAdjacentHTML('beforeend', svg);

			return container;
		}
	});

	map.addControl(new LegendControl());
};

//update legend
function updateLegend(attribute) {
	//create content for legend
	var year = attribute.split("_")[1];

	//replace legend content
	document.querySelector("span.year").innerHTML = year;

	var allValues = [];
	map.eachLayer(function (layer) {
		if (layer.feature) {
			allValues.push(layer.feature.properties[attribute]);
		}
	});

	var circleValues = {
		min: Math.min(...allValues),
		max: Math.max(...allValues),
		mean: allValues.reduce(function (a, b) { return a + b; }) / allValues.length
	}

	for (var key in circleValues) {
		var radius = calcPropRadius(circleValues[key]);
		document.querySelector("#" + key).setAttribute("cy", 65 - radius);
		document.querySelector("#" + key).setAttribute("r", radius)
		document.querySelector("#" + key + "-text").textContent = Math.round(circleValues[key] * 100) / 100 + " % ";
	}
}

//caltulate the stats value of given array
function calcStats(data) {
	//create empty array to store all data values
	var allValues = [];
	//loop through each city
	for (var city of data.features) {
		//loop through each year
		for (var year = 2009; year <= 2022; year += 1) {
			//get population for current year
			var value = city.properties["Rate_" + String(year)];
			//add value to array
			allValues.push(value);
		}
	}
	//get min, max, mean stats for our array
	dataStats.min = Math.min(...allValues);
	dataStats.max = Math.max(...allValues);

	//calculate meanValue
	var sum = allValues.reduce(function (a, b) { return a + b; });
	dataStats.mean = sum / allValues.length;
}

//build an attributes array from the data
function processData(data) {
	//empty array to hold attributes
	var attributes = [];

	//properties of the first feature in the dataset
	var properties = data.features[0].properties;

	//push each attribute name into attributes array
	for (var attribute in properties) {
		//only take attributes with population values
		if (attribute.indexOf("Rate") > -1) {
			attributes.push(attribute);
		};
	};

	return attributes;
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {

	//Flannery Appearance Compensation formula
	var radius = 1.0083 * Math.pow(attValue / dataStats.min, 0.5715) * minRadius

	return radius;
};

//main entrance
document.addEventListener('DOMContentLoaded', createMap);
