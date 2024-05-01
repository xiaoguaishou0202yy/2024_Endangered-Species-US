// proportional symbol map with d3

var attrArray = ["Scientific Name","Common Name", "Where Listed", "Region",	"ESA Listing Status", "Group", "State"];


var expressed = attrArray[0]; //initial attribute

//chart frame dimensions
var chartWidth = window.innerWidth * 0.425,
    chartHeight = 680;
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

//create a scale to size bars proportionally to frame
var yScale = d3.scaleLinear()
   .range([670, 0])
   .domain([0, 500]);


//begin script when window loads
window.onload = setMap();



//set up choropleth map
function setMap(){

    //map frame dimensions
    var width = window.innerWidth * 0.5,
        height = 680;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    // Create the title element
    var pageTitle = document.createElement("h1");
    pageTitle.innerHTML = "Violent Crime Rate in the United States, 2022";
    pageTitle.classList.add("page-title"); // Add a class for styling

    // Create the introduction panel
    var introductionPanel = document.createElement("div");
    introductionPanel.innerHTML = "<p>Welcome to our interactive web app showcasing data on U.S. states and territories by violent crime rate in 2022. The data, sourced from the FBI's Uniform Crime Reports and compiled from Wikipedia, provides insights into the prevalence of violent crimes across different regions. Violent crime rates are typically expressed as incidents per 100,000 individuals per year. For example, a violent crime rate of 300 (per 100,000 inhabitants) in a population of 100,000 would signify 300 incidents of violent crime per year in that entire population, or 0.3% of the total.</p><p>Violent crimes encompass a range of offenses, including rape and sexual assault, robbery, assault, and murder. Through our app, you can explore the rates of these four types of violent crimes in each state, offering valuable insights into regional safety and security dynamics. Additionally, the app provides data on the unemployment rate in each state. By analyzing the connections between unemployment rates and violent crime rates, users can gain a deeper understanding of socioeconomic factors influencing crime trends. Explore the dropdown menu to compare the rates of different types of violent crimes and delve into the potential correlations with unemployment rates. Our interactive visualizations aim to facilitate informed analysis and promote awareness of critical societal issues.</p>";
    introductionPanel.classList.add("introduction-panel"); // Add a class for styling

    // Append the title and introduction panel to the document body
    document.body.insertBefore(introductionPanel, document.body.firstChild);
    document.body.insertBefore(pageTitle, introductionPanel);

    var zoom = d3.zoom()
        .scaleExtent([1,3])
        .on("zoom", function(e) {
            map.selectAll("path")
                .attr("transform", e.transform);
        });
    map.call(zoom);

    // Create a search input for states
    var stateSearch = document.createElement("input");
    stateSearch.setAttribute("type", "text");
    stateSearch.setAttribute("id", "stateSearch");
    stateSearch.setAttribute("placeholder", "Search for a state");
    document.body.insertBefore(stateSearch, introductionPanel.nextSibling);

    // Create a search button for the search input
    var searchButton = document.createElement("button");
    searchButton.innerHTML = "Search";
    searchButton.setAttribute("id", "searchButton");
    document.body.insertBefore(searchButton, stateSearch.nextSibling);



    //create Albers equal area conic projection centered on France
    var projection = d3.geoAlbers()
        .center([3.64, 50])
        .rotate([102, 0, 0])
        .parallels([40, 75])
        .scale(630)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];    
    promises.push(d3.csv("data/species_nz.csv")); //load attributes from csv    
    promises.push(d3.json("data/countries.topojson")); //load background spatial data    
    promises.push(d3.json("data/states.topojson")); //load choropleth spatial data    
    Promise.all(promises).then(callback);

    function callback(data){    
        csvData = data[0];    
        countries = data[1];   
        states = data[2]; 

        console.log(csvData);
        //console.log(countries.objects);
        //console.log(states);

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

        // Event listener for the Hawaii button
        searchButton.addEventListener("click", function() {
            SearchBar(usStates);
        });


        // Function to zoom the map to Hawaii
        function SearchBar(usStates) {

            var stateName = document.getElementById('stateSearch').value;
            // Assuming Hawaii is in the `usStates` dataset
            var state = usStates.find(function(d) {
                return d.properties.name.toLowerCase() === stateName.toLowerCase();
            });

            if (state) {
                // Get bounds of Hawaii
                var bounds = path.bounds(state);
                var dx = bounds[1][0] - bounds[0][0];
                var dy = bounds[1][1] - bounds[0][1];
                var x = (bounds[0][0] + bounds[1][0]) / 2;
                var y = (bounds[0][1] + bounds[1][1]) / 2;
                var scale = 2;
                var translate = [chartInnerWidth / 2 - scale * x, chartInnerHeight / 2 - scale * y];

                // Apply zoom and pan transformation to map
                map.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
            } else {
                alert("State not found.");
            }
        }
    


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

