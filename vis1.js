function buildVisualization1() {

  // Basic Set up
  const visualization = d3.select("#vis1")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 20)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set range and domain of graph
  let x = d3.scaleLinear().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);

  // Create line with x and y values
  let valueline = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.count); });

  // Format Data
  let formatedData = {};

  data.forEach((data) => {
    let hour = data["Incident Time"].substring(0,2);
    if( Object.keys(formatedData).includes(hour)) {
      formatedData[hour] += 1;
    } else {
      formatedData[hour] = 1;
    }
  })

  // Reformat data for D3
  formatedData = Object.keys(formatedData).map((time) => {
    return {
      time,
      count: +formatedData[time]
    }
  }).sort((a,b) => a.time - b.time)

  // Set x-y function
  x.domain([0, d3.max(formatedData, function(d) { return d.time; })]);
  y.domain([0, d3.max(formatedData, function(d) { return d.count; })]);

  // Append Lines
  visualization.append("path")
    .data([formatedData])
    .attr("class", "line")
    .attr("d", valueline);

  // X-Axis
  visualization.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Y-Axis
  visualization.append("g")
    .call(d3.axisLeft(y));

  // X-Axis Label
  visualization.append("text")
    .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top) + ")")
    .style("text-anchor", "middle")
    .text("Incident Time");

  // Y-Axis Lable
  visualization.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Incidents");

  // Graph Title
  visualization.append("text")
    .attr("y", 0 - margin.top)
    .attr("x", (width / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Incidents by Time of Day");
};
buildVisualization1();
