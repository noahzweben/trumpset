const deepCopy = require('deep-copy');
var LZ = require('lzutf8');
var parse = require('url-parse');
function transcribeBeats(beatLoopsRef) {
	const beatLoops = deepCopy(beatLoopsRef);
	var beatURL = [];
	beatLoops.forEach(beatLoop => {
		var blArray = [];
		blArray.push(beatLoop.loopTime);
		var beatsArray = [];
		beatLoop.beats.forEach(beat => {
			beatsArray.push([beat.time, beat.name]);
		});
		blArray.push(beatsArray);
		beatURL.push(blArray);
	});

	const stringVer = JSON.stringify(beatURL);
	const lzString = LZ.compress(stringVer, { outputEncoding: 'Base64' });
	return lzString;
}

function loadFromURL() {
	const argString=window.location.pathname;
	if (argString) {
		return loadBeats(argString.substr(1));
	} else {
		return [];
	}
}

function loadBeats(lzString) {
	try {
		const beatLoopString = LZ.decompress(lzString, { inputEncoding: 'Base64' });
		const beatLoopSmallArray = JSON.parse(beatLoopString);
		var beatLoops = [];
		beatLoopSmallArray.forEach(beatLoop => {
			var blObj = {};
			blObj.loopTime = beatLoop[0];
			blObj.beats = [];
			beatLoop[1].forEach(beat => {
				var beatObj = { time: beat[0], name: beat[1] };
				blObj.beats.push(beatObj);
			});
			beatLoops.push(blObj);
		});
		console.log(beatLoops);
		return beatLoops;
	} catch (e) {
		return [];
	}
}

export { transcribeBeats, loadBeats, loadFromURL };
