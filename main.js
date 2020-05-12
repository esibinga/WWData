/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 2,
  default_selection = "All";

/** these variables allow us to access anything we manipulate in init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;
//let yAxis;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedNeighborhood: "All",
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
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedNeighborhood = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  const selectElement2 = d3.select("#dropdown2").on("change", function() {
    console.log("new selected entity is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedNeighborhood = this.value;
    draw(); // re-draw the graph based on this new selection
  });


  const selectElement3 = d3.select("#dropdown3").on("change", function() {
    console.log("new selected entity is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
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
/*
selectElement2
    .selectAll("option")
    .data([
      ...Array.from(new Set(state.data.map(d => d.areaName))).sort(d => d.areaName),
      default_selection,
    ])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

selectElement3
    .selectAll("option")
    .data([
      ...Array.from(new Set(state.data.map(d => d.areaName))),
      default_selection,
    ])
    .join("option")
    .attr("value", d => d)
    .text(d => d);
*/
    

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
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Median Rent");

// // gridlines in x axis function
// function make_x_gridlines() {		
//     return d3.axisBottom(x)
//         .ticks(5)
// }

// // add the X gridlines
//  svg.append("g")			
//       .attr("class", "grid")
//       .attr("transform", "translate(0," + height + ")")
//       .call(make_x_gridlines()
//           .tickSize(-height)
//           .tickFormat("")
//       )

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // filter the data for the selectedParty
  let filteredData = state.data;
  if (state.selectedNeighborhood !== "All") {
    filteredData = state.data.filter(d => d.areaName === state.selectedNeighborhood);
  }

  // update the scale domain (now that our data has changed)
//   yScale
//     .domain([0, d3.max(filteredData, d => d.medianRent)])
//     .range([height - margin.bottom, margin.top]);

  //re-draw our yAxix since our yScale is updated with the new data
  /* d3.select("y-axis")
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale)); // this updates the yAxis' scale to be our newly updated one
*/
  // we define our line function generator telling it how to access the x,y values for each point
  const lineFunc = d3
    .line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.medianRent));
    

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.date) // use `d.date` as the `key` to match between HTML and data elements
    //console.log("fd", filteredData)
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          //.attr("stroke", "lightgrey")
          .attr("fill", d=> {
            if (d.borough === "Manhattan") return "#a6cee3";
            else if (d.borough === "Bronx") return "#1f78b4";
            else if (d.borough === "Brooklyn") return "#b2df8a";
            else if (d.borough === "Queens") return "#33a02c";
            else if (d.borough === "Staten Island") return "#fb9a99";
            else return "black";
          }) //make a function
          .attr("r", radius)
          .attr("opacity", d => {
              d3.select(this)
              if (d.medianRent === 0) return "0.0";
              else if (d.medianRent !== 0) return "0.8";
          })
          .attr("cy", d => yScale(d.medianRent)) // initial value - to be transitioned
          .attr("cx", d => xScale(d.date))
          .call(enter =>
            enter
              .transition()
              .delay(d => 200 * d.date)
              .duration(500)
              .attr("opacity", 0.5)
              //.attr("cx", d => xScale(d.pf_ss_women))
          ), 
      update => 
        update
        .call(update =>
            update
                .transition()
                .duration(500)
                .transition()
                .duration(1000)
                .attr("stroke", "lightgrey")
        ),
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
            .delay(d => 200 * d.medianRent)
            .duration(500)
            //.attr("cy", height - margin.bottom)
            .attr("opacity", "0")
            .remove()
        )
    )
    // the '.join()' function leaves us with the 'Enter' + 'Update' selections together.
    // Now we just need move them to the right place

    .call(
      selection =>
        selection
          //.data([filteredData])
          .transition() // initialize transition
          .duration(1000) // duration 1000ms / 1s
          .attr("cy", d => yScale(d.medianRent)) 
          .attr("opacity", d => {
            d3.select(this)
            if (d.medianRent === 0) return "0.0"
            else return "1.0";
        }) // started from the bottom, now we're here
    );


  const line = svg
    .selectAll("path.trend")
    .data([filteredData])
    .join(
      enter =>
        enter
          .append("path")
          .attr("class", "trend")
          .attr("opacity", 0.0), // start them off as opacity 0 and fade them in
      update => update, // pass through the update selection
      exit => exit.remove()
    )
    .call(selection =>
      selection
        .transition() // sets the transition on the 'Enter' + 'Update' selections together.
        .duration(1000)
        .attr("opacity", 1)
        .attr("d", d => lineFunc(d))
    );

    svg.append("g")			
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
    )

     
// function update(){

    // // For each check box:
    // d3.selectAll("#checkbox").each(function(d){
    //     cb = d3.select(this);
    //     console.log("cb this", this)
    //     grp = cb.property("value")

    //     // If the box is check, I show the group
    //     if(cb.property("checked")){
    //     svg.selectAll("."+grp).transition().duration(1000).style("opacity", 1).attr("r", function(d){ return size(d.borough) })

    //     // Otherwise I hide it
    //     }else{
    //     svg.selectAll("."+grp).transition().duration(1000).style("opacity", 0).attr("r", 0)
    //     }
    // })
    // }

    // // When a button change, I run the update function
    // d3.selectAll(".checkbox").on("change",update);

    // // And I initialize it at the beginning
    // update()


}
