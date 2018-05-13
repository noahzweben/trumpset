import React from 'react';
import Help from './images/icons/help.svg';
import Pause from './images/icons/pause.svg';
import Play from './images/icons/play.svg';
import Record from './images/icons/record.svg';
import Reset from './images/icons/reset.svg';
import Share from './images/icons/share.svg';

function Menu(props) {
	return (
		<div className="menu">
			<img src={Record} className="menuButton record" />
			<img onClick={props.reset} src={Reset} className="menuButton" />
			{!props.paused ? (
				<img onClick={props.pause} src={Pause} className="menuButton " />
			) : (
				<img onClick={props.play} src={Play} className="menuButton" />
			)}
			<img src={Share} className="menuButton " />
			<img onClick={props.help} src={Help} className="menuButton " />
		</div>
	);
}

export default Menu;
