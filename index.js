import Tesseract from 'tesseract.js';

const video = document.querySelector('video');
const read = document.querySelector('#read');
const start = document.querySelector('#start');
const canvas = document.querySelector('canvas');

const voices = window.speechSynthesis.getVoices();
const voice = voices.find(voice => voice.lang === 'nl-NL');

if (navigator.mediaDevices.getUserMedia === undefined) {
	navigator.mediaDevices.getUserMedia = function (constraints) {

		// First get ahold of the legacy getUserMedia, if present
		var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		// Some browsers just don't implement it - return a rejected promise with an error
		// to keep a consistent interface
		if (!getUserMedia) {
			return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		}

		// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
		return new Promise(function (resolve, reject) {
			getUserMedia.call(navigator, constraints, resolve, reject);
		});
	}
}

function startProcess() {
	const stream = navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			facingMode: 'environment',
			optional: [
				{
					width: { min: 640 }
				},
				{
					height: { min: 360 }
				}
			]
		}
	}).then(stream => {
		video.srcObject = stream;
		video.play();
	});

	read.addEventListener('click', readText);

	function readText() {
		const ctx = canvas.getContext('2d');

		ctx.drawImage(video, 0, 0);

		Tesseract.recognize(
			ctx,
			'eng',
			{ logger: m => console.log(m) }
		).then(result => {
			if (result && result.text) {
				console.log(result.text);
				console.log(result.words)
				const value = result.text;
				console.log(value);
				// talk(value);
			}
		});
	}

	function talk(string) {
		const utter = new SpeechSynthesisUtterance();
		utter.rate = 1;
		utter.pitch = 0.8;
		utter.text = string;
		utter.voice = voice;
		window.speechSynthesis.speak(utter);
	}
}

start.addEventListener('click', startProcess);
