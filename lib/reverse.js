
module.exports = function(board, leds) {
    leds.on();
    board.wait(2000, function(){
        leds[3].off();
        console.log('m2 reverse');
        board.wait(5000, function(){
            leds[3].on();
            leds[2].on();
            console.log('both m off');
            board.wait(2000, function(){
                leds[1].off();
                console.log('m1 reverse');
                board.wait(5000, function(){
                    leds[1].on();
                    leds[0].on();
                    console.log('agin both off');
                })
            })
        });
    });
}