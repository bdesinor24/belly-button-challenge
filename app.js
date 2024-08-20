// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata
    // Filter the metadata for the object with the desired sample number
    let top_10_sample = metadata.filter(sampleOBj => sampleOBj.id == sample);
    let result=top_10_sample[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    for (key in result){
      panel.append("h6").text(`${key}: ${result[key]}`);

    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples=data.samples;

    // Filter the samples for the object with the desired sample number
    let lable_sample=samples.filter(sampleOBj => sampleOBj.id === sample);
    let result=lable_sample[0];                
    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = result.otu_ids;
    let otuLabels = result.otu_labels;
    let sampleValues = result.sample_values;

    // Build a Bubble Chart
// Sample data for the bubble chart
  let bubbledata = [{
     x: otuIds,
      y: sampleValues,
      mode: 'markers',
     marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: 'Viridis',
      showscale: true
  },
  text: otuLabels
}];

// Layout settings for the bubble chart
let layout = {
  title: 'Bubble Chart Example',
  showlegend: false,
  xaxis: { title: 'OTU IDs' },
  yaxis: { title: 'Sample Values' }
};

// Render the Bubble Chart
    Plotly.newPlot('bubble', bubbledata, layout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let ytick = otuIds.map(otu=> `Otu ${otu}`)
    let bardata = {
        x: sampleValues.slice(0,10).reverse(),
        y: ytick.slice(0,10).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      };
      
    // Build a Bar Chart
 let barlayout={
  title: "Top 10 Bacteria Cultures Found",
  xaxis: {"title":"Number of Bacteria"}
 }

    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart
    Plotly.newPlot('bar', [bardata], barlayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    
  let samplenames= data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
  let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

for (let i=0; i<samplenames.length;i++){
  dropdownMenu.append("option").text(samplenames[i]).property("value",samplenames[i])
}
    // Get the first sample from the list
let firstsample= samplenames[0]

    // Build charts and metadata panel with the first sample
    buildCharts(firstsample)
    buildMetadata(firstsample)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
