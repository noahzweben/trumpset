import React from 'react';

function Start(props) {
	return (
		<div className="modalHolder">
			<div className="backdrop" />
			<div className="button startButton" onClick={props.close}>
				Let's get this party started.
			</div>
		</div>
	);
}

export default Start;
