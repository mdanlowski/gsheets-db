// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 30, left: 60},
    width = 1060 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


d3.json("/monthData/sty",
  // Now I can use this dataset:
  function(data) {
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.day; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.total; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("id", "line1")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.day) })
        .y(function(d) { return y(d.value) })
      )


      svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("id", "line2")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.day) })
        .y(function(d) { return y(d.total) })
      )
    
  }
)

//.curve(d3.curveCardinal)