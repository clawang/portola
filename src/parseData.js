const parseData = (str) => {
	let data = str.split('\n').map(i=>i.split(','));
	let headers = data.shift();
	//data = data.filter(d => d.length >= 7);
	let output = data.map((d, index)=>{
		let obj = {};
		headers.map((h,i)=> {
			let str = d[i].trim();
			str = str.replace('|', ',');
			obj[headers[i].trim()] = str;
		});
		obj.id = index;
		return obj;
	});
	return output;
};

const extractProp = (prop, arr) => {
	let temp = [];
	for(let i = 0; i < arr.length; i++) {
		let c = arr[i][prop];
		if(!temp.includes(c) && c !== "") {
			temp.push(c);
		}
	}
	temp.sort();
	return temp;
};

const strToDate = (str) => {
	return new Date((str.includes('AM') ? '1970/01/02 ' : '1970/01/01 ') + str);
}

const timeSortFunction = (a, b) => {
	return strToDate(a.startTime) - strToDate(b.startTime);
}

const idsToSchedule = (schedule, data) => {
	let tempSched = Object.getOwnPropertyNames(schedule).map(item => data[item]);
	tempSched.sort(timeSortFunction);
	return tempSched;
}

const findConflicts = (schedule) => {
	let endTime = strToDate('12:00 PM');
	let conflicts = {};
	for(let i = 0; i < schedule.length; i++) {
		const item = schedule[i];
		if(strToDate(item.startTime) < endTime) {
			item.conflict = true;
			schedule[i-1].conflict = true;
			let timeSlot = [];
			timeSlot.push(schedule[i-1]);
			timeSlot.push(item);
			conflicts[i-1] = timeSlot;
		} else {
			item.conflict = false;
		}
		endTime = strToDate(item.endTime);
	}
	return conflicts;
}

const splitActs = (a, b) => {
	let startTime = strToDate(a.startTime);
	let endTime = strToDate(b.endTime);
	let interval = (endTime - startTime) / 2;
	let newEnd = startTime + Number(interval);
}

const findGaps = (schedule) => {
	let endTime = strToDate('12:00 PM');
	let endTimeString = '12:00 PM';
	let gaps = {};
	for(let i = 0; i < schedule.length; i++) {
		const item = schedule[i];
		const gap = (strToDate(item.startTime) - endTime) / 60000;
		if(gap >= 60) {
			const gap = [endTimeString, item.startTime];
			gaps[i] = gap;
		}
		endTime = strToDate(item.endTime);
		endTimeString = item.endTime;
	}
	return gaps;
}

const findArtistsWithinTime = (startTime, endTime, data) => {
	const start = strToDate(startTime);
	const end = strToDate(endTime);
	let result = [];
	for(let i = 0; i < data.length; i++) {
		const item = data[i];
		const tempStart = strToDate(data[i].startTime);
		console.log(tempStart);
		if(tempStart >= start && tempStart < end) {
			result.push(data[i]);
		}
	}
	return result;
}

const orderLineup = () => {};

export {parseData, extractProp, timeSortFunction, idsToSchedule, findConflicts, splitActs, findGaps, findArtistsWithinTime};