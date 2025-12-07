import { Sitting, Running, Jumping, Falling, Rolling, Diving, HIT } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = $('#player')[0];
        this.frameY = 0;
        this.frameX = 0;
        this.maxFrame = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 5;

        this.states = [
            new Sitting(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Rolling(this.game),
            new Diving(this.game),
            new HIT(this.game)
        ];
        this.currentState = this.states[0];
    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input.keys);

        this.x += this.speed;
        if (input.keys.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.keys.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        this.x = Math.max(0, Math.min(this.x, this.game.width - this.width));

        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        this.y = Math.min(this.y, this.game.height - this.height - this.game.groundMargin);

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(ctx) {
        if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
            this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround() { return this.y >= this.game.height - this.height - this.game.groundMargin; }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision() {
        $.each(this.game.enemies, (_, enemy) => {
            const hit = (enemy.x < this.x + this.width && enemy.x + enemy.width > this.x && enemy.y < this.y + this.height && enemy.y + enemy.height > this.y);
            if (hit) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                if (this.game.audio && this.game.audio.playBoom) this.game.audio.playBoom();

                if ([4,5].includes(this.currentState.stateIndex)) this.game.score++;
                else {
                    this.setState(6, 0);
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
            }
        });
    }
}
