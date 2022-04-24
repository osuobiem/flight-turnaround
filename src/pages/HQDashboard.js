import React, {useState} from "react";
import HQTable from "../components/Tables/HQTable/HQTable";
import HQTabFilters from "../components/HQTabFilters/HQTabFilters";
import {useCallback} from "react";
import {api} from "../helpers/ApiHandler";
import {useEffect, useContext} from "react";
import {StationsContext} from "../AppContext";

const HQDashboard = () => {
  const {stations} = useContext(StationsContext);
  const [flightStations, setFlightStations] = useState({});

  useEffect(() => {
    setFlightStations(stations);
  }, [stations]);

  const [flights, setFlights] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [filters, setFilters] = useState({
    'sta': `${(new Date()).getFullYear()}-${(new Date()).getMonth()+1}-${(new Date()).getDate()}`,
    'download': 'yes'
  });

  const fetchFlights = useCallback(async () => {
    await api('getFlights', filters)
    .then(res => {
      setFlights(res.data.flights);
      setDownloadLink(res.data.download_link)
    });
  }, [filters]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  return (
    <div>
      <HQTabFilters filters={filters} setFilters={setFilters} downloadLink={downloadLink} flightStations={flightStations}/>
      <HQTable flights={flights} flightStations={flightStations} />
    </div>
  );
};

export default HQDashboard;
