import React, { useEffect, useState, useRef } from 'react';
import {timeSortFunction, extractProp} from './parseData';

const dayMaps = [
	{
		0: '04/22',
		1: '04/23',
		2: '04/24',
	},
	{
		0: '09/24',
		1: '09/25'
	}
];

const nameMap = [['Friday', 'Saturday', 'Sunday'], ['Saturday', 'Sunday']];

function Lineup(props) {

	const [day, setDay] = useState(0);
	const [dates, setDates] = useState([]);
	
	useEffect(() => {
		let tempDates = extractProp("date", props.data);
		setDates(tempDates);
	}, [props.data]);

	return (
		<div>
			<div className="day-wrapper">
				{dates.map((date, index) => {
					return <button onClick={() => setDay(index)} className={day === index ? 'selected' : ''}>{nameMap[props.festival][index]}</button>;
				})}
	        </div>
			<div className="lineup-wrapper">
				<div className="lineup">
		        	{props.stages.map((stage, i) => <Stage key={i} festival={props.festival} name={stage} data={props.data} day={day} mySchedule={props.mySchedule} editSchedule={props.editSchedule} />)}
		    	</div>
	    	</div>
	    </div>
	);
}

function Stage(props) {

	const [acts, setActs] = useState([]);

	useEffect(() => {
		let tempActs = props.data.filter(act => act.stage === props.name && act.date === dayMaps[props.festival][props.day]);
		tempActs.sort(timeSortFunction);
		setActs(tempActs);
	}, [props.data, props.day]);

	return (
		<div className="stage-wrapper">
			<h2>{props.name}</h2>
			{acts.map(item => <Artist key={item.id} data={item} mySchedule={props.mySchedule} editSchedule={props.editSchedule}/>)}
		</div>
	);
}

function Artist(props) {

	const [schedule, setSchedule] = useState(props.mySchedule);

	useEffect(() => {
		setSchedule(props.mySchedule);
	}, [props.mySchedule])

	const handleClick = (e) => {
		props.editSchedule(props.data.id);
	}

	return (
		<div className={"artist-wrapper" + (schedule.hasOwnProperty(props.data.id) ? ' selected' : '')} onClick={handleClick}>
			<h3>{props.data.name}</h3>
			<p>{props.data.startTime} - {props.data.endTime}</p>
		</div>
	);
}

export default Lineup;