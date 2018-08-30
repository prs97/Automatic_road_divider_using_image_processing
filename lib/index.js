const five = require("johnny-five");

const Raspi = require("raspi-io");
const board = new five.Board({
	io: new Raspi()
});

const resetBoard = require("./reset");
const forwardBoard = require("./forward");
const reverseBoard = require("./reverse");
const camera = require("./camera");

var barStatusCode = 1;

const interval = 30; //in seconds
module.exports = function() {
	board.on("ready", function() {
		console.log("Board is Initialized");
		const leds = new five.Leds(["P1-7","P1-13","P1-15","P1-23"]);
		LoopingFunction();
		setInterval(LoopingFunction, interval*1000);

		function LoopingFunction() {
			camera(function (direction) {
				if(direction === "Forward" && barStatusCode === 1) {
					console.log("Forwarding the board");
					forwardBoard(board, leds);
					barStatusCode = -1;
				}else if(direction === "Reverse" && barStatusCode === -1) {
					console.log("Reversing the board");
					reverseBoard(board, leds);
					barStatusCode = 1;
				}
			});
			console.log("Reseting the board");
			resetBoard(board, leds);
		}
	})
};
