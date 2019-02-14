function buildVisualization2() {

  // Basic Set up
  const visualization = d3.select("#vis2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 200)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let formatedData = {};

  data.forEach((d) => {
    let intersection = d["Intersection"];
    if(Object.keys(formatedData).includes(intersection)) {
      formatedData[intersection] += 1;
    } else {
      formatedData[intersection] = 1;
    }
  })

  // Reformat data for D3, sort by string
  formatedData = Object.keys(formatedData).map((intersection) => {
    return {
      intersection,
      count: formatedData[intersection]
    }
  }).filter((intersection) => {
    return intersection.count > 30 && intersection.intersection.length > 0;
  }).sort((a, b) => ('' + a.intersection).localeCompare(b.intersection))

  // Set color scale
  let color = d3.scaleLinear()
    .domain([0, 160])
    .range(['#FFC67D', '#AC3008']);

  // Set X-Axis Scale
  let x = d3.scaleBand()
    .rangeRound([0, width])
  	.padding(0.1);

  // Set Domain
  x.domain(formatedData.map((d) => d.intersection));

  // Set Y-Axis Scale
  let y = d3.scaleLinear().rangeRound([height, 0]);

  // Set Range
	y.domain([0, d3.max(formatedData, (d) => Number(d.count))]);

  // Append X-Axis
	visualization.append("g")
  	.attr("transform", "translate(0," + height + ")")
  	.call(d3.axisBottom(x))

  // X-Axis labels
  visualization
    .selectAll("text")
    .attr("transform", "rotate(270) translate(-8,-12)")
    .style("text-anchor", "end");

  // Y-Axis Label
	visualization.append("g")
  	.call(d3.axisLeft(y))
  	.append("text")
  	.attr("fill", "#000")
  	.attr("transform", "rotate(-90)")
  	.attr("x", 0 - height / 2)
  	.attr("y", 0 - margin.left + 10)
  	.attr("text-anchor", "middle")
  	.text("Count of Incidents");

  // Append Bars
	visualization.selectAll(".bar")
  	.data(formatedData)
  	.enter().append("rect")
  	.attr("class", "bar")
    .attr("fill", (d) => color(d.count))
  	.attr("x", (d) => x(d.intersection))
  	.attr("y", (d) => y(Number(d.count)))
  	.attr("width", x.bandwidth())
  	.attr("height", (d) => height - y(Number(d.count)));

  // Create Legend with gradient
  let gradient = visualization.append("defs")
    .append("linearGradient")
    .attr("id", "linear-gradient");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ffc67d")

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#ac3008")

  // Append Legend
  let legend = visualization.append("g")
  .attr("class", "legend")

  legend.append("rect")
    .attr("x", width - 100)
    .attr("y", 10)
    .attr("width", 80)
    .attr("height", 20)
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("fill", "url(#linear-gradient)");

  legend.append("text")
    .attr("x", width - 100)
    .attr("y", 45)
    .attr("text-anchor", "middle")
    .text("30");

  legend.append("text")
    .attr("x", width - 20)
    .attr("y", 45)
    .attr("text-anchor", "middle")
    .text("180");

  // Graph
  visualization.append("text")
      .attr("y", 0 - margin.top)
      .attr("x", (width / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Count of Incidents by Intersection (>30 incidents)");
};
buildVisualization2();
