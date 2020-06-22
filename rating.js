function createRating(businessId) {
    var url = "https://raw.githubusercontent.com/chetan015/yelp-data-viz/master/tempeReview.json";
Plotly.d3.json(url, function(data){
    var rand_rows=[]
    for(var i=0; i<data.length; i++){

      if(data[i]['business_id']==businessId){
        rand_rows.push(data[i]);
        // console.log(data[i]);
      }
    }
    rows = rand_rows.sort(function(a,b){
      return new Date(a.date) - new Date(b.date);
    });
    // console.log(rows)

    function unpack(rows, key) {
    return rows.map(function(row) {
       return row[key]; });
  }

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: 'Average Rating',
    x: unpack(rows, 'date'),
    y: unpack(rows, 'stars'),
    line: {color: '#00EBCD'}

  };
  var trace_data = [trace1];
  // console.log(trace_data)
  var layout = {
    //title: 'Time Series with Rangeslider',
    xaxis: {
      autorange: true,
      // range: ['2015-02-17', '2017-02-16'],
      rangeselector: {buttons: [
          // {
          //   count: 1,
          //   label: '1d',
          //   step: 'day',
          //   stepmode: 'backward'
          // },
          // {
          //   count: 7,
          //   label: '1w',
          //   step: 'day',
          //   stepmode: 'backward'
          // },
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 6,
            label: '6m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 1,
            label: '1y',
            step: 'year',
            stepmode: 'backward'
          },
          {
            count: 1,
            label: 'YTD',
            step: 'year',
            stepmode: 'todate'
          },
          {step: 'all'}
        ]},
      rangeslider: {},
      type: 'date'
    },
    yaxis: {
      autorange: true,
      // range: [1.0, 5.0],
      type: 'linear'
    }
  };
  Plotly.newPlot('Linegraph', trace_data, layout);

  var rate = unpack(rows, 'stars')
  var r1=r2=r3=r4=r5=0
  for (i = 0; i < rate.length; i++) {
    if(rate[i]==1.0){
      r1=r1+1;
    }
    if(rate[i]==2.0){
      r2=r2+1;
    }
    if(rate[i]==3.0){
      r3=r3+1;
    }
    if(rate[i]==4.0){
      r4=r4+1;
    }
    if(rate[i]==5.0){
      r5=r5+1;
    }
  }

  radar_data = [{
    type: 'scatterpolar',
    r: [r1, r2, r3, r4, r5, r1],
    theta: ['1 star','2 star','3 star','4 star','5 star','1 star'],
    fill: 'toself',
    fillcolor: '#00EBCD',
    line: {color:'#00EBCD'},
    // line_close:True
  }]
  layout = {
    polar: {
      // bgcolor:'white',
      radialaxis: {
        visible: true,
        autorange: true
      }
    },
    showlegend: false
    // line_close=True
  }
  Plotly.newPlot("Radarchart", radar_data, layout);
});
}
