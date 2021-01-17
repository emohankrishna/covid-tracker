import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from "numeral"

const options = {
    legend: {
        display: false,

    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a")
                    }
                }
            }
        ]
    }
}
function LineGraph({casesType}) {
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(response => response.json())
                .then(data => {
                    const chartData = buildChartData(data,casesType)
                    console.log("Chart Data", chartData)
                    setData(chartData)
                })
        }
        fetchData();
    }, [casesType])

    const buildChartData = (data, caseType = "cases") => {
        const chartData = [];
        let lastDataPoint;
        for (let date in data[caseType]) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[caseType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[caseType][date]
        }
        return chartData;
    }
    return (
        <div className="app__linegraph">
            <Line
                data={{
                    datasets: [{
                        backgroundColor: "rgba(204,16,52,0.5",
                        borderColor: "#cc1034",
                        data: data,
                    }]
                }}
                options={options} />
        </div>
    )
}

export default LineGraph
