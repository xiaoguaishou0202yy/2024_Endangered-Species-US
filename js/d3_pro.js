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

        console.log(csvData);

        //place graticule on the map
        setGraticule(map, path);

        // Translate TopoJSON to GeoJSON
        var worldCountries = topojson.feature(countries, countries.objects.world_administrative_boundaries),
            usStates = topojson.feature(states, states.objects.ne_110m_admin_1_states_provinces).features;

        console.log(worldCountries);
        //console.log(usStates);
       
        //join csv data to GeoJSON enumeration units
        usStates = joinData(usStates, csvData);

        console.log(usStates);
        
            
        //add Europe countries to map
        var country = map.append("path")
            .datum(worldCountries)
            .attr("class", "countries")
            .attr("d", path);

        //create the color scale
        var colorScale = makeColorScale(csvData);
        
        //add enumeration units to the map
        setEnumerationUnits(usStates, map, path, colorScale);


        // Add click event listener to each state
        map.selectAll(".regions")
            .on("click", function(d) {
                console.log(usStates)
                displaySpeciesList(d.properties.name);
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

function joinData(usStates, csvData){
    //loop through csv to assign each set of csv attribute values to geojson region
    for (var i=0; i<csvData.length; i++){
        var csvRegion = csvData[i]; //the current region
        var csvKey = csvRegion.adm1_code; //the CSV primary key

        //loop through geojson regions to find correct region
        for (var a=0; a<usStates.length; a++){

            var geojsonProps = usStates[a].properties; //the current region geojson properties
            var geojsonKey = geojsonProps.adm1_code; //the geojson primary key

            //where primary keys match, transfer csv data to geojson properties object
            if (geojsonKey == csvKey){

                //assign all attributes and values
                attrArray.forEach(function(attr){
                    var val = parseFloat(csvRegion[attr]); //get csv attribute value
                    geojsonProps[attr] = val; //assign attribute and value to geojson properties
                });
            };
        };
    };
    return usStates;
};

function setEnumerationUnits(usStates, map, path, colorScale){
    //add France regions to map
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
        
    var desc = state.append("desc")
        .text('{"stroke": "#000", "stroke-width": "0.5px"}')

    console.log(state);
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


// Function to display species list based on clicked state
function displaySpeciesList(clickedState) {
    // Filter species data based on the clicked state
    var speciesInState = usStates.filter(function(d) {
        return d.State === clickedState;
    });

    // Extract Scientific Names from filtered data
    var scientificNames = speciesInState.map(function(d) {
        return d["Scientific Name"];
    });

    // Remove duplicate Scientific Names
    scientificNames = scientificNames.filter(function(item, pos) {
        return scientificNames.indexOf(item) === pos;
    });

    // Display the list of Scientific Names
    var speciesList = d3.select("#speciesList");
    speciesList.html(""); // Clear previous list
    speciesList.append("h3").text("Species in " + clickedState);
    var list = speciesList.append("ul");
    scientificNames.forEach(function(species) {
        list.append("li").text(species);
    });
}

