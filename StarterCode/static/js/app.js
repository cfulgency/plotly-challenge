// Create Function for Data Plots (Bar Graph, Bubble Chart, Gauge Chart)
function getPlot(id) {
    // Pull Data from JSON File
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // Filter Sample Values by ID 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        // Identify Top Ten Samples 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // Pull Top Ten otu IDs for Plot OTU and Reverse it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // Pull otu IDs to Desired form for Plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
      //   console.log(`OTU IDS: ${OTU_id}`)
  
  
        // Get Top Ten Labels for Plot
        var labels = samples.otu_labels.slice(0, 10);
  
      //   console.log(`Sample Values: ${samplevalues}`)
      //   console.log(`Id Values: ${OTU_top}`)
        // Build Trace Variable for Plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        // Build Data Variable
        var data = [trace];
  
        // Build Layout Variable and Set Plot Layout
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
  
        // Build Bar Plot
        Plotly.newPlot("bar", data, layout);
  
        //console.log(`ID: ${samples.otu_ids}`)
      
        // Bubble Chart
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
  
        // Build Layout for Bubble Plot
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // Build Data Variable 
        var data1 = [trace1];
  
        // Build Bubble Plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // Guage Chart
  
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
      });
  }  
// Build Function to Acquire Needed Data
function getInfo(id) {
    // Read JSON File to Acquire Data
    d3.json("Data/samples.json").then((data)=> {
        
        // Acquire Meta Data for Demographic Panel
        var metadata = data.metadata;

        console.log(metadata)

        // Filter Meta Data By ID
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Select Demographic Panel to Place Data
        var demographicInfo = d3.select("#sample-metadata");
        
        // Clear Demographic Panel Before Loading New Meta Data
        demographicInfo.html("");

        // Pull Needed Demographic Data for ID and Append to Panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Build Function for Change Event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// Build Function for Initial Data Rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // Read Data 
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        // Place ID Data to Dropdwown Menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Call Functions to Display Data and Plots on Page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();