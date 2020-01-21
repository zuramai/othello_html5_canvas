let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d')

let game = new Game(canvas);
let board = new Board;
board.createBlock()


function drawAll() {
    board.draw(ctx)    
}

function updateAll() {
    
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(game.isStarted == true) {
        drawAll();
        updateAll()
    }else if(game.isStarted == false && game.isCountdown == true){
        game.drawCountdownScreen(ctx)
    }else {
        game.drawHomeScreen(canvas,ctx)
    }

    requestAnimationFrame(loop)
}

canvas.addEventListener('click', (e) =>  {
    var clickLocation = game.getMousePosition(canvas, e)

    if(!game.isStarted) {
        if(game.isButtonColorClicked(clickLocation)) {
            game.start(canvas, ctx);
        }
    }
    
    console.log(board.isInside(clickLocation))
    if(blockLocation = board.isInside(clickLocation)) {
        if(game.isStarted) {
            board.clickBlock(ctx, blockLocation)
            board.getJumlahSisaSerongKiriBawah(blockLocation);
        }
    }
    console.log(clickLocation)
})

requestAnimationFrame(loop)
