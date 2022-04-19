import React, {useState} from "react";
import HQTable from "../components/Tables/HQTable/HQTable";
import HQTabFilters from "../components/HQTabFilters/HQTabFilters";
import {useCallback} from "react";
import {api} from "../helpers/ApiHandler";
import {useEffect} from "react";

const HQDashboard = () => {
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
      <HQTabFilters filters={filters} setFilters={setFilters} downloadLink={downloadLink}></HQTabFilters>
      <HQTable flights={flights} />
    </div>
  );
};

export default HQDashboard;
