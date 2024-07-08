import React from "react";
import Chart from "react-google-charts";
import "./chart.css";



function LineChart({title, data, width = 600, height = 400, classes = undefined})  {
    let options = {
        title: title,
        width: width,
        height: height
    }

    return (
        <div className={classes + ' chart'}>
            <Chart chartType="LineChart" className="chart" data={data} options={options} />
        </div>
    )
}

export default LineChart;
