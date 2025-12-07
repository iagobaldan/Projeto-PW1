export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
    }
    draw(ctx) {
        ctx.save();
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 0;
        ctx.font = this.fontSize + 'px ' + this.fontFamily;
        ctx.textAlign = 'left';
        ctx.fillStyle = this.game.fontColor;

        ctx.fillText('Pontuação: ' + this.game.score, 20, 50);

        const formattedTime = (this.game.time * 0.001).toFixed(1);
        ctx.fillText('Tempo: ' + formattedTime, 20, 80);

        $.each([...Array(this.game.lives)], (i) =>{
            const livesImage = $('#lives')[0];
            ctx.drawImage(livesImage, 25 * i + 20, 95, 25, 25);
        });

        if (this.game.gameOver) {
            ctx.textAlign = 'center';
            ctx.font = this.fontSize * 2 + 'px ' + this.fontFamily;

            if (this.game.score > this.game.winningScore) {
                ctx.fillText('Bem jogado!!!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                ctx.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                ctx.fillText('Tu é craque, chefe!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                ctx.fillText('GAME OVER', this.game.width * 0.5, this.game.height * 0.5 - 20);
                ctx.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                ctx.fillText('Mais sorte na próxima, colega', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        ctx.restore();
    }
}
