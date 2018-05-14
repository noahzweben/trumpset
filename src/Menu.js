import React from 'react';
import Help from './images/icons/help.svg';
import Pause from './images/icons/pause.svg';
import Play from './images/icons/play.svg';
import Record from './images/icons/record.svg';
import OnRecord from './images/icons/onRecord.svg';
import Reset from './images/icons/reset.svg';
import Share from './images/icons/share.svg';
import ReactTooltip from 'react-tooltip';

var MobileDetect = require('mobile-detect');
var device = new MobileDetect(window.navigator.userAgent);
function Menu(props) {
	return (
		<div className="menu">
			<ReactTooltip place="bottom" type="light" effect="solid" />
			{(device.mobile() || device.tablet() || device.phone()) && (
				<img
					data-tip="Record"
					onClick={
						props.recording
							? e => props.stopRecord(e, true)
							: e => props.startRecord(e, true)
					}
					src={props.recording ? OnRecord : Record}
					className="menuButton"
				/>
			)}
			<img
				data-tip="Clear All"
				onClick={props.reset}
				src={Reset}
				className="menuButton"
			/>
			{!props.paused ? (
				<img
					data-tip="Pause"
					onClick={props.pause}
					src={Pause}
					className="menuButton "
				/>
			) : (
				<img
					data-tip="Play"
					onClick={props.play}
					src={Play}
					className="menuButton"
				/>
			)}
			<img
				onClick={props.share}
				data-tip="Share Beat"
				src={Share}
				className="menuButton "
			/>
			<img
				data-tip="Help"
				onClick={props.help}
				src={Help}
				className="menuButton "
			/>
		</div>
	);
}

export default Menu;
