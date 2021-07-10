//graph set up

// svg params
var svgWidth = 960;
var svgHeight = 500;

// margins
var margin = {
	top: 20,
	right: 40,
	bottom: 80,
	left: 100
};

// chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg container for graph
var svg = d3.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
    .attr("height", svgHeight);

// shift everything over by the margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import data
d3.csv("./assets/data/data.csv").then(function(dataSet){

//getting data and cast as number
	dataSet.forEach(function(data){
		data.poverty = + data.poverty;
		data.healthcare = +data.healthcare;
	});

//creat scale functions
	var xLinearScale = d3.scaleLinear()
		.domain([8.5, d3.max(dataSet, d => d.poverty)])
		.range([0,width]);

	var yLinearScale = d3.scaleLinear()
		.domain([3, d3.max(dataSet, d => d.healthcare)])
		.range([height, 0]);

	//create axis function
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	//append axis to chart
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	chartGroup.append("g")
		.call(leftAxis);

	//Create circles
	var circlesGroup = chartGroup.selectAll("stateCircle")
		.data(dataSet)
		.enter()
		.append("circle")
		.attr("cx", d => xLinearScale(d.poverty))
		.attr("cy", d => yLinearScale(d.healthcare))
		.attr("r", "15")
		.attr("class", "stateCircle");

	//text in circle
	var textGroup  = chartGroup.selectAll(".stateText")
		.data(dataSet)
		.enter()
		.append("text")
		.attr("class", "stateText")
		.attr("x", d => xLinearScale(d.poverty))
		.attr("y", d => yLinearScale(d.healthcare))
		.text(function(d){return d.abbr})
		.style("font", "12px arial");


	//Initialize tooltip
	var toolTip = d3.tip()
		.attr("class", "d3-tip")
		.offset([80, -60])
		.html(function(d){
			return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
		});

	//create tooltip in the cahrt
	chartGroup.call(toolTip);

	//display and hide the tooltip
	circlesGroup.on("mouseover", function(data){
		toolTip.show(data, this);
	})
		.on("mouseout", function(data, index){
			toolTip.hide(data);
		});

	//create axes labels
	chartGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left + 40)
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.attr("class", "axisText")
		.text("Lacks Healthcare (%)");

	chartGroup.append("text")
		.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
		.attr("class", "axisText")
		.text("In Poverty (%)");
	}).catch(function(error){
		console.log(error);
});

