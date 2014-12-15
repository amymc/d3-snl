// Bar Chart
d3.csv("./snl_data/ratings.csv", function(error, data) {

    var margin = {top: 20, right: 20, bottom: 50, left: 0},
        width = 1060 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    //rangeBands sets the ouput range and evenly divides up the space into bars across the range
    //0 is the min value, width is max, 0.2 is padding between bars
    var x = d3.scale.ordinal()
        .rangeBands([0, width], 0.2);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var bar_svg = d3.select(".bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('class', 'bar-svg')
        //'g' element groups svg shapes together
        .append("g");

    //create tooltip
    var bar_tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return  "<span style='color:#e74e5a;'>" + d.rating + "</span>"; });

    //Invoke the tooltip in the context of the visualization
    bar_svg.call(bar_tip);

    //set the domains for the axes
    //data.map creates a new array of the 'year' values
    x.domain(data.map(function(d) { return d.year; }));

    //sets the min y value to be 0 and the max to be max the 'rating' value
    //in '+d.rating' the + sign is needed to coerce the type to a number
    //otherwise the values get compared as strings so the max value would be '9.8' instead of '13.5'
    y.domain([0, d3.max(data, function(d) { return +d.rating; })]);

    bar_svg.append("g")
        .attr("class", "x-axis")
        //position the axis below the bars
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            //display the text at an angle for better readability
            .attr("transform", function(d) {
                return "rotate(-65)"
            });

    bar_svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        //append the 'ratings' text label, aligning it to the end of the axis
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .style("text-anchor", "end")
            .text("Ratings");

    //using 'enter' bars are created for each year
    bar_svg.selectAll(".bar")
        .data(data)
        // new rectangle elements will be rendered for all datums which don’t yet have a matching rectangle element
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", x.rangeBand())
            //the origin of SVG’s coordinate system is in the top-left corner. 
            //this positions the zero-value at the bottom of the chart, rather than the top.
            .attr("y", height)
            .attr("height",0)
            //adding tooltip on mouseover
            .on('mouseover', bar_tip.show)
            .on('mouseout', bar_tip.hide)
            //animate the bars on appending to the page
            .transition().duration(1000)
            .attr("y", function(d) { return y(d.rating); })
            .attr("height", function(d) { return height - y(d.rating); });

});


var pie_width = 300,
    pie_height = 300,
    radius = pie_width / 2;

var color = d3.scale.ordinal()
    .range(["#e74e5a", "#7e8aa2", "#29d9c2", "#82dcf6", "#6499a9"]);

var donuttip = d3.select("#donuttip");

//nsa pie chart
d3.csv("./snl_data/nsadata.csv", function(error, data) {

    //the + sign in '+d.percentage' is needed to coerce the type to a number
    //otherwise the values are considered strings
    data.forEach(function(d) {
        d.percentage = +d.percentage;
    });

    var arc1 = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 50);

    //computes the start and end angles of the arcs that comprise the pie chart
    var pie1 = d3.layout.pie()
        .value(function(d) { return d.percentage; });

    //create tooltip
    var tip1 = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return  "<strong>" + d.data.under_surveillance + ":</strong> <span style='color:#e74e5a;'>" + d.data.percentage + "%</span>"; });

    var donut_svg = d3.select(".nsa").append("svg")
        .attr("width", pie_width)
        .attr("height", pie_height)
        .append("g")
        .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");

    var donut1 = donut_svg.selectAll(".arc1")
        .data(pie1(data))
        .enter().append("g");

    //Invoke the tooltip in the context of the visualization
    donut1.call(tip1);

    donut1.append("path")
        .attr("d", arc1)
        //use the colour scale to define the fill for each path by associating a colour with each 'under_surveillance' value in the dataset.
        .style("fill", function(d) { return color(d.data.under_surveillance); })
        .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide);
});

//awards pie chart
d3.csv("./snl_data/snl_awards.csv", function(error, data) {

    //the + sign in '+d.number' is needed to coerce the type to a number
    //otherwise the values are considered strings
    data.forEach(function(d) {
        d.number = +d.number;
    });

    var arc2 = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 50);

    //computes the start and end angles of the arcs that comprise the pie chart
    var pie2 = d3.layout.pie()
        .value(function(d) { return d.number; });

    var donut_svg2 = d3.select(".awards").append("svg")
        .attr("width", pie_width)
        .attr("height", pie_height)
        .append("g")
        .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");


    var donut2 = donut_svg2.selectAll(".arc2")
        .data(pie2(data))
        .enter().append("g");

    //create tooltip
    var tip2 = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return  "<strong>" + d.data.award + ":</strong> <span style='color:#e74e5a;'>" + d.data.number + "</span>"; });

    //Invoke the tooltip in the context of the visualization
    donut2.call(tip2);

    donut2.append("path")
        .attr("d", arc2)
        //use the colour scale to define the fill for each path by associating a colour with each 'award' in the dataset.
        .style("fill", function(d) { return color(d.data.award); })
        .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide);

});

// streamgraph
d3.csv("./snl_data/fake_data.csv", function(error, data) {

    var format = d3.time.format("%m/%d/%y");

    var margin = {top: 20, right: 60, bottom: 30, left: 60},
        width = 1000- margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var colorrange = [ "#82DCF6", "#68CBE0", "#4EBBCB", "#34AAB5", "#1A9AA0", "#00898A"],
        datearray = [];

    var x = d3.time.scale()
        .range([0, width -  margin.left ]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var z = d3.scale.ordinal()
        .range(colorrange);

    //create tooltip
    var streamtip = d3.select(".streamgraph")
        .append("div")
        .attr("class", "stream-tip");

    var strokecolor = colorrange[5];

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    //left y axis
    var yAxis = d3.svg.axis()
        .scale(y);

    //right y axis
    var yAxisr = d3.svg.axis()
        .scale(y);

    //to facilitate visualisation - create a nested array grouped by category
    var nest = d3.nest()
        .key(function(d) { return d.key; });

    //stack layout takes a two-dimensional array of data and computes a baseline;
    //the baseline is then propagated to the above layers, so as to produce a stacked graph
    var stack = d3.layout.stack()
        //centres the stream
        .offset("silhouette")
        //the nest function creates a values array for each key
        //the stack layout then uses these values to retrieve the points for each layer
        .values(function(d) { return d.values;})
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });

    //to generate the area
    var area = d3.svg.area()
        //interploate constructs new data points in between each point in the array
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var stream_svg = d3.select(".streamgraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "streamsvg")
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //the + sign in '+d.number' is needed to coerce the type to a number
    //otherwise the values are considered strings
    data.forEach(function(d) {
        d.date = format.parse(d.date);
        d.value = +d.value;
    });

    //applying the stack function to the nested array
    var layers = stack(nest.entries(data));

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

    //create the layers, using the area function created earlier
    stream_svg.selectAll(".layer")
        .data(layers)
        .enter().append("path")
            .attr("class", "layer")
            .attr("transform", "translate(" + margin.left +", 0)")
            .attr("d", function(d) { return area(d.values); })
            //use different fill colour for each key
            .style("fill", function(d, i) { return z(i); });

    stream_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left +"," + height + ")")
        .call(xAxis);

    stream_svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ", 0)")
        .call(yAxis.orient("right")
            //formats the ticks e.g displays 100,000 as 100k
            .tickFormat(d3.format("s"))
        );

    stream_svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ", 0)")
        .call(yAxis.orient("left")
            //formats the ticks e.g displays 100,000 as 100k
            .tickFormat(d3.format("s"))
        );

    stream_svg.selectAll(".layer")
        .attr("opacity", 1)
        .on("mouseover", function(d, i) {
            stream_svg.selectAll(".layer")
            //create an animated transition - makes the mouseover function appear smoother
            .transition()
            //reduces the opacity for all layers except the one that currently has the mouse on it.
            .attr("opacity", function(d, j) {
                return j != i ? 0.6 : 1;
            })
        })
        .on("mousemove", function(d, i) {
            //gets the x, y co-ordinates for the current mouse position
            var mousePos = d3.mouse(this);
            //gets the x co-ordinate
            var mousex = mousePos[0];
            //invert function returns a date
            var invertedx = x.invert(mousex);
            invertedx = invertedx.getYear() + invertedx.getMonth() + invertedx.getDate();
            var selected = (d.values);
            for (var k = 0; k < selected.length; k++) {
                datearray[k] = selected[k].date
                datearray[k] = datearray[k].getYear() + datearray[k].getMonth() + datearray[k].getDate();
            }
            //then map the date to the corresponding data value for the series.
            mousedate = datearray.indexOf(invertedx);
            //return the value that corresponds to the date
            pro = d.values[mousedate].value;
            //display the value as a tooltip
            d3.select(this)
                .classed("hover", true)
                .attr("stroke", strokecolor)
                .attr("stroke-width", "0.5px"),streamtip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
        })
        //when mouse leaves the svg area restore opacity of all layers to 1 and hide the tooltip
        .on("mouseout", function(d, i) {
            stream_svg.selectAll(".layer")
                .transition()
                .attr("opacity", "1");
            d3.select(this)
                .classed("hover", false)
                .attr("stroke-width", "0px"),streamtip.style("visibility", "hidden");
        })

});
