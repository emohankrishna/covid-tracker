import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core"
import InfoBox from "./InfoBox"
import { prettyPrintStat } from "./util"

import './App.css';
import Map from './Map';
import Table from './Table';
import { sortData } from "./util"
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [zoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data)
      })
  }, [])

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          // setCountries(data)
          const tempCountries = data.map(item => {
            return {
              name: item.country,
              value: item.countryInfo.iso2
            }
          });
          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(tempCountries)
          setMapCountries(data)
        })

    }
    getCountries()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // For World wide
    // https://disease.sh/v3/covid-19/all
    // For Each Specific Country
    // https://disease.sh/v3/covid-19/continents/IN
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url).then(response => response.json())
      .then(data => {
        setSelectedCountry(countryCode)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      })
  }
  return (
    <div className="app">
      {/* Header */}
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => <MenuItem key={country.value} value={country.value}>{country.name}</MenuItem>)
              }
            </Select>

          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            active={casesType === "cases"}
            color="orange"
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            onClick={e => setCasesType('cases')} />
          <InfoBox
            active={casesType === "recovered"}
            color="green"
            title="Recovaries"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            onClick={e => setCasesType('recovered')} />
          <InfoBox
            active={casesType === "deaths"}
            color="red"
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            onClick={e => setCasesType('deaths')} />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={zoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <div>
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} ></Table>
            </div>
            <div>
              <h3>World wide new {casesType}</h3>
              <LineGraph casesType={casesType} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
