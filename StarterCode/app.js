// Create Function for Data Plotting
// function init() {
//     // Grab reference to dropdown select element
//     var selector = d3.select("#selDataset")
//     // Get Data from the JSON file
//     d3.json("data/samples.json").then((data)=> {
        
//         var sample_names = data.names;
        
//         sample_names.forEach((sample) =>{
//             selector
//                 .append("option")
//                 .text(sample)
//                 .property("value",sample);
//         });

//         var firstSample = sample_names[0];
//         buildCharts(firstSample);
//         buildMetadata(firstSample);

//     });
    
// }
// init();
// Create Function for Initial Data Rendering
function init() {
    // Delect Dropdown Menu 
    var dropdown = d3.select("#selDataset");

    // Read Data 
    d3.json("data/samples.json").then((data)=> {
        data.names(data);

        // Get ID Data into Dropdwown Menu
        data.names.forEach((name) => {
            dropdown.append("option").text(name).property("value",name);
        });

        // Call the Functions to Display Data and Plots on the Page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();

function getPlot(id) {
        var wfreq = data.metadata.map(d => d.wfreq)
        data.names(`Washing Freq: ${wfreq}`)
        
        // Filter Sample Values by ID 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        data.names(samples);
  
        // Get the Top 10 Samples
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // Get Only Top 10 OTU IDs for Plot OTU and Reverse it 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // Get OTU IDs in the Proper Form for Plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
      //   data.names(`OTU IDS: ${OTU_id}`)
  
  
        // Get Top 10 Labels for Plot
        var labels = samples.otu_labels.slice(0, 10);
  
      //   data.names(`Sample Values: ${samplevalues}`)
      //   data.names(`Id Values: ${OTU_top}`)
        // create trace variable for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        // Create Data Variable
        var data = [trace];
  
        // Create Layout Variable to Set Plot Layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // Create Bar Plot
        Plotly.newPlot("bar", data, layout);
  
        // data.names(`ID: ${samples.otu_ids}`)
      
        // Bubble Plot
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // Set Layout for Bubble Plot
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // Create Data Variable 
        var data1 = [trace1];
  
        // Create Bubble Plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // Guage Plot
  
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "cyan" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      
        };
// Create Function to Get Needed Data
function getInfo(id) {
    // Read JSON File to Get Data
    d3.json("data/samples.json").then((data)=> {
        
        // Get Metadata for Demo Panel
        var metadata = data.metadata;

        data.names(metadata)

        // Filter Meta Data by ID
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Select Demo Panel to Place Data
        var demographicInfo = d3.select("#sample-metadata");
        
        // Empty Demo Panel Before Selecting New ID
        demographicInfo.html("");

        // Select Needed Demo Data for ID then Apply to the Panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Create Function for Change Event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

