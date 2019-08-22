// Hanette Le
// CMPM 120: Snowy States

// debug ENFORCEMENT
'use strict';

// define game
var message;
var style = { font: '24px Helvetica', fill: '#191414', align: "center" };

// ======= variables =======
var player;
var platforms;
var stars;
var diamond;
var bad1;
var bad2;
var scoreText;
var baddieCount = 0;
var starCount = 0;
// ========================

// MAIN MENU ===============================
var MainMenu = function(game){};
MainMenu.prototype = {
    // Load Assets
    preload: function(){
        game.load.image('sky', 'assets/img/sky.png');
        game.load.image('ground', 'assets/img/platform.png');
        game.load.image('star', 'assets/img/star.png');
        game.load.image('diamond', 'assets/img/diamond.png');
        game.load.image('snowflake', 'assets/img/snowflake.png');
        game.load.spritesheet('baddie', 'assets/img/baddie.png',32, 32);
        game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
        game.load.path = 'assets/audio/';
        game.load.audio('pop01', ['pop01.mp3']);
        console.log('MainMenu: preload');
    },

    // Make Menu
    create: function(){
        console.log('MainMenu: create');
        // Edit bg color and instruction text
        game.stage.backgroundColor = "#faceca"; // peach pink
        message = game.add.text(game.world.centerX, game.world.centerY, "Use ← → to MOVE and ↑ to JUMP. Press SPACEBAR to START", style); // instructions
        message.anchor.set(0.5);
    },

    // Check for input
    update: function() {
		// Switch to GamePlay if input is found
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('GamePlay');
		}
    }
}

// GAMEPLAY  ===============================
var GamePlay = function(game) {
    var score;
};
GamePlay.prototype = {
	preload: function() {
		console.log('GamePlay: preload');
    },

	create: function() {
        // Add Audio
        this.pop01 = game.add.audio('pop01');

        // Add background
        game.add.sprite(0, 0, 'sky');
        game.stage.backgroundColor = "#E9FFFF";
        // =================== PLATFORM GROUP =========================
        // Make a group for platforms and enable physics on it
        platforms = game.add.group();
        platforms.enableBody = true;

        // create the ground
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2); // scale to fit the width of game
        ground.body.immovable = true; // pin the ground to be solid object

        // create two ledges on the sides
        var ledge = platforms.create(-200, 250, 'ground'); // one
        ledge.body.immovable = true;

        ledge = platforms.create(500, 350, 'ground');     // two
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 450, 'ground');    // three
        ledge.body.immovable = true;

        ledge = platforms.create(450, 600, 'ground');     // four
        ledge.body.immovable = true;

        // =================== PLAYER =========================
        // Create player
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        game.physics.arcade.enable(player); // enable physics

        // Edit player's physics properties
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        // Insert walking animation
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        // =================== BADDIES =========================
        // Create two Baddies
        bad1 = game.add.sprite(525, 305, 'baddie'); // Baddie One
        game.physics.arcade.enable(bad1); // enable physics
        bad1.body.bounce.y = 0.2; // edit physics properties
        bad1.body.gravity.y = 300

        bad2 = game.add.sprite(100, 355, 'baddie'); // Baddie Two
        game.physics.arcade.enable(bad2); // enable physics
        bad2.body.bounce.y = 0.2; // edit physics properties
        bad2.body.gravity.y = 300

        // Insert animation
        bad1.animations.add('left', [0, 1], 10, true);
        bad2.animations.add('right', [2, 3], 10, true);

        // =================== STAR =========================
        // Create stars
        stars = game.add.group();
        stars.enableBody = true;

        //  Create 12 stars
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 58, 0, 'star');
            //  Let gravity do its thing
            star.body.gravity.y = 200;
            //  Gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        // =================== DIAMOND =========================
        // Create group
        diamond = game.add.group();
        diamond.enableBody = true;
        // Random placement generator
        var random = Math.floor(Math.random()*5);
        // Place diamond in game
        var dia = diamond.create(100 + random*100, random*100 + 100, 'diamond');

        // =================== TEXT =========================
        this.score = 0;
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        // =================== SNOWFLAKES PREFAB =========================
        for (var i = 0; i < 100; i++) {
            // Snowstorm(game, key, frame, scale, rotation)
            this.snowflake = new Snowstorm(game, 'snowflake', 1, Math.PI);
            game.add.existing(this.snowflake);
        }
	},
	update: function() {
		// GamePlay logic
		if(baddieCount == 2) {
            starCount = 0;
            baddieCount = 0;
			game.state.start('GameOver',true, false, this.score);
		}
        if (starCount == 12){
            baddieCount = 0;
            starCount = 0;
            game.state.start('GameOver', true, false, this.score);
        }
        // run game loop
        // Keeps player, stars, baddies, and diamond collision on with platforms
        var hit_platform = game.physics.arcade.collide(player, platforms);
        var star_platform = game.physics.arcade.collide(stars, platforms);
        var dia_platform = game.physics.arcade.collide(diamond, platforms);
        var bad1_platform = game.physics.arcade.collide(bad1, platforms);
        var bad2_platform = game.physics.arcade.collide(bad2, platforms);

        // =================== PLAYER MOVEMENTS =========================
        var cursors = game.input.keyboard.createCursorKeys();
        player.body.velocity.x = 0;

        // Move left
        if (cursors.left.isDown){
           player.body.velocity.x = -150;
           player.animations.play('left');
        }

        // Move Right
        else if (cursors.right.isDown) {
           player.body.velocity.x = 150;
           player.animations.play('right');

        // Stand Still
        } else {
           player.animations.stop();
           player.frame = 4;
        }

        //  Allows player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down && hit_platform) {
           player.body.velocity.y = -350;
        }

        // =================== BADDIE ANIMATION =======================
        bad1.animations.play('left');
        bad2.animations.play('right');

        // =================== OBJECT COLLISION =======================
        if(this.game.physics.arcade.overlap(player, stars, null, null, this)){
            // ('marker', start position, volume (0-1), loop)
            this.pop01.play('', 0, 1, false);
            this.game.physics.arcade.overlap(player, stars, collectStar, null, this);

            //  Add and update the score
            this.score += 10;
            scoreText.text = 'Score: ' + this.score;
        } // Star

        if(this.game.physics.arcade.overlap(player, diamond, null, null, this)){
            this.game.physics.arcade.overlap(player, diamond, collectDiamond, null, this);
            //  Add and update the score
            this.score += 50;
            scoreText.text = 'Score: ' + this.score;
        } // Diamond

        if(this.game.physics.arcade.overlap(player, bad1, null, null, this)){
            this.game.physics.arcade.overlap(player, bad1, byeBaddie, null, this);

            //  Add and update the score
            this.score -= 25;
            scoreText.text = 'Score: ' + this.score;
        } // Baddie 1

        if(this.game.physics.arcade.overlap(player, bad2, null, null, this)){
            this.game.physics.arcade.overlap(player, bad2, byeBaddie, null, this);

            //  Add and update the score
            this.score -= 25;
            scoreText.text = 'Score: ' + this.score;
        } // Baddie 1
    }
}

// GAME OVER state =========================
var GameOver = function(game) {
    var score;
};
GameOver.prototype = {
    init: function(score) {
         this.score = score;
    },

	preload: function() {
		console.log('GameOver: preload');
	},

    create: function() {
		console.log('GameOver: create');
		game.stage.backgroundColor = "#c8a4a1";
		message = game.add.text(game.world.centerX, game.world.centerY, "GAMEOVER. Press SPACEBAR to go to PLAY", style);
		message.anchor.set(0.5);
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        scoreText.text = 'Score: ' + this.score;
	},

    update: function() {
		// GameOver logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('GamePlay');
		}
	}
}

function collectStar (player, star) {
    // Removes the star from the screen
    console.log('Star');
    star.kill();
    starCount += 1;
}

function collectDiamond (player, diamond) {
    // Removes the diamond from the screen
    diamond.kill();
    console.log('Diamond');
}

function byeBaddie (player, bad) {
    // Removes the baddie from the screen
    bad.kill();
    console.log('Baddie');
    baddieCount += 1;
}

// command line: python -m http.server
// browser: http://localhost:8000


// initialize game
var game = new Phaser.Game(700,800,Phaser.AUTO);

// add states to StateManager and start MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
