import React from 'react';

function Intro(props) {
	return (
		<div className="modalHolder">
			<div className="backdrop" />
			<div className="modal">
				<div className="instructions">
					<div className="title">
						Welcome to your TrumpSet Drumset!
					</div>
					<div>
						<span className="num">1)</span> Click on the drums to
						play.
					</div>
					<div>
						<span className="num">2)</span> To record a baseline
						beat, hold down the space bar (or record button on
						mobile devices), click on the drums, and then release
						the spacebar when you want the beat to repeat. The loop
						starts on your first sound, not the record button.
					</div>
					<div>
						<span className="num">3)</span> You can add tracks by
						hitting spacebar, and recording. They will keep their
						place in the loop track! (Depending on when you release
						the spacebar, you may have to wait one cycle to hear
						your addition).
					</div>
					<div>
						<span className="num">4)</span> It's still a little
						buggy so sometimes the trumpset makes an unpleasant
						sound, but then again so does Trump. If this happens
						just refresh and/or impeach!
					</div>
					<div>
						<span className="num">5)</span> When you're ready share
						away. We don't keep any of your info.
					</div>

					<div className="button" onClick={props.close}>
						Got it! I Love Obamacare!
					</div>
				</div>
			</div>
		</div>
	);
}

export default Intro;
