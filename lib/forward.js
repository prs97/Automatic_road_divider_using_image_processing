
module.exports = function(board, leds) {
    leds.on();    
    board.wait(2000,function(){
        leds[0].off();
        console.log('m1 forward');
        board.wait(5000, function(){
            leds[0].on();
            leds[1].on();
            console.log('both m off');
            board.wait(2000, function(){
                leds[2].off();
                console.log('m2 forward');
                board.wait(5000,function(){
                    leds[2].on();
                    leds[3].on();
                })
            })
        });
    })
}