import { useEffect, useState } from "react";
import "./App.css";
import CovidBarChart from "./covidBarChart";
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const [covidData, setCovidData] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const url = "https://data.covid19india.org/v4/min/timeseries.min.json";

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCovidData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const states = Object.keys(covidData);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  return (
    <>
      {Object.keys(covidData).length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <h2 className="pt-2 pb-3">COVID-19 All Data for the different States</h2>
            <h3>covid-19 data in a table form</h3>
            <label htmlFor="stateSelect">Select State:</label>
            <select
              id="stateSelect"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {selectedState && (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Delta Confirmed</th>
                  <th>Delta7 Confirmed</th>
                  <th>Total Confirmed</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(covidData[selectedState].dates).map(
                  ([date, dateData]) => (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>{dateData.delta?.confirmed || 0}</td>
                      <td>{dateData.delta7?.confirmed || 0}</td>
                      <td>{dateData.total?.confirmed || 0}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      <div style={{}}>
      <CovidBarChart/>
      </div>
    </>
  );
}

export default App;


// // ---------------------------------------------------------------------------

// import React from 'react'
// import CovidBarChart from './covidBarChart'

// export const App = () => {
//   return (
//     <CovidBarChart/>
//   )
// }
// export default App;
