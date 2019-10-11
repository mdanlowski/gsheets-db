// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 30, left: 60},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#plot1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#plot2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3.select("#plot3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("/monthData/'2018+'!F399:O429",
  function(data) {
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.day; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.total; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

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
// https://docs.google.com/spreadsheets/d/1gnstZzesgirR4BRwp_w897ncdamVrSm6Bmfy4J5_obA/edit#gid=1894428657&range=F434:O464
d3.json("/monthData/'2018+'!F434:O464",
  function(data) {
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.day; }))
      .range([ 0, width ]);
    svg3.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.total; })])
      .range([ height, 0 ]);
    svg3.append("g")
      .call(d3.axisLeft(y));

    svg3.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.day) })
        .y(function(d) { return y(d.value) })
      )

      svg3.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.day) })
        .y(function(d) { return y(d.total) })
      )
  }
)
// https://docs.google.com/spreadsheets/d/1gnstZzesgirR4BRwp_w897ncdamVrSm6Bmfy4J5_obA/edit#gid=1894428657&range=F469:O499
d3.json("/monthData/'2018+'!F469:O499",
  function(data) {
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.day; }))
      .range([ 0, width ]);
    svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.total; })])
      .range([ height, 0 ]);
    svg2.append("g")
      .call(d3.axisLeft(y));

    svg2.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.day) })
        .y(function(d) { return y(d.value) })
      )

      svg2.append("path")
      .datum(data)
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