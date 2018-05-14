import React from 'react';

function Share(props) {
	const link = `${window.location.origin}/${props.path}`;
	return (
		<div className="modalHolder">
			<div className="backdrop" />
			<div className="modal">
				<div className="instructions">
					<div className="title">
						Share your masterpiece, you small-handed fiend!
					</div>
					<div className="button" onClick={() => shareFB(link)}>
						Share on Facebook
					</div>

					<div>Or share this link:</div>
					<div className="linkBox">
						<code>
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={link}
							>
								{link}
							</a>
						</code>
					</div>

					<div className="button small" onClick={props.close}>
						Done
					</div>
				</div>
			</div>
		</div>
	);
}

function shareFB(link) {
	window.FB.ui(
		{
			method: 'share',
			display: 'popup',
			href: link
		},
		function(response) {}
	);
}

export default Share;
