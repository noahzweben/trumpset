import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Drums from './drumset.svg';
import AudioClass from './AudioClass';

import Bass from './images/bass.png'
import BassPlay from './images/bass_play.png'
import LowRight from './images/lowRight.png'
import LowRightPlay from './images/lowRight_play.png'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
			recording: false,
			playing: ''
		};

		const sounds = [
			{ name: 'fakeNews', file: '/audio/fakeNews.wav' },
			{ name: 'china', file: '/audio/china.wav' },
			{ name: 'greatWall', file: '/audio/greatWall.wav' },
			{ name: 'brag', file: '/audio/brag.wav' },
			{ name: 'pussy', file: '/audio/pussy.wav' },
			{ name: 'crooked', file: '/audio/crooked.wav' },
			{ name: 'fired', file: '/audio/fired.wav' }
		];

		this.audio = {};
		this.audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();
		sounds.forEach(
			sound =>
				(this.audio[sound.name] = new AudioClass(
					sound,
					this.audioContext
				))
		);

		this.beatLoops = [];
		this.inRecording = {};
		this.interval = 0;
		this.playTimeouts = [];
		this.playLoop = null;

		//bindings
		this.record = this.record.bind(this);
		this.stopRecord = this.stopRecord.bind(this);
		this.play = this.play.bind(this);
		this.logBeat = this.logBeat.bind(this);
		this.updateDimensions = this.updateDimensions.bind(this);
	}

	record(e) {
		// if (e.key === 'l') {
		// 	console.log(this.beatLoops[0].loopTime);
		// }

		if (e.key === ' ' && !this.state.recording) {
			this.inRecording = {
				playing: false,
				loopTime: new Date(),
				beats: []
			};
			this.setState({ recording: true });
		}
	}

	stopRecord(e) {
		if (e.key === ' ' && this.state.recording) {
			this.setState({ recording: false });
			this.logBeat('end');
			this.beatLoops.push(this.inRecording);
			this.inRecording = {};

			if (this.beatLoops.length === 1) {
				const startTime = this.beatLoops[0].beats[0].time;
				this.interval =
					this.beatLoops[0].beats[this.beatLoops[0].beats.length - 1]
						.time - startTime;
				this.playAllBeats();
			} else {
				clearTimeout(this.playLoop);
				const catchup =
					this.interval - (new Date() - this.topOfLoopTime);
				var loopTO = setTimeout(() => this.playAllBeats(), catchup);
				this.playLoop = loopTO;
				this.playTimeouts.push(loopTO);
			}
		}
	}

	playAllBeats() {
		this.topOfLoopTime = new Date();
		this.beatLoops.forEach((beatLoop, i) => {
			if (
				(i === 0 && beatLoop.beats.length > 2) ||
				(i > 0 && beatLoop.beats.length > 1)
			) {
				this.playTimeouts.push(
					setTimeout(
						() => this.playBeats(beatLoop.beats),
						i === 0 ? 0 : beatLoop.loopTime
					)
				);
			}
		});
		var loopTO = setTimeout(() => this.playAllBeats(), this.interval);
		this.playLoop = loopTO;
		this.playTimeouts.push(loopTO);
	}

	playBeats(beats) {
		const startTime = beats[0].time;
		beats.forEach(beat => {
			beat.play &&
				this.playTimeouts.push(
					setTimeout(
						() => beat.play(beat.name),
						beat.time - startTime
					)
				);
		});
	}

	play(beatName) {
		clearTimeout(this.clearFaceTimeout);
		this.setState({ playing: beatName });
		this.audio[beatName].playSound();
		this.clearFaceTimeout = setTimeout(() => this.setState({ playing: '' }), 500);
	}

	stopAll() {
		clearTimeout(this.playLoop);
		this.playTimeouts.forEach(to => clearTimeout(to));
		this.playTimeouts = [];
		Object.keys(this.audio).forEach(key => this.audio[key].stopSound());
	}

	clearAll() {
		this.stopAll();
		this.beatLoops = [];
	}

	resumeAll() {
		this.playAllBeats();
	}

	logBeat(name) {
		var now = new Date();
		var beat = {};
		beat.time = now;
		beat.name = name;
		if (name !== 'end') {
			beat.play = this.play;
			beat.play(beat.name);
		}
		if (this.inRecording.beats.length === 0) {
			//first beat in loop
			this.inRecording.loopTime = now - this.topOfLoopTime;
		}
		this.inRecording.beats.push(beat);
	}

	updateDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}


	handleClick(name) {
		this.state.recording
			? this.logBeat(name)
			: this.play(name);
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
		window.addEventListener('keydown', this.record);
		window.addEventListener('keyup', this.stopRecord);
	}

	componentWillUnmount() {
		// window.removeEventListener('resize', this.updateDimensions);
		window.removeEventListener('keydown', this.record);
		window.removeEventListener('keyup', this.stopRecord);
	}

	render() {
		return (
			<div className="App">
				<div onClick={() => this.audioContext.resume()}>
					Start MUSIC
				</div>
				<div onClick={() => this.clearAll()}>Reset</div>
				<div onClick={() => this.stopAll()}>Pause</div>
				<div onClick={() => this.resumeAll()}>Resume</div>

				<div className="helperDiv">
				<img className='drums' src={Drums} ref={ref => this.drumRef = ref} useMap="#image-map" />
				<img onClick={() => this.handleClick('pussy')} src={this.state.playing==='pussy' ? BassPlay : Bass} className='face bass pointer'/>
				<img onClick={() => this.handleClick('fakeNews')} src={this.state.playing==='fakeNews' ? LowRightPlay : LowRight} className='face lowRight pointer'/>

				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
