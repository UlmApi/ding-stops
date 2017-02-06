'use strict'
const got = require('got');
const json2csv = require('json2csv');

const endpointBase = "http://ding.eu/ding3/XSLT_COORD_REQUEST?&jsonp=&boundingBox=&boundingBoxLU={minx}%3A{miny}%3AWGS84%5BDD.DDDDD%5D&boundingBoxRL={maxx}%3A{maxy}%3AWGS84%5BDD.DDDDD%5D&coordOutputFormat=WGS84%5BGGZHTXX%5D&type_1=STOP&outputFormat=json&inclFilter=1";
const epsilon = Math.pow(2, -1);

const queryStops = function(minx, miny, maxx, maxy, callback) {
	const url = endpointBase
		.replace("{minx}", minx)
		.replace("{miny}", miny)
		.replace("{maxx}", maxx)
		.replace("{maxy}", maxy);
	got(url).then(response => {
		const result = JSON.parse(response.body);
		if (result.pins.length > 0) {
			result.pins.forEach(callback);
		}
		else if (maxx - minx > epsilon)
		{
			const midx = (minx + maxx) / 2;
			const midy = (miny + maxy) / 2;
			queryStops(minx, miny, midx, midy, callback);
			queryStops(midx, miny, maxx, midy, callback);
			queryStops(minx, midy, midx, maxy, callback);
			queryStops(midx, midy, maxx, maxy, callback);
		}
	});
};

const exportStops = function(stops) {
	const result = json2csv({ data: stops, fields: ["stop_id", "stop_name", "stop_lon", "stop_lat"] });
	process.stdout.write(result);
}

const retrieveStops = function(minx, miny, maxx, maxy) {
	const stops = [];
	const stopsById = {};
	const callback = s => {
		var stopId = Number(s.stateless);
		if (stopId < 80000000) {
		var stop = {};
		stop.stop_id = s.stateless;
		stop.stop_name = s.locality + ", " + s.desc;
		var lonLat = s.coords.split(",");
		stop.stop_lon = Number(lonLat[0]/100000);
		stop.stop_lat = Number(lonLat[1]/100000);

		const existingStop = stopsById[stopId]
		if (existingStop &&(
			stop.stop_id !== existingStop.stop_id ||
			stop.stop_name !== existingStop.stop_name ||
			stop.stop_lon !== existingStop.stop_lon ||
			stop.stop_lat !== existingStop.stop_lat)) {
			throw new Error("Found existing stop with id " + stopId);
		}
		else {
			stopsById[stopId] = stop;
			stops.push(stop);
		}
		}
	};
	queryStops(minx, miny, maxx, maxy, callback);
	setTimeout(function () { exportStops(stops); }, 60000);
};

retrieveStops(9.2, 47.8, 10.4, 48.7);
