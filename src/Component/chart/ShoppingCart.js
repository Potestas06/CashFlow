import React from "react";
import Chart from "react-google-charts";
import "./chart.css";

function ShoppingCart({title, data, width = 1200, height = 800, classes = undefined})  {
    let options = {
        title: title,
        width: width,
        height: height
    }

    let types = {};
    let transactionsByType = {};
    data.forEach(transaction => {
        if (!transaction.isExpense) {
            return;
        }
        if (!(transaction.type.toLowerCase() in types)) {
            types[transaction.type.toLowerCase()] = transaction.type;
            transactionsByType[transaction.type.toLowerCase()] = 0
        }
        transactionsByType[transaction.type.toLowerCase()] += Number.parseFloat(transaction.amount)

    })

    let contents = [['Typ', 'Kosten']];

    for (const [key, value] of Object.entries(transactionsByType)) {
        contents.push([types[key], value]);
    }

    return (
        <div className={classes}>
            <Chart chartType="PieChart" className="chart" data={contents} options={options} />
        </div>
    )
}

export default ShoppingCart;
