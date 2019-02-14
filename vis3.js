function buildVisualization3() {

  // Basic set up
  const visualization = d3.select("#vis3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height/ 2 + ")");

  let radius = Math.min(width, height-20) / 2;


  // Format data for D3
  let formatedData = {};

  data.forEach((d) => {
    let intersection = d["Intersection"];
    if(intersection === "POWELL ST \\ OFARRELL ST") {
      let incident = d["Incident Category"];
      if(Object.keys(formatedData).includes(incident)) {
        formatedData[incident] += 1;
      } else {
        formatedData[incident] = 1;
      }
    }
  })

  formatedData = Object.keys(formatedData).map((incident) => {
    return {
      label: incident,
      value: formatedData[incident]
    }
  })

  // Color scale
  let color = d3.scaleOrdinal(["#4E79A7", "#A0CBE8", "#FFBE7D", "#8CD17D", "#B6992D", "#F1CE63", "#499894", "#86BCB6", "#E15759", "#FF9D9A", "#79706E", "#FFBE7D", "#59A14F", "#BAB0AC", "#D37295", "#FABFD2"]);

  let pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });

  let path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  let label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  // Create arcs for pie chart
  let arc = visualization.selectAll(".arc")
    .data(pie(formatedData))
    .enter()
    .append("g")
      .attr("class", "arc");

  // Append pie chart arcs
  arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return color(d.data.label); });

  // Pie chart labels
  arc.append("text")
    .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
    .attr("dy", "0.35em")
    .text(function(d) {
      return d.data.value > 10 ? d.data.label : null;
    });

  // Title
  visualization.append("text")
    .attr("y", 0 - height/2)
    .attr("x", 0)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Incident Types at Powell ST and O'Farrell ST");

  // Create legend
  let legendG = visualization.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
    .data(pie(formatedData))
    .enter().append("g")
    .attr("transform", function(d,i){
      return "translate(" + (width / 2 - 200) + "," + (0 - height/2 + i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
    })
    .attr("class", "legend");

  // Add Legend color
  legendG.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", function(d, i) {
      return color(i);
    });

  // Add Legend label
  legendG.append("text")
    .text(function(d){
      return d.value + "  " + d.data.label;
    })
    .style("font-size", 12)
    .attr("y", 10)
    .attr("x", 11);
};

buildVisualization3();
