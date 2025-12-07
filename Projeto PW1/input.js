export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        $(window).on('keydown', e => {
            if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            } else if (e.key === 'd') this.game.debug = !this.game.debug;

            if (this.game.audio && !this.game.audio.started) this.game.audio.start();
        });
        $(window).on('keyup', e => {
            if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}