class AudioClass {
	constructor(sound, context) {
		this.context = context;
		this.name = sound.name;
		this.buffer = null;
		this.loadSound(sound.file);
		this.beat = [];
		this.active = {};

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

	playSound(i) {
		if (this.buffer) {
			if (this.active[i]) {
				this.active[i].stop();
				this.active[i] = null;
			}
			var source = this.context.createBufferSource(); // creates a sound source
			source.buffer = this.buffer; // tell the source which sound to play
			source.connect(this.context.destination); // connect the source to the context's destination (the speakers)
			source.start();
			this.active[i] = source;
		} // play the source now
	}

	stopSound() {
		Object.keys(this.active).forEach(
			key => this.active[key] && this.active[key].stop()
		);
	}
}

export default AudioClass;
