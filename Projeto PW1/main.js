import {
    Player
} from './player.js';
import {
    InputHandler
} from './input.js';
import {
    Background
} from './background.js';
import {
    FlyingEnemy,
    ClimbingEnemy,
    GroundEnemy
} from './enemies.js';
import {
    UI
} from './UI.js';

$(function () {
    const canvas = $('#canvas1')[0];
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 4;

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);

            this.enemies = [];
            this.particles = [];
            this.collisions = [];

            this.enemyTimer = 0;
            this.enemyInterval = 1000;

            this.maxParticles = 200;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 40000;
            this.winningScore = 25;
            this.gameOver = false;
            this.lives = 5;

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();

            this.audio = {
                boom: document.$('boom_sfx')[0],
                started: false,
                start() {
                    if (this.started || !this.boom) return;
                    this.started = true;
                    this.boom.play().then(() => {
                        this.boom.pause();
                        this.boom.currentTime = 0;
                    }).catch(() => {});
                },
                playBoom() {
                    if (!this.boom) return;
                    const sfx = this.boom.cloneNode();
                    sfx.volume = 0.9;
                    sfx.play().catch(() => {});
                }
            };
        }

        update(deltaTime, input) {
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;

            this.background.update();
            this.player.update(input, deltaTime);

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(e => e.update(deltaTime));
            this.particles.forEach(p => p.update(deltaTime));
            this.collisions.forEach(c => c.update(deltaTime));

            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            this.enemies = this.enemies.filter(e => !e.markedForDeletion);
            this.particles = this.particles.filter(p => !p.markedForDeletion);
            this.collisions = this.collisions.filter(c => !c.markedForDeletion);
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(e => e.draw(context));
            this.particles.forEach(p => p.draw(context));
            this.collisions.forEach(c => c.draw(context));
            this.UI.draw(context);
        }

        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    const input = new InputHandler(game);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime, input);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});