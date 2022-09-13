import React, { useEffect, useState, useRef } from 'react';
import './portola.scss';
import lineup from './lineup.csv';
import portola from './portola-lineup.csv';
import {parseData, extractProp} from './parseData';
import Lineup from './Lineup';
import Schedule from './Schedule';
import bgGradientLeft from './images/homepage-gradient-hero-left.png';
import bgGradientRight from './images/homepage-gradient-hero-right.png';

const festivals = [
  {
    name: 'Coachella',
    csv: lineup
  },
  {
    name: 'Portola',
    csv: portola
  },
];
const festival = 1; // 0 - coachella, 1 - portola

function App() {

  const [data, setData] = useState([]);
  const [stages, setStages] = useState([]);
  const [mySchedule, setSchedule] = useState({});
  const [page, setPage] = useState(0);

  useEffect(() => {
    csvJSON();
  }, [setData]);

  useEffect(() => {
    //console.log(mySchedule);
  }, [mySchedule]);

  const csvJSON = () => {
    fetch(festivals[festival].csv)
    .then(response => response.text())
    .then((str) => {
      let tempData = parseData(str);
      setData(tempData);
      let tempStages = extractProp("stage", tempData);
      setStages(tempStages);
    });
  }

  const editSchedule = (id) => {
    let tempSchedule = {...mySchedule};
    if(tempSchedule.hasOwnProperty(id)) {
      tempSchedule[id].conflict = false;
      tempSchedule[id].override = false;
      delete tempSchedule[id];
    } else {
      tempSchedule[id] = {conflict: false, override: false};
    }
    setSchedule(tempSchedule);
  }

  return (
    <div className="App">
      <div className="background">
        <img src={bgGradientLeft} id="bg1"/>
        <img src={bgGradientRight} id="bg2" />
      </div>
      <div className="content">
        <div className="nav-wrapper">
          <h4 
            onClick={(e) => setPage(0)} 
            id='lineup' 
            className={page === 0 ? 'selected' : ''}
          >
            Lineup
          </h4>
          <h4 
            onClick={(e) => setPage(1)} 
            id='schedule' 
            className={page === 1 ? 'selected' : ''}
          >
            My Schedule
          </h4>
        </div>
        <div className="day-header">
          <h1>{festivals[festival].name} Scheduler</h1>
        </div> 
        {page === 0 ?
          <Lineup festival={festival} stages={stages} data={data} mySchedule={mySchedule} editSchedule={editSchedule} />
          :
          <Schedule festival={festival} data={data} scheduleIds={mySchedule} editSchedule={editSchedule} setScheduleIds={setSchedule} />
        }
      </div>
    </div>
  );
}

export default App;
