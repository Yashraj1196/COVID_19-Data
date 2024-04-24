import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
Chart.register();

function CovidBarChart() {
  const [covidData, setCovidData] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const [chartData, setChartData] = useState(null); // Initialize chartData as null

  // Fetch COVID-19 data and set initial chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://data.covid19india.org/v4/min/timeseries.min.json"
        );
        const data = await response.json();
        setCovidData(data);
      } catch (error) {
        console.error("Error fetching COVID-19 data:", error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data based on selected state
  useEffect(() => {
    if (covidData && selectedState && covidData[selectedState]?.dates) {
      const dates = Object.keys(covidData[selectedState].dates);
      const confirmedData = dates.map(
        (date) => covidData[selectedState].dates[date]?.total?.confirmed || 0
      );

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Total Confirmed Cases",
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
            data: confirmedData,
          },
        ],
      });
    } else {
      setChartData(null); // Reset chartData if data is invalid or not available
    }
  }, [covidData, selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  return (
    <div>
      <h3>covid-19 data in chart form</h3>

      {/* Select box to choose state */}
      <div>
        <label htmlFor="stateSelect">Select State: </label>
        <select
          id="stateSelect"
          value={selectedState}
          onChange={handleStateChange}
        >
          <option value="">Select a state</option>
          {Object.keys(covidData).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Display Bar chart */}
      {chartData && selectedState && (
        <div style={{ marginTop: "20px" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "Date",
                    },
                  },
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "Total Confirmed Cases",
                    },
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CovidBarChart;
