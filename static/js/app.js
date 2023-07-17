// Place url in a constant variable
const URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Define init function to initialize the dashboard
function init() {
    // load the data using d3 library
    d3.json(URL).then(function (data) {
        let menu = d3.select("#selDataset");
        for (let id of data.names) {
            menu.append("option").attr("value", id).text(id);
        }
        optionChanged(data.names[0]);
    })
}

// Define barPlot function to build bar chart 
function plotBarChart(sample) {
    let otu_ids = sample.otu_ids.slice(0, 10).reverse();
    let otu_labels = sample.otu_labels.slice(0, 10).reverse();
    let sample_values = sample.sample_values.slice(0, 10).reverse();
    let y_values = otu_ids.map(id => `OTU ${id}`);

    let trace1 = {
        x: sample_values,
        y: y_values,
        text: otu_labels,
        type: "bar",
        orientation: "h",
        marker: {
            color: "rgb(30, 108, 99)",
            width: 200
        }
    };

    let barData = [trace1];

    // Set plot layout
    let layout = {
        title: `Top 10 OTUs`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };
    Plotly.newPlot("bar", barData, layout);
};

// Define bubblePlot function to build bubble chart
function plotBubbleChart(sample) {
    let otu_ids = sample.otu_ids;
    let otu_labels = sample.otu_labels;
    let sample_values = sample.sample_values;

    let trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Viridis"
        }
    };

    let bubbleData = [trace2];

    // Set plot layout
    let layout2 = {
        title: "Bacteria per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" }
    }

    Plotly.newPlot("bubble", bubbleData, layout2);
}

// Define populateMetadata function to add sample metadata to page
function populateMetadata(data, subject_id) {
    let metadata = data.metadata.filter(m => m["id"] == subject_id)[0];
    let panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    })
}

// Define optionChanged function to update dashboard when a new subject ID is chosen
function optionChanged(subject_id) {
    d3.json(URL).then(data => {
        let sample = data.samples.filter(s => s["id"] == subject_id)[0];

        // call chart building and metadata functions
        plotBarChart(sample);
        plotBubbleChart(sample);
        populateMetadata(data, subject_id);
    })
}


// call init function
init();
