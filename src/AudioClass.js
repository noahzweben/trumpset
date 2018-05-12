class AudioClass {
	constructor(sound, context) {
		this.context = context;
		this.name = sound.name;
		this.buffer = null;
		this.loadSound(sound.file);
		this.beat = [];
		this.active = [];

		//bindings
		this.playSound = this.playSound.bind(this);
	}

	loadSound(url) {
		const self = this;
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function() {
			self.context.decodeAudioData(
				request.response,
				function(buffer) {
					self.buffer = buffer;
				},
				error => console.log(error)
			);
		};
		request.send();
	}

	// bassEffect() {
	// 	let osc = this.context.createOscillator();
	// 	osc.frequency.value = 100;
	// 	osc.type = 'sine';
	// 	osc.detune.value = 0;

	// 	let gainNode = this.context.createGain();
	// 	gainNode.gain.value = 0.5;
	// 	osc.connect(gainNode);
	// 	gainNode.connect(this.context.destination);
	// 	osc.start();
	// 	this.active.push(osc);
	// }

	playSound() {
		if (this.buffer) {
			var source = this.context.createBufferSource(); // creates a sound source
			source.buffer = this.buffer; // tell the source which sound to play
			source.connect(this.context.destination); // connect the source to the context's destination (the speakers)
			source.start();
			this.active.push(source);
		} // play the source now
	}

	stopSound() {
		if (this.active.length > 0) {
			this.active.forEach(activeNode => activeNode.stop());
		}
	}
}

export default AudioClass;
