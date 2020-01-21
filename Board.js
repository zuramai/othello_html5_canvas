class Board {
    constructor() {
        this.numX = 8;
        this.numY = 8;
        this.margin = 2;
        this.blockWidth = 60;
        this.blockHeight = 60;
        this.blocks = [];
        this.blockColor = "#009067";
        this.circles = [];
        this.chooseMove = false;
        this.legalMovesIndex = [];
        this.botBlockIndexes = [];
        this.botLegalMoveIndex = [];
        this.botBlockYangBisaJalan = [];
    }

    createBlock() {
        for (var i = 1; i <= this.numX; i++) {
            for (var j = 1; j <= this.numY; j++) {
                let status = 'empty'
                if(i==4 && j==4) {
                    status = "white"
                }else if(i==4 && j==5) {
                    status = 'black'
                }else if(i==5 && j==4) {
                    status = 'black'
                }else if(i==5 && j==5) {
                    status = 'white'
                }else{
                    status = 'empty'
                }
                let theBlock = {
                    x: j * this.blockWidth + j * this.margin + 50,
                    y: i * this.blockHeight + i * this.margin + 25,
                    status: status,
                    rowKe: i,
                    columnKe: j,
                    sisaSerongKiriBawah: 0,
                    sisaSerongKiriAtas: 0,
                    sisaSerongKananAtas: 0,
                    sisaSerongKananBawah: 0,
                };

                if(j == 1 || i == 8) theBlock.sisaSerongKiriBawah = 0;
                else if(i <= this.numX - (j-1)) theBlock.sisaSerongKiriBawah = j-1;
                else if(j >= this.numY - (i-1)) theBlock.sisaSerongKiriBawah = this.numY - i;
                
                
                if(j == 8 || i == 1) theBlock.sisaSerongKananAtas = 0;
                else if (j <= this.numX - (i - 1)) theBlock.sisaSerongKananAtas = i - 1;
                else if (i >= this.numY - (j - 1)) theBlock.sisaSerongKananAtas = this.numY - j;


                if (j == 1 || i == 1) theBlock.sisaSerongKiriAtas = 0;
                else if (j >= i) theBlock.sisaSerongKiriAtas = i-1;
                else if (i >= j+1) theBlock.sisaSerongKiriAtas = j-1


                if(j == 8 || i == 8) theBlock.sisaSerongKananBawah = 0;
                // else if(i == this.numY-i || j == this.numX-i) theBlock.sisaSerongKananBawah = this.numx
                else if(i == 7 || j == 7) theBlock.sisaSerongKananBawah = 1;
                else if(i == 6 || j == 6) theBlock.sisaSerongKananBawah = 2;
                else if(i == 5 || j == 5) theBlock.sisaSerongKananBawah = 3;
                else if(i == 4 || j == 4) theBlock.sisaSerongKananBawah = 4;
                else if(i == 3 || j == 3) theBlock.sisaSerongKananBawah = 5;
                else if(i == 2 || j == 2) theBlock.sisaSerongKananBawah = 6;
                else if(i == 1 || j == 1) theBlock.sisaSerongKananBawah = 7;

                // if (j == 1 || i == 1) theBlock.sisaSerongKananBawah = 0;
                // else if (j >= i) theBlock.sisaSerongKananBawah = i-1;
                // else if (i >= j+1) theBlock.sisaSerongKananBawah = j-1
                
                this.blocks.push(theBlock)
            }
        }
    }

    draw(ctx) {

        if(game.turn == "bot") {
            this.botMove(ctx);
        }
        
        ctx.beginPath();
        ctx.fillStyle = "#222222"
        ctx.rect(0,0,canvas.width, canvas.height)
        ctx.fill();

        ctx.font = "20px arial"
        ctx.fillStyle = "#000"
        ctx.fillText("Your color: ", 20, 20);

        ctx.font = "20px arial"
        ctx.fillText(game.playerColor.toUpperCase(), 20, 40);

        this.blocks.forEach(block => {
            ctx.beginPath();
            ctx.fillStyle = this.blockColor
            ctx.rect(block.x, block.y, this.blockWidth, this.blockHeight)  
            ctx.fill();

            ctx.beginPath()
            ctx.arc(block.x + this.blockWidth/2, block.y + this.blockHeight/2, 20, 0, 2 * Math.PI);
            if(block.status == "black") {
                ctx.fillStyle = "black"
                ctx.fill(); 
            }else if(block.status == "white") {
                ctx.fillStyle = "white"
                ctx.fill(); 
            }else if(block.status == "stroke") {
                ctx.strokeStyle = "white"
                ctx.stroke(); 
            }
            ctx.font = "20px arial"
            ctx.fillStyle = "blue"
            ctx.fillText(block.sisaSerongKananBawah, block.x + this.blockWidth / 2, block.y + this.blockHeight / 2);
        })
    }

    isInside(clickLocation) {
        let result = false;
        this.blocks.forEach((block, index) => {
            if(clickLocation.x >= block.x &&
                clickLocation.x <= block.x + this.blockWidth &&
                clickLocation.y >= block.y &&
                clickLocation.y <= block.y + this.blockHeight) {
                    result = {
                        blockIndex:index,
                        blockRow: block.rowKe,
                        blockColumn: block.columnKe,
                        status: block.status
                    }; 
                    console.log(block);
                }
        })
        return result;
    }

    clickBlock(ctx, blockLocation) {
        if(blockLocation.status == game.playerColor) {
            board.showLegalMove(ctx, blockLocation)
        }else if(blockLocation.status == "stroke") {
            this.playerMove(ctx, blockLocation);
        }
    }

    clearStrokeBlock() {
        this.blocks.forEach(block => {
            if (block.status == "stroke" ) {
                block.status = "empty"
            }
        });
        game.turn = "bot";
    }

    playerMove(move,blockLocation, who='player') {
        
        let sisaBlockKiri = blockLocation.blockIndex % 8;
        let sisaBlockKanan = 7 - sisaBlockKiri;
        let sisaBlockAtas = blockLocation.blockRow - 1;
        let sisaBlockBawah = 7 - sisaBlockAtas;
        let sisaBlockSerongKiriBawah = this.blocks[blockLocation.blockIndex].sisaSerongKiriBawah;
        let sisaBlockSerongKiriAtas = this.blocks[blockLocation.blockIndex].sisaSerongKiriAtas;
        let sisaBlockSerongKananAtas = this.blocks[blockLocation.blockIndex].sisaSerongKananAtas;
        let sisaBlockSerongKananBawah = this.blocks[blockLocation.blockIndex].sisaSerongKananBawah;

        let thisTurnColor = (who=='player' ? game.playerColor : game.botColor);
        let colorToTheLeft = [];
        
        console.log("Sisa Block Kiri: ", sisaBlockKiri);
        console.log("Sisa Block Kanan: ", sisaBlockKanan);
        console.log("Sisa Block Atas: ", sisaBlockAtas);
        console.log("Sisa Block Bawah: ", sisaBlockBawah);
        
        
        this.blocks[blockLocation.blockIndex].status = thisTurnColor
        for (var i = 1; i <= sisaBlockKiri; i++) {
            if (this.blocks[blockLocation.blockIndex - i].status != 'empty') {
                if (this.blocks[blockLocation.blockIndex - i].status !== thisTurnColor) {
                    colorToTheLeft.push(blockLocation.blockIndex - i)

                    if (this.blocks[blockLocation.blockIndex - i - 1].status == thisTurnColor) {
                        colorToTheLeft.forEach(theColorIndex => {
                            this.blocks[theColorIndex].status = thisTurnColor
                        });
                        console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                        colorToTheLeft = []
                    } else if (this.blocks[blockLocation.blockIndex - i - 1].status !== thisTurnColor) {
                        console.log("sebelahnya lagi white")
                        continue;
                    } else {
                        colorToTheLeft = [];
                        break;
                    }
                }else{
                    break;
                }

            }else{
                break;
            }
        }
        console.log("BLOCK TO THE LEFT => ", colorToTheLeft)

        for (var i = 1; i <= sisaBlockKanan; i++) {
            if (this.blocks[blockLocation.blockIndex + i].status != 'empty') {
                if (this.blocks[blockLocation.blockIndex + i].status !== thisTurnColor) {
                    colorToTheLeft.push(blockLocation.blockIndex + i)

                    if (this.blocks[blockLocation.blockIndex + i + 1].status == thisTurnColor) {
                        colorToTheLeft.forEach(theColorIndex => {
                            this.blocks[theColorIndex].status = thisTurnColor
                        });
                        console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                        colorToTheLeft = []
                    } else if (this.blocks[blockLocation.blockIndex + i + 1].status !== thisTurnColor) {
                        console.log("sebelahnya lagi white")
                        continue;
                    } else {
                        colorToTheLeft = [];
                        break;
                    }
                } else {
                    break;
                }

            } else {
                break;
            }
        }


        for (var i = 1; i <= sisaBlockBawah; i++) {
            if (this.blocks[blockLocation.blockIndex + i * 8].status != 'empty') {
                if (this.blocks[blockLocation.blockIndex + i * 8].status !== thisTurnColor) {
                    colorToTheLeft.push(blockLocation.blockIndex + i * 8)

                    if (this.blocks[blockLocation.blockIndex + (i * 8) + 8].status == thisTurnColor) {
                        colorToTheLeft.forEach(theColorIndex => {
                            this.blocks[theColorIndex].status = thisTurnColor
                        });
                        console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                        colorToTheLeft = []
                    } else if (this.blocks[blockLocation.blockIndex + (i * 8)  + 8].status !== thisTurnColor) {
                        console.log("sebelahnya lagi white")
                        continue;
                    } else {
                        colorToTheLeft = [];
                        break;
                    }
                } else {
                    break;
                }

            } else {
                break;
            }
        }


        for (var i = 1; i <= sisaBlockAtas; i++) {
            if (this.blocks[blockLocation.blockIndex - i * 8].status != 'empty') {
                if (this.blocks[blockLocation.blockIndex - i * 8].status !== thisTurnColor) {
                    colorToTheLeft.push(blockLocation.blockIndex - i * 8)

                    if (this.blocks[blockLocation.blockIndex - (i * 8) + 8].status == thisTurnColor) {
                        colorToTheLeft.forEach(theColorIndex => {
                            this.blocks[theColorIndex].status = thisTurnColor
                        });
                        console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                        colorToTheLeft = []
                    } else if (this.blocks[blockLocation.blockIndex - (i * 8) + 8].status !== thisTurnColor) {
                        console.log("sebelahnya lagi white")
                        continue;
                    } else {
                        colorToTheLeft = [];
                        break;
                    }
                } else {
                    break;
                }

            } else {
                break;
            }
        }


        for (var i = 1; i <= sisaBlockSerongKiriBawah; i++) {
            if (this.blocks[blockLocation.blockIndex + i * 7].status != 'empty') {
                if (this.blocks[blockLocation.blockIndex + i * 7].status !== thisTurnColor) {
                    colorToTheLeft.push(blockLocation.blockIndex + i * 7)

                    if (this.blocks[blockLocation.blockIndex + (i * 7) + 7].status == thisTurnColor) {
                        colorToTheLeft.forEach(theColorIndex => {
                            this.blocks[theColorIndex].status = thisTurnColor
                        });
                        console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                        colorToTheLeft = []
                    } else if (this.blocks[blockLocation.blockIndex + (i * 7) + 7].status !== thisTurnColor) {
                        console.log("sebelahnya lagi white")
                        continue;
                    } else {
                        colorToTheLeft = [];
                        break;
                    }
                } else {
                    break;
                }

            } else {
                break;
            }
        }

        
        for (var i = 1; i <= sisaBlockSerongKananAtas; i++) {
            if (this.blocks[blockLocation.blockIndex - i * 7].status != 'empty') {
                if (this.blocks[blockLocation.blockIndex - i * 7].status !== thisTurnColor) {
                    colorToTheLeft.push(blockLocation.blockIndex - i * 7)

                    if (this.blocks[blockLocation.blockIndex - (i * 7) - 7].status == thisTurnColor) {
                        colorToTheLeft.forEach(theColorIndex => {
                            this.blocks[theColorIndex].status = thisTurnColor
                        });
                        console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                        colorToTheLeft = []
                    } else if (this.blocks[blockLocation.blockIndex - (i * 7) - 7].status !== thisTurnColor) {
                        console.log("sebelahnya lagi white")
                        continue;
                    } else {
                        colorToTheLeft = [];
                        break;
                    }
                } else {
                    break;
                }

            } else {
                break;
            }
        }
        
        for (var i = 1; i <= sisaBlockSerongKananBawah; i++) {
            if (this.blocks[blockLocation.blockIndex - i * 7].status != 'empty') {
                if (this.blocks[blockLocation.blockIndex - i * 7].status !== thisTurnColor) {
                    colorToTheLeft.push(blockLocation.blockIndex - i * 7)

                    if (this.blocks[blockLocation.blockIndex - (i * 7) - 7].status == thisTurnColor) {
                        colorToTheLeft.forEach(theColorIndex => {
                            this.blocks[theColorIndex].status = thisTurnColor
                        });
                        console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                        colorToTheLeft = []
                    } else if (this.blocks[blockLocation.blockIndex - (i * 7) - 7].status !== thisTurnColor) {
                        console.log("sebelahnya lagi white")
                        continue;
                    } else {
                        colorToTheLeft = [];
                        break;
                    }
                } else {
                    break;
                }

            } else {
                break;
            }
        }
        
        this.clearStrokeBlock();
        
        if(who == "player") {
            console.log("sekarang bot yang jalan");
            game.turn = "bot";
        }else{
            console.log("sekarang player yang jalan");
            game.turn = "player";
        }
        this.blocks.forEach((block,index) => {
            if(block.status == game.botColor) {
                this.botBlockIndexes.push(index)
            }
        });
    }

    getBotLegalMove(blockLocation) {
        if (this.blocks[blockLocation.blockIndex].status != "empty" || this.blocks[blockLocation.blockIndex].status != "stroke") {
            // ILLEGAL MOVE

            this.botLegalMoveIndex = [];

            let sisaBlockKiri = blockLocation.blockIndex % 8;
            let sisaBlockKanan = 7 - sisaBlockKiri;
            let sisaBlockAtas = blockLocation.blockRow - 1;
            let sisaBlockBawah = 7 - sisaBlockAtas;
            let sisaBlockSerongKiriBawah = this.blocks[blockLocation.blockIndex].sisaSerongKiriBawah;
            let sisaBlockSerongKiriAtas = this.blocks[blockLocation.blockIndex].sisaSerongKiriAtas;
            let sisaBlockSerongKananAtas = this.blocks[blockLocation.blockIndex].sisaSerongKananAtas;
            let sisaBlockSerongKananBawah = this.blocks[blockLocation.blockIndex].sisaSerongKananBawah;

            console.log("Sisa Block Kiri: ", sisaBlockKiri);
            console.log("Sisa Block Kanan: ", sisaBlockKanan);
            console.log("Sisa Block Atas: ", sisaBlockAtas);
            console.log("Sisa Block Bawah: ", sisaBlockBawah);

            for (var i = 1; i <= sisaBlockKiri; i++) {
                if (this.blocks[blockLocation.blockIndex - i].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex - i].status == 'black') {
                        if (this.blocks[blockLocation.blockIndex - i - 1].status == "white") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex - i - 1].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex - i - 1, "bot")
                        } else {
                            continue;
                        }
                    }

                }
            }

            for (var i = 1; i <= sisaBlockKanan; i++) {
                if (this.blocks[blockLocation.blockIndex + i].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex + i].status == 'black') {
                        if (this.blocks[blockLocation.blockIndex + i + 1].status == "white") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex + i + 1].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex + i + 1, "bot")
                        } else {
                            continue;
                        }
                    }

                }
            }


            for (var i = 1; i <= sisaBlockBawah; i++) {
                if (this.blocks[blockLocation.blockIndex + i * 8].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex + i * 8].status == 'black') {
                        if (this.blocks[blockLocation.blockIndex + (i * 8) + 8].status == "white") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex + (i * 8) + 8].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex + (i * 8) + 8, "bot")
                        } else {
                            continue;
                        }
                    }

                }
            }


            for (var i = 1; i <= sisaBlockAtas; i++) {
                if (this.blocks[blockLocation.blockIndex - i * 8].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex - i * 8].status == 'black') {
                        if (this.blocks[blockLocation.blockIndex - (i * 8) - 8].status == "white") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex - (i * 8) - 8].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex - (i * 8) - 8, "bot")
                        } else {
                            continue;
                        }
                    }

                }
            }


            for (var i = 1; i <= sisaBlockSerongKiriBawah; i++) {
                if (this.blocks[blockLocation.blockIndex + i * 7].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex + i * 7].status !== thisTurnColor) {
                        colorToTheLeft.push(blockLocation.blockIndex + i * 7)

                        if (this.blocks[blockLocation.blockIndex + (i * 7) + 7].status == thisTurnColor) {
                            colorToTheLeft.forEach(theColorIndex => {
                                this.blocks[theColorIndex].status = thisTurnColor
                            });
                            console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                            colorToTheLeft = []
                        } else if (this.blocks[blockLocation.blockIndex + (i * 7) + 7].status !== thisTurnColor) {
                            console.log("sebelahnya lagi white")
                            continue;
                        } else {
                            colorToTheLeft = [];
                            break;
                        }
                    } else {
                        break;
                    }

                } else {
                    break;
                }
            }


            for (var i = 1; i <= sisaBlockSerongKananAtas; i++) {
                if (this.blocks[blockLocation.blockIndex - i * 7].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex - i * 7].status !== thisTurnColor) {
                        colorToTheLeft.push(blockLocation.blockIndex - i * 7)

                        if (this.blocks[blockLocation.blockIndex - (i * 7) - 7].status == thisTurnColor) {
                            colorToTheLeft.forEach(theColorIndex => {
                                this.blocks[theColorIndex].status = thisTurnColor
                            });
                            console.log("Yang warnanya bakal keubah => " + colorToTheLeft)
                            colorToTheLeft = []
                        } else if (this.blocks[blockLocation.blockIndex - (i * 7) - 7].status !== thisTurnColor) {
                            console.log("sebelahnya lagi white")
                            continue;
                        } else {
                            colorToTheLeft = [];
                            break;
                        }
                    } else {
                        break;
                    }

                } else {
                    break;
                }
            }

            for(var i = 1; i <= sisaBlockSerongKiriAtas; i++) {
                if (this.blocks[blockLocation.blockIndex - i * 9].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex - i * 9].status == 'black') {
                        if(this.blocks[blockLocation.blockIndex - (i * 9) - 9].status == "white") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex - (i * 9) - 9].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex - (i * 9) - 9, "bot")
                        } else {
                            continue;
                        }
                    }
                    
                }
            }

            for(var i = 1; i <= sisaBlockSerongKananBawah; i++) {
                if (this.blocks[blockLocation.blockIndex + i * 9].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex + i * 9].status == 'black') {
                        if(this.blocks[blockLocation.blockIndex + (i * 9) + 9].status == "white") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex + (i * 9) + 9].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex + (i * 9) + 9, "bot")
                        } else {
                            continue;
                        }
                    }
                    
                }
            }

        }
        // console.log(this.botLegalMoveIndex);
    }

    botMove(ctx) {
        this.getAllBotThatCanMove();
        let botMoveToBlock = this.decideBotWhereToMove();
        console.log(this.botLegalMoveIndex);
        // let theBlockIndex = get_random(this.botBlockIndexes);
        // let block = this.blocks[theBlockIndex];
        // let blockLocation = {
        //     blockIndex: theBlockIndex,
        //     blockRow: block.rowKe,
        //     blockColumn: block.columnKe,
        //     status: block.status
        // }
        // this.getBotLegalMove(blockLocation);
        console.log("botnya bisa jalan ke => ",this.botLegalMoveIndex)
        // let botMoveTo = get_random(this.botLegalMoveIndex);
        // let botMoveToBlock =  {
        //     blockIndex: botMoveTo,
        //     blockRow: block.rowKe,
        //     blockColumn: block.columnKe,
        //     status: block.status
        // }
        // console.log("botnya jalan ke block ");
        // console.log(botMoveToBlock)

        this.playerMove(ctx, botMoveToBlock, "bot");
        
        // let theBlock = this.blocks[theBlockIndex]
        // this.blocks[theBlockIndex-1].status = game.botColor;
    }

    getAllBotThatCanMove() {
        this.blocks.forEach((block, index) => {
            if(block.status == game.botColor) {
                let blockLocation = {
                    blockIndex: index,
                    blockRow: block.rowKe,
                    blockColumn: block.columnKe,
                    status: block.status
                }

                this.getBotLegalMove(blockLocation)
            }
        });
    }

    decideBotWhereToMove() {
        console.log("available blockbot to move => ",this.botLegalMoveIndex)
        let botMoveToIndex = get_random(this.botLegalMoveIndex);
        let botMoveTo = this.blocks[botMoveToIndex];
        let botMoveToBlock = {
            blockIndex: botMoveToIndex,
            blockRow: botMoveTo.rowKe,
            blockColumn: botMoveTo.columnKe,
            status: botMoveTo.status
        }

        return botMoveToBlock
    }

    showLegalMove(ctx, blockLocation) {
        if (!this.legalMovesIndex.includes(blockLocation.blockIndex) && this.blocks[blockLocation.blockIndex].status == "empty") {
            console.log("ILLEGAL MOVE")
            return
        }
        
        // this.blocks.forEach(block => {
        //     block.status = "stroke"
            
        // });

        if (this.blocks[blockLocation.blockIndex].status != "empty" || this.blocks[blockLocation.blockIndex].status != "stroke") {
            // ILLEGAL MOVE

            this.legalMoveIndex = [];
            this.chooseMove = true;

            let sisaBlockKiri = blockLocation.blockIndex % 8;
            let sisaBlockKanan = 7 - sisaBlockKiri;
            let sisaBlockAtas = blockLocation.blockRow - 1;
            let sisaBlockBawah = 7 - sisaBlockAtas;
            let sisaBlockSerongKiriBawah = this.blocks[blockLocation.blockIndex].sisaSerongKiriBawah;
            let sisaBlockSerongKiriAtas = this.blocks[blockLocation.blockIndex].sisaSerongKiriAtas;
            let sisaBlockSerongKananAtas = this.blocks[blockLocation.blockIndex].sisaSerongKananAtas;
            let sisaBlockSerongKananBawah = this.blocks[blockLocation.blockIndex].sisaSerongKananBawah;
            
            console.log("Sisa Block Kiri: ", sisaBlockKiri);
            console.log("Sisa Block Kanan: ", sisaBlockKanan);
            console.log("Sisa Block Atas: ", sisaBlockAtas);
            console.log("Sisa Block Bawah: ", sisaBlockBawah);

            for(var i = 1; i <= sisaBlockKiri; i++) {
                if (this.blocks[blockLocation.blockIndex - i].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex - i].status == 'white') {
                        if(this.blocks[blockLocation.blockIndex - i - 1].status == "black") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex - i - 1].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex - i - 1)
                        } else {
                            continue;
                        }
                    }
                    
                }
            }
            
            for(var i = 1; i <= sisaBlockKanan; i++) {
                if (this.blocks[blockLocation.blockIndex + i].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex + i].status == 'white') {
                        if(this.blocks[blockLocation.blockIndex + i + 1].status == "black") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex + i + 1].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex + i + 1)
                        } else {
                            continue;
                        }
                    }
                    
                }
            }

            
            for(var i = 1; i <= sisaBlockBawah; i++) {
                if (this.blocks[blockLocation.blockIndex + i * 8].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex + i * 8].status == 'white') {
                        if(this.blocks[blockLocation.blockIndex + (i * 8) + 8].status == "black") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex + (i * 8) + 8].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex + (i * 8) + 8)
                        } else {
                            continue;
                        }
                    }
                    
                }
            }
            

            for(var i = 1; i <= sisaBlockAtas; i++) {
                if (this.blocks[blockLocation.blockIndex - i * 8].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex - i * 8].status == 'white') {
                        if(this.blocks[blockLocation.blockIndex - (i * 8) - 8].status == "black") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex - (i * 8) - 8].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex - (i * 8) - 8)
                        } else {
                            continue;
                        }
                    }
                    
                }
            }
            

            for(var i = 1; i <= sisaBlockSerongKiriBawah; i++) {
                if (this.blocks[blockLocation.blockIndex + i * 7].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex + i * 7].status == 'white') {
                        if(this.blocks[blockLocation.blockIndex + (i * 7) + 7].status == "black") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex + (i * 7) + 7].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex + (i * 7) + 7)
                        } else {
                            continue;
                        }
                    }
                    
                }
            }

            for(var i = 1; i <= sisaBlockSerongKananAtas; i++) {
                if (this.blocks[blockLocation.blockIndex - i * 7].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex - i * 7].status == 'white') {
                        if(this.blocks[blockLocation.blockIndex - (i * 7) - 7].status == "black") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex - (i * 7) - 7].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex - (i * 7) - 7)
                        } else {
                            continue;
                        }
                    }
                    
                }
            }

            for(var i = 1; i <= sisaBlockSerongKiriAtas; i++) {
                if (this.blocks[blockLocation.blockIndex - i * 9].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex - i * 9].status == 'white') {
                        if(this.blocks[blockLocation.blockIndex - (i * 9) - 9].status == "black") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex - (i * 9) - 9].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex - (i * 9) - 9)
                        } else {
                            continue;
                        }
                    }
                    
                }
            }

            for(var i = 1; i <= sisaBlockSerongKananBawah; i++) {
                if (this.blocks[blockLocation.blockIndex + i * 9].status != 'empty') {
                    if (this.blocks[blockLocation.blockIndex + i * 9].status == 'white') {
                        if(this.blocks[blockLocation.blockIndex + (i * 9) + 9].status == "black") {
                            continue;
                        } else if (this.blocks[blockLocation.blockIndex + (i * 9) + 9].status == "empty") {
                            this.drawLegalMove(blockLocation.blockIndex + (i * 9) + 9)
                        } else {
                            continue;
                        }
                    }
                    
                }
            }
            
        }
    }

    drawLegalMove(index, legalFor = "player") {
        this.blocks[index].status = "stroke";
        if(legalFor == "player") {
            this.legalMoveIndex.push(index)
        }else{
            this.botLegalMoveIndex.push(index)
        }
    }

    getJumlahSisaSerongKiriBawah(blockLocation) {
        let jumlah = 0;
        for(var i = 1; i<=7; i++) {
            if(typeof this.blocks[blockLocation.blockIndex + (i*7)] !== 'undefined') {
                jumlah += 1;   
                i++;
            }else{
                // console.log(typeof this.blocks[blockLocation.blockIndex] === 'undefined')
                break;
            }
        }
        console.log("jumlah serong kiri bawah => ", jumlah)
    }
}