/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 2,
  default_selection = "None Selected";

/** these variables allow us to access anything we manipulate in init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;
//let yAxis;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedNeighborhood: "None Selected",
};

/**
 * LOAD DATA
 * */
d3.csv("./medianAskingRent_formatted.csv", d => ({
  areaName: d.areaName,
  borough: d.Borough,
  areaType: d.areaType,
  date: new Date(d.year, d.month),
  medianRent: +d.median_rent,
})).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // SCALES
  xScale = d3
    .scaleTime()
    .domain(d3.extent(state.data, d => d.date))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(state.data, d => d.medianRent)])
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected entity is", this.value);
    state.selectedNeighborhood = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
selectElement
    .selectAll("option")
    .data([
        default_selection,
      ...Array.from(new Set(state.data.map(d => d.areaName))).sort(),
    ])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // this ensures that the selected value is the same as what we have in state when we initialize the options
  selectElement.property("value", default_selection);

  // create an svg element in our main `d3-container` element 
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3.5em")
    .attr("writing-mode", "vertical-rl")
    .text("Median Rent ($)");

// svg
//     .append("g")
//     .attr("class", "legend")
//     .call(d3.legend);

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // filter the data for the selectedNeighborhood
  let filteredData = state.data;
  if (state.selectedNeighborhood !== "All") {
    filteredData = state.data.filter(d => d.areaName === state.selectedNeighborhood);
  }

  // define line function generator telling it how to access the x,y values for each point
  const lineFunc = d3
    .line()
    .defined(function (d) { return d.medianRent !== 0;}) //only draw lines where there are rent values
    // -- this leaves gaps in the lines showing a lack of data, rather than having the line bounce up 
    // and down off the x-axis
    .x(d => xScale(d.date))
    .y(d => yScale(d.medianRent));
  
  

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.date) // use `d.date` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot")
          .attr("fill", d=> { //fill colors based on borough
            if (d.borough === "Manhattan") return "#a6cee3"; //light blue
            else if (d.borough === "Bronx") return "#1f78b4"; //dark blue
            else if (d.borough === "Brooklyn") return "#b2df8a"; //light green
            else if (d.borough === "Queens") return "#fb9a99"; //salmon pink
            else if (d.borough === "Staten Island") return "#33a02c"; //dark green
            else return "lightgray";
          }) //make a function
          .attr("r", radius)
          .attr("opacity", d => {
              d3.select(this)
              if (d.medianRent === 0) return "0.0"; //do not show dots where rent is listed as 0
              else if (d.medianRent !== 0) return "0.5"; //decrease opacity to give a sense of density
          })
          .attr("cy", d => yScale(d.medianRent))
          .attr("cx", d => xScale(d.date))
          .call(enter =>
            enter
              .transition()
              .delay(d => 200 * d.date)
              .duration(500)
              .attr("opacity", 0.5)
          ), 
      update => 
        update,
        // .call(update =>
        //     update
        //         .transition()
        //         .duration(500)
        //         .transition()
        //         .duration(1000)
        //         .attr("stroke", "lightgrey")
        // ),
      exit =>
      exit
        // exit.call(exit =>
        //   // exit selections -- all the `.dot` element that no longer match to HTML elements
        //   exit
        //     .transition()
        //     .delay(d => 200 * d.medianRent)
        //     .duration(500)
        //     //.attr("cy", height - margin.bottom)
        //     .attr("opacity", "0")
        //     .remove()
        // )
    )
    // the '.join()' function leaves us with the 'Enter' + 'Update' selections together.
    // Now we just need move them to the right place

    .call(
      selection =>
        selection
          .transition() // initialize transition
          .duration(1000) // duration 1000ms / 1s
          .attr("radius", 10)
          .attr("cy", d => yScale(d.medianRent)) 
          .attr("opacity", d => {
            d3.select(this)
            if (d.medianRent === 0) return "0.0"
            else return "1.0";
        }) 
    );

  svg.selectAll("text.label")
    .data(filteredData, d => d.areaName)
    .join("text")
    .attr("class","label")
    .attr("x", d => xScale(d.date))
    .attr("y", d => yScale(d.medianRent))
    .attr("fill", "black")
    .attr("font-size", "10px")
    .text(d => d.medianRent)  

//add lines to the chart
  const line = svg
    .selectAll("path.trend")
    .data([filteredData])
    .join(
      enter =>
        enter
          .append("path")
          .attr("class", "trend")
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("opacity", 0.0), // start them off as opacity 0 and fade them in
      update => update, // pass through the update selection
      exit => exit.remove()
    )
    .call(selection =>
      selection
        .transition() // sets the transition on the 'Enter' + 'Update' selections together.
        .duration(500)
        .attr("opacity", "1.0")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", function(d) {
            if (state.selectedNeighborhood === "All") return "0.0"; //I'm figuring out how to make this look readable -- not satisfied with it yet
            else return "1.5"; //thick enough line that you can read it easily on top of dots
        })
        .attr("d", d => lineFunc(d))
    );

}
