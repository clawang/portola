import React, { useEffect, useState, useRef } from 'react';
import {idsToSchedule, findConflicts, splitActs, findGaps, findArtistsWithinTime} from './parseData';
import pin from './images/pin.png';

const dayMap = [[
	{
		name: 'Friday, April 22',
		date: '04/22',
	},
	{
		name: 'Saturday, April 23',
		date: '04/23',
	},
	{
		name: 'Sunday, April 24',
		date: '04/24',
	}
],
[
	{
		name: 'Saturday, September 24',
		date: '09/24',
	},
	{
		name: 'Sunday, September 25',
		date: '09/25',
	}
]];

function Schedule(props) {

	return (
		<div className="schedule-wrapper">
			<h2>Your Schedule</h2>
			{dayMap[props.festival].map((day, index) => {
				return <Day key={index} festival={props.festival} date={index} data={props.data} scheduleIds={props.scheduleIds} setScheduleIds={props.setScheduleIds} editSchedule={props.editSchedule}/>;
			})}
			</div>
	);
}

function Day(props) {

	const [schedule, setSchedule] = useState([]);
	const [conflicts, setConflicts] = useState({});
	const [gaps, setGaps] = useState({});

	useEffect(() => {
		let tempSched = idsToSchedule(props.scheduleIds, props.data);
		tempSched = tempSched.filter(item => item.date === dayMap[props.festival][props.date].date);
		if(tempSched.length > 0) {
			let tempConflicts = findConflicts(tempSched);
			let tempGaps = findGaps(tempSched);
			setSchedule(tempSched);
			setConflicts(tempConflicts);
			setGaps(tempGaps);
		}
	}, [props.scheduleIds]);

	const createSchedule = () => {
		let rows = [];
		schedule.forEach((act, i) => {
			if(gaps.hasOwnProperty(i)) {
				rows.push(<Gap 
					key={gaps[i][0].concat(gaps[i][1])}
					data={gaps[i]} 
					day={props.date}
					allActs={props.data} 
					editSchedule={props.editSchedule} 
					festival={props.festival} />);
			}
			if(act.conflict && conflicts.hasOwnProperty(i) && !act.override) {
				let key = String(conflicts[i][0].id);
				key = key.concat(conflicts[i][1].id)
				rows.push(<Conflict 
					key={key}
					index={i}
					conflicts={conflicts}
					setConflicts={setConflicts}
					schedule={schedule}
					setSchedule={setSchedule}
					editSchedule={props.editSchedule} />);
			} else if(!act.conflict || act.override) {
				rows.push(<ScheduleItem data={act} />);
			}
		});
		if(schedule.length <= 0) {
			rows.push(<p>Nothing here yet.</p>);
		}
		return rows;
	}

	return (
		<div className="schedule-day">
			<h3>{dayMap[props.festival][props.date].name}</h3>
			{createSchedule()}
		</div>
	);
}

function Conflict(props) {

	const split = () => {
		const firstActId = props.conflicts[props.index][0].id;
		const secondActId = props.conflicts[props.index][1].id;
		let tempSched = [...props.schedule];
		let tempConflicts = {...props.conflicts};
		delete tempConflicts[props.index];
		props.setConflicts(tempConflicts);
		const conflictsArray = Object.values(tempConflicts);
		if(conflictsArray.findIndex(c => c[0].id === firstActId || c[1].id === firstActId) < 0) {
			const firstAct = tempSched.find(act => act.id === firstActId);
			firstAct.override = true;
		}
		if(conflictsArray.findIndex(c => c[0].id === secondActId || c[1].id === secondActId) < 0) {
			const secondAct = tempSched.find(act => act.id === secondActId);
			secondAct.override = true;
		}
		props.setSchedule(tempSched);
	}

	return (
		<div className="conflict-wrapper">
			<h3>These two acts conflict:</h3>
			<div className="conflict-acts-wrapper">
				<Act data={props.conflicts[props.index][0]} context={1} editSchedule={props.editSchedule} />
				<Act data={props.conflicts[props.index][1]} context={1} editSchedule={props.editSchedule} />
			</div>
			<button onClick={split}>See both</button>
		</div>
	);
}

function Gap(props) {

	const [artists, setArtists] = useState([]);
	const [open, setOpen] = useState(false);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		let dayActs = props.allActs.filter(act => act.date === dayMap[props.festival][props.day].date);
		let tempArtists = findArtistsWithinTime(props.data[0], props.data[1], dayActs);
		setArtists(tempArtists);
	}, [setArtists]);

	return (
		<div className={"gap-wrapper" + (hidden ? ' hidden' : '')}>
			<p onClick={() => setHidden(true)} id="close">X</p>
			<h3>There's a gap in your schedule.</h3>
			{artists.length > 0 ?
				<div>
					<p>Here are some artists playing within this time.</p>
					<div className={"gap-artists-wrapper" + (open ? ' open' : '')}>
						{artists.map(act => <Act key={act.id} data={act} editSchedule={props.editSchedule} />)}
					</div>
					<a onClick={() => setOpen(!open)}>{open ? 'Collapse' : 'See All →'}</a>
				</div>
				:
				<p>Try exploring the festival grounds or getting something to eat!</p>
			}
		</div>
	);
}

function ScheduleItem(props) {
	return (
		<div className="schedule-item-wrapper">
			<p>{props.data.startTime} - {props.data.endTime}</p>
			<h3>{props.data.name}</h3>
			<div className="schedule-item-location">
				<img src={pin} />
				<h4>{props.data.stage}</h4>
			</div>
		</div>
	);
}

function Act(props) {

	const handleClick = (e) => {
		props.editSchedule(props.data.id);
	}

	return (
		<div className="act-wrapper" onClick={handleClick} style={{cursor: 'pointer'}}>
			<p>{props.data.startTime} - {props.data.endTime}</p>
			<h3>{props.data.name}</h3>
			<div className="act-location">
				<img src={pin} />
				<h4>{props.data.stage}</h4>
			</div>
			<a className="action">{props.context ? 'Remove' : 'Add'}</a>
		</div>
	);
}

export default Schedule;