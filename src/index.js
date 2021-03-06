import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Drums from './drumset.svg';
import AudioClass from './AudioClass';
import Intro from './Intro';
import Start from './Start';
import Share from './Share';
import Menu from './Menu';
import Bass from './images/bass.png';
import BassPlay from './images/bass_play.png';
import LowRight from './images/lowRight.png';
import LowRightPlay from './images/lowRight_play.png';
import LowLeft from './images/lowLeft.png';
import LowLeftPlay from './images/lowLeft_play.png';
import TopRight from './images/topRight.png';
import TopRightPlay from './images/topRight_play.png';
import TopLeft from './images/topLeft.png';
import TopLeftPlay from './images/topLeft_play.png';
import Cheetoh from './images/cheetoh.png';
import CheetohPlay from './images/cheetoh_play.png';
import Hair from './images/hair.png';
import HairPlay from './images/hair_play.png';
import SymbolPic from './images/symbol.png';
import Snare from './images/snare.png';
import SnarePlay from './images/snare_play.png';
import SymbolPicPlay from './images/symbol_play.png';

import { transcribeBeats, loadBeats, loadFromURL } from './helper.js';
var MobileDetect = require('mobile-detect');
var device = new MobileDetect(window.navigator.userAgent);

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
			recording: false,
			playing: '',
			info: false,
			start: true,
			sharing: false,
			paused: false
		};

		const sounds = [
			{ name: 'fakeNews', file: '/audio/fakeNews.wav' },
			{ name: 'symbol', file: '/audio/symbol.wav' },
			{ name: 'snare', file: '/audio/snare.wav' },
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

		this.beatLoops = loadFromURL();
		this.inRecording = {};
		this.interval = 0;
		if (this.beatLoops.length > 0) {
			const startTime = this.beatLoops[0].beats[0].time;
			this.interval =
				this.beatLoops[0].beats[this.beatLoops[0].beats.length - 1]
					.time - startTime;
		}
		this.playTimeouts = [];
		this.playLoop = null;

		//bindings
		this.record = this.record.bind(this);
		this.stopRecord = this.stopRecord.bind(this);
		this.play = this.play.bind(this);
		this.logBeat = this.logBeat.bind(this);
		this.updateDimensions = this.updateDimensions.bind(this);
	}

	record(e, mobile) {
		if (e.key === 'l') {
			console.log(this.beatLoops);
			loadBeats(transcribeBeats(this.beatLoops));
		}

		if ((e.key === ' ' || mobile) && !this.state.recording) {
			this.inRecording = {
				playing: false,
				loopTime: new Date(),
				beats: []
			};
			if (this.state.paused) {
				this.resumeAll();
			}
			this.setState({ recording: true });
		}
	}

	stopRecord(e,mobile) {
		if ((e.key === ' ' || mobile) && this.state.recording) {
			this.setState({ recording: false });
			this.logBeat('end');
			const startTime = this.inRecording.beats[0].time;
			this.inRecording.beats.forEach(beat => {
				beat.time = beat.time - startTime; //saves in offset form;
			});
			this.beatLoops.push(this.inRecording);
			this.inRecording = {};

			if (this.beatLoops.length === 1) {
				const startTime = this.beatLoops[0].beats[0].time;
				this.interval =
					this.beatLoops[0].beats[this.beatLoops[0].beats.length - 1]
						.time - startTime;
				console.log(3);
				this.playAllBeats();
			} else {
				clearTimeout(this.playLoop);
				const catchup =
					this.interval - (new Date() - this.topOfLoopTime);
				console.log(2);
				var loopTO = setTimeout(() => this.playAllBeats(), catchup);
				this.playLoop = loopTO;
				this.playTimeouts.push(loopTO);
			}
		}
	}

	playAllBeats() {
		if (this.beatLoops.length > 0) {
			this.topOfLoopTime = new Date();
			this.beatLoops.forEach((beatLoop, i) => {
				if (
					(i === 0 && beatLoop.beats.length > 2) ||
					(i > 0 && beatLoop.beats.length > 1)
				) {
					this.playTimeouts.push(
						setTimeout(
							() => this.playBeats(beatLoop.beats, i),
							i === 0 ? 0 : beatLoop.loopTime
						)
					);
				}
			});
			var loopTO = setTimeout(() => this.playAllBeats(), this.interval);
			this.playLoop = loopTO;
			this.playTimeouts.push(loopTO);
		}
	}

	playBeats(beats, i) {
		const startTime = beats[0].time;
		beats.forEach(beat => {
			beat.name !== 'end' &&
				this.playTimeouts.push(
					setTimeout(() => this.play(beat.name, i), beat.time)
				);
		});
	}

	play(beatName, i) {
		clearTimeout(this.clearFaceTimeout);
		this.setState({ playing: beatName });
		this.audio[beatName].playSound(i);
		this.clearFaceTimeout = setTimeout(
			() => this.setState({ playing: '' }),
			500
		);
	}

	stopAll(pause = true) {
		if (pause) {
			this.setState({ paused: true });
		}
		clearTimeout(this.playLoop);
		this.playTimeouts.forEach(to => clearTimeout(to));
		this.playTimeouts = [];
		Object.keys(this.audio).forEach(key => this.audio[key].stopSound());
	}

	clearAll() {
		this.stopAll(false);
		this.beatLoops = [];
	}

	resumeAll() {
		this.setState({ paused: false });
		console.log(4);
		this.playAllBeats();
	}

	logBeat(name) {
		var now = new Date();
		var beat = {};
		beat.time = now;
		beat.name = name;
		if (name !== 'end') {
			this.play(beat.name);
		}
		if (this.inRecording.beats.length === 0) {
			//first beat in loop
			this.inRecording.loopTime = now - this.topOfLoopTime;
		}
		this.inRecording.beats.push(beat);
		//adjust offest
	}

	updateDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	handleClick(name) {
		this.state.recording ? this.logBeat(name) : this.play(name);
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
				{this.state.info && (
					<Intro close={() => this.setState({ info: false })} />
				)}
				{this.state.sharing && (
					<Share
						path={transcribeBeats(this.beatLoops)}
						close={() => this.setState({ sharing: false })}
					/>
				)}
				{this.state.start && (
					<Start
						close={() => {
							this.audioContext.resume();
							this.setState({ start: false });
							this.resumeAll();
						}}
					/>
				)}

				<Menu
					share={() => {
						this.stopAll();
						this.setState({ sharing: true });
					}}
					recording={this.state.recording}
					startRecord={this.record}
					stopRecord={this.stopRecord}
					paused={this.state.paused}
					reset={() => this.clearAll()}
					pause={() => this.stopAll()}
					play={() => this.resumeAll()}
					help={() => {
						this.stopAll();
						this.setState({ info: true });
					}}
				/>

				{!(device.mobile() || device.tablet() || device.phone()) && <div style={{paddingTop:'10px'}} className="text-center">Hold Down Space to Record</div>}
				<div className="helperDiv">
					<img
						className="drums"
						src={Drums}
						ref={ref => (this.drumRef = ref)}
						useMap="#image-map"
					/>
					<img
						onClick={() => this.handleClick('pussy')}
						src={this.state.playing === 'pussy' ? BassPlay : Bass}
						className="face bass pointer"
					/>
					<img
						onClick={() => this.handleClick('fakeNews')}
						src={
							this.state.playing === 'fakeNews'
								? LowRightPlay
								: LowRight
						}
						className="face lowRight pointer"
					/>
					<img
						onClick={() => this.handleClick('crooked')}
						src={
							this.state.playing === 'crooked'
								? LowLeftPlay
								: LowLeft
						}
						className="face lowLeft pointer"
					/>
					<img
						onClick={() => this.handleClick('brag')}
						src={
							this.state.playing === 'brag'
								? TopLeftPlay
								: TopLeft
						}
						className="face topLeft pointer"
					/>
					<img
						onClick={() => this.handleClick('greatWall')}
						src={
							this.state.playing === 'greatWall'
								? TopRightPlay
								: TopRight
						}
						className="face topRight pointer"
					/>
					<img
						onClick={() => this.handleClick('china')}
						src={
							this.state.playing === 'china'
								? CheetohPlay
								: Cheetoh
						}
						className="face cheetoh pointer"
					/>
					<img
						onClick={() => this.handleClick('fired')}
						src={this.state.playing === 'fired' ? HairPlay : Hair}
						className="face hair pointer"
					/>
					<img
						onClick={() => this.handleClick('symbol')}
						src={
							this.state.playing === 'symbol'
								? SymbolPicPlay
								: SymbolPic
						}						className="face symbol pointer"
					/>
					<img
						onClick={() => this.handleClick('snare')}
						src={
							this.state.playing === 'snare'
								? SnarePlay
								: Snare
						}
						className="face snare pointer"
					/>
				</div>
				<div className="floor">A Donald Trumpset</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
