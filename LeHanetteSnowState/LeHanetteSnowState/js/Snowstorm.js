// Hanette Le
// CMPM 120: Snowy States

function Snowstorm(game, frame, scale, rotation){
    // call to Phaser.Sprite; (game, x, y, key, frame)
    Phaser.Sprite.call(this, game, game.rnd.integerInRange(0,700), game.rnd.integerInRange(0,800), frame);
    game.world.setBounds(0, 0, 739, 839);

    // properties
    this.anchor.set(0.5);
    this.scale.x = scale;
    this.scale.y = scale;
    this.rotation = rotation;
    this.alpha = 0.75;

    // physics
    game.physics.enable(this);
    this.body.angularVelocity = game.rnd.integerInRange(0,180);
    this.body.velocity.x = game.rnd.integerInRange(0,40);
}

Snowstorm.prototype = Object.create(Phaser.Sprite.prototype);
Snowstorm.prototype.constructor = Snowstorm;

Snowstorm.prototype.update = function() {
    // wrap around GAME
    game.world.wrap(this, 0, true);
    this.body.velocity.y = 30;

    // change snowflake directions
    if(game.input.keyboard.isDown(Phaser.Keyboard.R)) {
        this.body.velocity.x *= -1;
		this.body.angularVelocity *= -1;
	}
}
