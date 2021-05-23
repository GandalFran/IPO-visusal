
// ------------------------------------------------------------------
// vaccination vs income
// ------------------------------------------------------------------

var data = getVaccinationVsIncome()

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#vaccination_vs_income")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// setup x 
var vaccination_rate_values = data.map(function(d){ return d.gdp_per_capita; });
var min_x_value = d3.min(vaccination_rate_values);
var max_x_value = d3.max(vaccination_rate_values);
console.log(min_x_value)
var x_axis = d3.scaleLog().domain([min_x_value, max_x_value]).range([ 20, width-30 ]);
svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x_axis));

// setup y
var gdp_per_capita_values = data.map(function(d){ return d.vaccine_coverage; });
var min_y_value = d3.min(gdp_per_capita_values) - 10;
var max_y_value = d3.max(gdp_per_capita_values);
var y_axis = d3.scaleLinear().domain([min_y_value, max_y_value]).range([ height, 0 ]);
svg.append("g").call(d3.axisLeft(y_axis));

// setup radius
var population_values = data.map(function(d){ return d.population; });
var min_radious_value = d3.min(population_values);
var max_radious_value = d3.max(population_values);
var rad = d3.scaleLinear().domain([min_radious_value, max_radious_value]).range([ 5, 30]);

// setup fill color
function color_metric(d){
  var normalized_gdp = d.gdp_per_capita/max_x_value;
  var normalized_vaccine = d.vaccine_coverage / 100;
  var normalized_population = d.population / max_radious_value;
  return (normalized_vaccine * normalized_population) / normalized_gdp;
  // esfuerzos de vacunacion: cantidad de gente vacunada / dinero que tiene la gente de media
}

var color_domain_values = data.map(function(d){ return color_metric(d); });
var min_c_value = d3.min(color_domain_values);
var max_c_value = d3.max(color_domain_values);
var color = d3.scaleLinear().domain([min_c_value,max_c_value]).range(["#6ed48f", "#63a9e0"])

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// x-axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x_axis)
  .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("GDP per capita (2017)");

// y-axis
svg.append("g")
    .attr("class", "y axis")
    .call(y_axis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
  .text("Vaccine coverage (%)");

// draw dots
svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "dot")
      .attr("cx", function (d) { return x_axis(d.gdp_per_capita); } )
      .attr("cy", function (d) { return y_axis(d.vaccine_coverage); } )
      .attr("r", function (d) { return rad(d.population); })
      .style("fill", function(d) { return color(color_metric(d));}) 
      .on("mouseover", function(d) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`
          <table class="tg">
          <thead>
            <tr>
              <th class="tg-73oq">Country</th>
              <th class="tg-73oq">${d["country"]}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="tg-73oq">GDP per capita</td>
              <td class="tg-73oq">${d["gdp_per_capita"]}$</td>
            </tr>
            <tr>
              <td class="tg-73oq">vaccine coverage</td>
              <td class="tg-73oq">${d["vaccine_coverage"]}%</td>
            </tr>
            <tr>
              <td class="tg-73oq">population</td>
              <td class="tg-73oq">${d["population"]/1000000}M</td>
            </tr>
          </tbody>
          </table>`
        )

        //tooltip.html(`${d["country"]}:\n\t 💰 ${d["gdp_per_capita"]}$ \n\t\U+1F489 ${d["vaccine_coverage"]}%\n\t🧑‍🤝‍🧑 ${d["population"]/1000000}M`)
             .style("left", (d3.event.pageX + 5) + "px")
             .style("top", (d3.event.pageY - 80) + "px")
             .style("background-color", color(color_metric(d)));
      }).on("mouseout", function(d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });

// ------------------------------------------------------------------
// preventable_child_deaths_from_vaccionation
// ------------------------------------------------------------------

const numOfCountries = 15;
var data = getPreventableChildDeathsData();

//sort bars based on value
data = data.sort(function (a, b) {
    return d3.ascending(a.deaths_for_no_vaccination, b.deaths_for_no_vaccination);
}).slice(-numOfCountries)

// set color scale and assign color id
var c = d3.scaleLinear().domain([1,numOfCountries]).range(["#4d1414", "#b40d0d"])

data.forEach(function (value, i) {
    value.color = i;
});

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.deaths_for_no_vaccination; })])
  y.domain(data.map(function(d) { return d.country; }));
  //y.domain([0, d3.max(data, function(d) { return d.deaths_for_no_vaccination; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      //.attr("x", function(d) { return x(d.deaths_for_no_vaccination); })
      .attr("width", function(d) {return x(d.deaths_for_no_vaccination); } )
      .attr("y", function(d) { return y(d.country); })
      .attr("height", y.bandwidth())
      .attr("fill", function(d){return c(d.color) })

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));