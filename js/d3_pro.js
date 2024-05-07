// proportional symbol map with d3

var attrArray = ["Scientific Name","Common Name", "Where Listed", "Region",	"ESA Listing Status", "Group", "State"];
var expressed = attrArray[0]; //initial attribute

//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){

    //map frame dimensions
    var width = 900,
        height = 600;

    //create new svg container for the map
    var map = d3.select("body") //select document's body
        .append("svg") //create and append a new svg element to it
        .attr("class", "map") //set class attribute match to map
        .attr("width", width) //give the svg width
        .attr("height", height); //give the svg height

    //create Albers equal area conic projection centered on France
    var projection = d3.geoAlbersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);
    
    var path = d3.geoPath() //path generator
        .projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];    
    promises.push(d3.csv("data/species_az.csv")); //load attributes from csv    
    promises.push(d3.json("data/countries.topojson")); //load background spatial data    
    promises.push(d3.json("data/states.topojson")); //load choropleth spatial data    
    Promise.all(promises).then(callback);

    function callback(data){    
        csvData = data[0];    
        countries = data[1];   
        states = data[2]; 

        // Translate TopoJSON to GeoJSON
        var worldCountries = topojson.feature(countries, countries.objects.world_administrative_boundaries),
            usStates = topojson.feature(states, states.objects.ne_110m_admin_1_states_provinces).features;
        
            
        //add countries to map
        var country = map.append("path")
            .datum(worldCountries)
            .attr("class", "countries")
            .attr("d", path);

        //create the color scale
        var colorScale = makeColorScale(csvData);
        
        //add enumeration units to the map
        setEnumerationUnits(usStates, map, path, colorScale);

        
        // Event listener for state clicks
        map.selectAll(".regions") // Select all states on the map
            .data(usStates)
            var selection = map.selectAll(".regions");
            selection.data(usStates);


            selection.on("mouseover", function(event,d) {
                var d = d3.select(this).datum(); // This retrieves the data bound to the clicked element.
                console.log("currentState", d);
            
                if (d && d.properties && d.properties.adm1_code) {
                    var currentState = d.properties.adm1_code;
                    var speciesInState = csvData.filter(function(row) {
                        return row.adm1_code === currentState;
                    });
                    console.log(currentState);
                    displayPopup(event,speciesInState);
                } else {
                    console.log("Data or properties are missing from this element");
                }
                event.stopPropagation();
                displayPopup(event,d.properties);
            }); 
            
            selection.on("mouseout", function(event,d){
                const popups = document.querySelectorAll('.popup');
                                    popups. forEach(popup => {
                                        popup.remove();
                                    });
            });
    };
};

function setGraticule(map, path){
    //create graticule generator
    var graticule = d3.geoGraticule()
        .step([10, 10]); //place graticule lines every 5 degrees of longitude and latitude

    //create graticule background
    var gratBackground = map.append("path")
        .datum(graticule.outline()) //bind graticule background
        .attr("class", "gratBackground") //assign class for styling
        .attr("d", path) //project graticule

    //create graticule lines
    var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
        .data(graticule.lines()) //bind graticule lines to each element to be created
        .enter() //create an element for each datum
        .append("path") //append each element to the svg as a path element
        .attr("class", "gratLines") //assign class for styling
        .attr("d", path); //project graticule lines
};

function setEnumerationUnits(usStates, map, path, colorScale){
    //add states to map
    var state = map.selectAll(".regions")
        .data(usStates)
        .enter()
        .append("path")
        .attr("class", function(d){
            return "regions " + d.properties.adm1_code;
        })
        .attr("d", path)        
        .style("fill", function(d){            
            var value = d.properties[expressed];            
            if(value) {                
                return colorScale(d.properties[expressed]);            
            } else {                
                return "#ccc";            
            }    
        })
        .on("mouseover", function(event, d) {
            highlight(d.properties);
        })
        .on("mouseout", function(event, d) {
            dehighlight(d.properties);
        })
        
    var desc = state.append("desc")
        .text('{"stroke": "#000", "stroke-width": "0.5px"}')

    //console.log(state);
};
 
//function to create color scale generator
function makeColorScale(data){
    var colorClasses = [
        "#edf8fb",
        "#b3cde3",
        "#8c96c6",
        "#8856a7",
        "#810f7c"
    ];

    //create color scale generator
    var colorScale = d3.scaleQuantile()
        .range(colorClasses);

    //build array of all values of the expressed attribute
    var domainArray = [];
    for (var i=0; i<data.length; i++){
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };

    //assign array of expressed values as scale domain
    colorScale.domain(domainArray);

    return colorScale;
};

//function to highlight enumeration units and bars
function highlight(props){
    //change stroke
    var selected = d3.selectAll("." + props.adm1_code)
        .style("stroke", "blue")
        .style("stroke-width", "2");
};

//function to reset the element style on mouseout
function dehighlight(props){
    var selected = d3.selectAll("." + props.adm1_code)
        .style("stroke", function(){
            return getStyle(this, "stroke")
        })
        .style("stroke-width", function(){
            return getStyle(this, "stroke-width")
        });

    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };

    //remove info label
    d3.select(".infolabel").remove();
};

// Function to display a pop-up with species information
function displayPopup(event, speciesInState) {

    // Create a div for the pop-up
    var popup = d3.select("body").append("div")
        .attr("class", "popup")
        .style("display", "block");

    // Display the scientific names of species in the pop-up
    var paragraphs = popup.selectAll("p")
        .data(speciesInState)
        .enter()
        .append("p")
        .text(function(d) {
            return d["Scientific Name"] ? d["Scientific Name"] : "No scientific name available";
        });

    console.log("Paragraphs added:", paragraphs.size());

    // Adjust popup position, adding a bit more space if needed
    var xPosition = event.pageX + 10;
    var yPosition = event.pageY - 10;

    popup.style("left", xPosition + "px")
        .style("top", yPosition + "px");

    console.log("Popup positioned at:", xPosition, yPosition); 
    
    //d3.selectAll(".state").on("mouseover", function(event, data) {
        //const stateId = d3.select(this).attr("id"); // or any other unique identifier
       // displayPopup(event, data, stateId);
   // });   
}

//add function to show attribute on the right panel
/*function updatePanel(properties) {
    var panel = d3.select("#panel");
    panel.html("");  // Clear the panel first

    // Check if properties are available
    if (properties) {
        // Dynamically create a list of attributes from the properties
        Object.keys(properties).forEach(function(key) {
            if (key !== "Scientific Name") {  // Skip the Scientific Name as it's shown in the popup
                var value = properties[key];
                panel.append("p")
                     .html(`<strong>${key}:</strong> ${value || "No data available"}`);
            }
        });
    } else {
        panel.append("p").text("No information available.");
    }
}

    // Add event listener to each state path
    map.selectAll(".state").on("click", function(event, d) {
        // Display the popup for the Scientific Name
        displayPopup(event, d.properties['Scientific Name']);

        // Update the panel with the rest of the attributes
        updatePanel(d.properties);
    });
console.log(map);*/

