
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#vaccination_vs_income")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var vaccination_rate_values = data.map(function(d){ return d.gdp_per_capita; });
var minXValue = d3.min(vaccination_rate_values);
var maxXValue = d3.max(vaccination_rate_values);

var x = d3.scaleLinear()
  .domain([minXValue, maxXValue])
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var gdp_per_capita_values = data.map(function(d){ return d.vaccine_coverage; });
var minYValue = d3.min(gdp_per_capita_values);
var maxYValue = d3.max(gdp_per_capita_values);

var y = d3.scaleLinear()
  .domain([minYValue, maxYValue])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Add radious axys
var population_values = data.map(function(d){ return d.population; });
var minRadiousValue = d3.min(population_values);
var maxRadiousValue = d3.max(population_values);

var rad = d3.scaleLinear()
  .domain([minRadiousValue, maxRadiousValue])
  .range([ height*0.02, 0]);

// Add dots
svg.append('g')
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function (d) { return x(d.gdp_per_capita); } )
    .attr("cy", function (d) { return y(d.vaccine_coverage); } )
    .attr("r", function (d) { return rad(d.population); })
    .style("fill", "#69b3a2")
    .text(function(d) { return d.country; });