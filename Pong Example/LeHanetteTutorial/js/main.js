// define game

// MAIN MENU ===============================
var MainMenu = function(game){

};
MainMenu.prototype = {
    preload: function(){
        game.load.image('ball', 'assets/img/ball.png');
        game.load.audio('pop', 'assets/audio/pop01.mp3');
    },

    create: function(){
        game.state.start('Play');
    }
}

// PLAY ===============================
var Play = function(game){
    // create constants
    this.BALL_WIDTH = 10;
    this.BALL_VEL = 5;
    this.PADDLE_VEL = 5;
};
Play.prototype = {
    create: function(){
        // spin up physics
        game.physics.startSystem(Phaser.ARCADE);
        game.physics.arcade.gravity.y = 1000;

        //initialize our assets/sprites
        this.ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
        this.ball.anchor.set(0.5);

        this.p1 = game.add.sprite(this.BALL_WIDTH,+5, game.world.centerY, 'ball');
        this.p1.anchor.set(0.5);
        this.p1.scale.y = 10;

        this.p2 = game.add.sprite(game.width - this.BALL_WIDTH,+5, game.world.centerY, 'ball');
        this.p2.anchor.set(0.5);
        this.p2.scale.y = 10;

        game.physics.enable([this.ball, this.p1, this.p2], Phaser.Physics.ARCADE);
        this.ball.collideWorldBounds = true;
        this.p1.collideWorldBounds = true;
        this.p2.collideWorldBounds = true;
        this.p1.body.immovable = true;
        this.p2.body.immovable = true;

        // launch ball
        this.ball.body.velocity.x = this.BALL_VEL;
        // this.ball.body.velocity.y = game.rnd.integerInRange(-this.BALL_VEL, this.BALL_VEL);
        this.ball.body.bounce.setTo(1, 1);

    },

    update: function(){
        // check collision
        game.physics.arcade.collide(this.ball, this.p1);
        game.physics.arcade.collide(this.ball, this.p2);

        // check player input
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.p2.body.velocity.y = -this.PADDLE_VEL;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.p2.body.velocity.y = this.PADDLE_VEL;
        } else {
            this.p2.body.velocity.y = 0;
        }

        if(game.input.keyboard.isDown(Phaser.Keyboard.E)){
            this.p1.body.velocity.y = -this.PADDLE_VEL;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)){
            this.p1.body.velocity.y = this.PADDLE_VEL;
        } else {
            this.p1.body.velocity.y = 0;
        }

        // check bounds
        this.checkBounds();
    },
    checkBounds: 
}

// initialize game
var game = new Phaser.Game();

game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.start('MainMenu');
