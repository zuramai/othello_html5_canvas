class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.isStarted = false;
        this.isCountdown = false;
        this.over = false; 
        this.playerColor = "";
        this.botColor = "";
        this.buttonBlack = {x: 200, y: canvas.height/2-50, w: 200, h: 100};
        this.buttonWhite = {x: 450, y: canvas.height/2-50, w: 200, h: 100};
        this.countdown = 3;
        this.turn = "player";
    }

    start(canvas, ctx) {
        this.isCountdown = true;
        let countdown = setInterval(() => {
            if(this.countdown == 1) {
                this.isStarted = true;
                this.isCountdown = false;
                clearInterval(countdown);
                
            }else{
                this.countdown--;
            }
            console.log(this.countdown)
        }, 1000);
    }

    drawCountdownScreen(ctx) {
        ctx.beginPath()
        ctx.fillStyle = "#dfe4ea"
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.fill()
        
        
        ctx.font = "42px serif"
        ctx.fillStyle = "#000"
        ctx.fillText(this.countdown, canvas.width/2, canvas.height/2)
        
    }

    getMousePosition(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    drawHomeScreen(canvas, ctx) {
        ctx.beginPath()
        ctx.fillStyle = "#dfe4ea"
        ctx.rect(0,0, canvas.width, canvas.height)
        ctx.fill()
        
        ctx.fillStyle = "#000"
        ctx.font = "48px serif"
        ctx.fillText("Choose your color", 250, canvas.height/3)

        ctx.beginPath();
        ctx.fillStyle = "black"
        ctx.rect(this.buttonBlack.x, this.buttonBlack.y, this.buttonBlack.w, this.buttonBlack.h)
        ctx.fill()
        ctx.fillStyle = "white"
        ctx.font = "30px serif"
        ctx.fillText("BLACK", 250, canvas.height / 2)
        
        
        ctx.beginPath();
        ctx.fillStyle = "white"
        ctx.rect(this.buttonWhite.x, this.buttonWhite.y, this.buttonWhite.w, this.buttonWhite.h)
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.font = "30px serif"
        ctx.fillText("WHITE", 500, canvas.height / 2)
    }

    isButtonColorClicked(mousePosition) {
        let res = false;
        if(mousePosition.x >= this.buttonBlack.x &&
            mousePosition.x <= this.buttonBlack.x + this.buttonBlack.w &&
            mousePosition.y >= this.buttonBlack.y &&
            mousePosition.y <= this.buttonBlack.y + this.buttonBlack.h) {
                // IF BLACK BUTTON CLICKED
                this.playerColor = "black";
                this.botColor = "white"
                res = true;
        } else if (mousePosition.x >= this.buttonWhite.x &&
            mousePosition.x <= this.buttonWhite.x + this.buttonWhite.w &&
            mousePosition.y >= this.buttonWhite.y &&
            mousePosition.y <= this.buttonWhite.y + this.buttonWhite.h) {
                this.playerColor = "white";
                this.botColor = "black"
                res = true;
        }

        return res;
    }


}