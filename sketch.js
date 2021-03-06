/*

The Game is available at https://dabogdan.github.io/game-2/

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;
var coinPic;

var moon;

var game_score;
var flagpole;
var lives;

var platforms;

var died;

var isJumping; //added virable to make jumping smooth
var isContact; // added global variable to control elegant jumping

var platformHeight;

var maxJump; //needed to cap the jump when the character is on the platform, when (isContact == true)

//vars for mobile devices touchscreen events
var leftTouchButtonLocation;
var rightTouchButtonLocation;

//variables to check the move of the character's legs
var angle;
var angleUp;
var angleDown;

// //sounds variables
// var allSounds;
// var jumpSound;
// var coinSound;
// var dieSound;
// var gameOverSound;
// var bumpSound;
// var stageClearSound;

function preload() {
    // //sounds
    // soundFormats('mp3', 'wav');
    // allSounds = [
    //     jumpSound = loadSound('assets/sounds/jump.mp3'),
    //     coinSound = loadSound('assets/sounds/coin.mp3'),
    //     dieSound = loadSound('assets/sounds/die.wav'),
    //     gameOverSound = loadSound('assets/sounds/gameover.wav'),
    //     bumpSound = loadSound('assets/sounds/bump.wav'),
    //     stageClearSound = loadSound('assets/sounds/stage_clear.wav'),
    // ];
    // //set volume for all the sounds to 0.1
    // allSounds.forEach((e) => {
    //     e.setVolume(0.1);
    // });
    // images
    coinPic = loadImage('assets/pics/Coin.png');
}

function startGame() {

    gameChar_x = 100;
    gameChar_y = 200;

    // Variable to control the background scrolling.
    scrollPos = 0;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.

    moon = {
        x: 2750,
        y: 60,
        diameter: 80,
        brightness: 0
    };

    trees_x = [
        -300,
        130,
        300,
        570,
        1100,
        1750,
        1860,
        2400,
        2800,
        2900,
        3400
    ];

    collectables = [
        {
            x_pos: 300,
            y_pos: floorPos_y - 100,
            isFound: false
        },
        {
            x_pos: 400,
            y_pos: floorPos_y - 30,
            isFound: false
        },
        {
            x_pos: 670,
            y_pos: floorPos_y - 150,
            isFound: false
        },
        {
            x_pos: 820,
            y_pos: floorPos_y - 120,
            isFound: false
        },
        {
            x_pos: 950,
            y_pos: floorPos_y - 130,
            isFound: false
        },
        {
            x_pos: 1150,
            y_pos: floorPos_y - 30,
            isFound: false
        },
        {
            x_pos: 1500,
            y_pos: floorPos_y - 160,
            isFound: false
        },
        {
            x_pos: 1550,
            y_pos: floorPos_y - 160,
            isFound: false
        },
        {
            x_pos: 1400,
            y_pos: floorPos_y - 90,
            isFound: false
        },
        {
            x_pos: 2000,
            y_pos: floorPos_y - 150,
            isFound: false
        },
        {
            x_pos: 2170,
            y_pos: floorPos_y - 220,
            isFound: false
        },
    ];

    canyons = [
        {x_pos: 600, width: 80},
        {x_pos: 950, width: 110},
        {x_pos: 1950, width: 350},
    ];

    mountains = [
        {x_pos: 500, y_pos: floorPos_y, size: floorPos_y - 150},
        {x_pos: 550, y_pos: floorPos_y, size: floorPos_y - 250},
        {x_pos: 1200, y_pos: floorPos_y, size: floorPos_y - 250},
        {x_pos: 1250, y_pos: floorPos_y, size: floorPos_y - 350},
        {x_pos: 1800, y_pos: floorPos_y, size: floorPos_y - 250},
        {x_pos: 1850, y_pos: floorPos_y, size: floorPos_y - 350},
        {x_pos: 2300, y_pos: floorPos_y, size: floorPos_y - 300},
        {x_pos: 2350, y_pos: floorPos_y, size: floorPos_y - 200},
        {x_pos: 2750, y_pos: floorPos_y, size: floorPos_y - 200},
        {x_pos: 2900, y_pos: floorPos_y, size: floorPos_y - 300},
    ];

    clouds = [
        {x_pos: -200, y_pos: 200, size: 80},
        {x_pos: 100, y_pos: 170, size: 80},
        {x_pos: 400, y_pos: 200, size: 80},
        {x_pos: 800, y_pos: 170, size: 80},
        {x_pos: 1100, y_pos: 200, size: 80},
        {x_pos: 1400, y_pos: 200, size: 80},
        {x_pos: 1700, y_pos: 160, size: 80},
        {x_pos: 1900, y_pos: 200, size: 80},
    ];

    platforms = [];

    platformHeight = {
        high: floorPos_y - 90,
        low: floorPos_y - 50
    }

    platforms.push(createPlatforms(650, platformHeight.high, 100));
    platforms.push(createPlatforms(800, platformHeight.low, 100));
    platforms.push(createPlatforms(2000, platformHeight.low, 100));
    platforms.push(createPlatforms(2100, platformHeight.high, 100));

    game_score = 0;

    flagpole = {isReached: false, x_pos: 2500};

    died = false;

    maxJump = 0; //needed to cap the jump when the character is on the platform (isContact == true)

    leftTouchButtonLocation = 100;
    rightTouchButtonLocation = width - 100;

    angle = 1 / 10;

    angleUp = false;
    angleDown = false;
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    floorPos_y = height * 3 / 4;

    lives = 3;

    startGame();
}

function draw() {

    background(100, 155, 255); // fill the sky blue

    noStroke();
    fill(0, 155, 0);
    rect(0, floorPos_y, width, height / 4); // draw some green ground

    push();

    translate(scrollPos, 0);

    // Draw clouds.
    drawClouds();
    // Draw mountains.
    drawMountains();
    // Draw trees.
    drawTrees();

    // Draw canyons.
    for (let i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

    //draw platform
    for (let i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }

    // Draw collectable items.
    for (let i = 0; i < collectables.length; i++) {
        if (!collectables[i].isFound) {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }

    if (flagpole.isReached == false) {
        checkFlagpole();
    }

    if (!died) {
        checkPlayerDie();
    }

    //touch screen buttons

    if (window.width < 992) {
        fill(0);
        ellipse(leftTouchButtonLocation - 48, floorPos_y + 40, 45);
        ellipse(rightTouchButtonLocation + 48, floorPos_y + 40, 45);
        ellipse(rightTouchButtonLocation - 20, floorPos_y + 40, 60, 45);
        ellipse(leftTouchButtonLocation + 20, floorPos_y + 40, 60, 45);

        fill(255);
        triangle(leftTouchButtonLocation - 50, floorPos_y + 50, leftTouchButtonLocation - 60, floorPos_y + 40, leftTouchButtonLocation - 50, floorPos_y + 30); //left
        triangle(leftTouchButtonLocation - 40, floorPos_y + 50, leftTouchButtonLocation - 50, floorPos_y + 40, leftTouchButtonLocation - 40, floorPos_y + 30);
        triangle(rightTouchButtonLocation + 50, floorPos_y + 50, rightTouchButtonLocation + 60, floorPos_y + 40, rightTouchButtonLocation + 50, floorPos_y + 30); //right
        triangle(rightTouchButtonLocation + 40, floorPos_y + 50, rightTouchButtonLocation + 50, floorPos_y + 40, rightTouchButtonLocation + 40, floorPos_y + 30);

        textSize(16);
        text('JUMP', rightTouchButtonLocation - 41, floorPos_y + 45);
        text('JUMP', leftTouchButtonLocation - 1, floorPos_y + 45);
    }
    renderFlagpole();

    //night
    fill(0, 0, 0, map(gameChar_world_x, 1200, 2100, 0, 110));
    rect(0, 0, 3500, height);

    //moon

    fill(map(gameChar_world_x, 1200, 2100, 150, 255));
    ellipse(moon.x, moon.y, moon.diameter);

    //stars
    //    TASK: draw the stars for the nighttime
    ellipse(1700, 50, 5);
    ellipse(1900, 35, 5);
    ellipse(1950, 45, 5);
    ellipse(2050, 130, 5);
    ellipse(2000, 40, 5);
    ellipse(2100, 60, 5);
    ellipse(2150, 85, 5);
    ellipse(2200, 135, 5);
    ellipse(2400, 155, 5);
    ellipse(2450, 160, 5);
    ellipse(2530, 75, 5);
    ellipse(2600, 130, 5);
    ellipse(3100, 130, 5);

    pop();

    //return if flagpole.isReached and give a message
    if (flagpole.isReached) {
        drawGameChar();
        return levelComplete();
    }


    //return if game is over and give a message
    if (lives < 1) {
        fill('rgba(0, 0, 0, 0.5)');
        rect(0, 0, width, height);

        fill(255);
        textSize(50);
        text('GAME OVER', width / 2 - 170, height / 2);
        textSize(20);
        text('Press space to continue', width / 2 - 120, height / 2 + 50);

        noLoop();
        // setTimeout(() => {
        //     allSounds[3].play();
        // }, 2600);
        return;
    }


    // Draw game character.

    drawGameChar();

    //Draw the scores and lives
    fill(255);
    noStroke();
    textSize(15);
    text("SCORE: " + game_score, 30, 30);
    //draw the lives
    text("LIVES: " + lives, 30, 50);

    // Logic to make the game character move or the background scroll.
    if (isLeft) {
        if (gameChar_x > scrollPos - 100) {
            if (gameChar_x > width / 2 && isPlummeting === false) {
                gameChar_x -= 3;
            } else {
                scrollPos += 3;
                leftTouchButtonLocation -= 3;
                rightTouchButtonLocation -= 3;
            }
        }
        if (gameChar_x < scrollPos - 98) {
            // allSounds[4].play();
            gameChar_x += 40;
            isLeft = false;
        }
    }

    if (isRight) {
        if (gameChar_x < width / 2 && isPlummeting === false) {
            gameChar_x += 3;
        } else {
            scrollPos -= 3; // negative for moving against the background
            leftTouchButtonLocation += 3;
            rightTouchButtonLocation += 3;
        }
    }

    //elegant way of jumping (need new variable isJumping)
    if (isJumping) {
        if (!isContact) {
            gameChar_y -= 12;
            if (gameChar_y <= floorPos_y - 100) {
                isJumping = false;
            }
        }
        if (isContact) {
            gameChar_y -= 12;
            if (gameChar_y <= maxJump) {
                isJumping = false;
                isFalling = true;
            }
        }
    }

    // Logic to make the game character rise and fall.
    //gravity
    if (gameChar_y < floorPos_y) {
        isContact = false;
        for (var i = 0; i < platforms.length; i++) {
            if (platforms[i].checkContact(gameChar_world_x, gameChar_y) == true) {
                maxJump = platforms[i].y - 100;
                isContact = true;
                isFalling = false;
                break;
            }
        }
        if (isContact == false) {
            gameChar_y += 3;
            isFalling = true;
        }
//for smooth jumping
//        check if reached floorPos_y in order to ground
        if (gameChar_y >= floorPos_y) {
            gameChar_y = floorPos_y;
            isFalling = false;
        }
    } else {
        isFalling = false;
    }

    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed() {

    // if statements to control the animation of the character when
    // keys are pressed.
    if (keyCode == 37) {
        isLeft = true;
        angleUp = true;
    }
    if (keyCode == 39) {
        isRight = true;
        angleUp = true;
    }

    if (keyCode == 32 && (gameChar_y == floorPos_y || isContact)) {
        isJumping = true;
        // allSounds[0].play();
    }


}

function keyReleased() {
    // if statements to control the animation of the character when
    // keys are released.
    if (keyCode == 37) {
        isLeft = false;
        angleUp = false;
        angleDown = false;
    }
    if (keyCode == 39) {
        isRight = false;
        angleUp = false;
        angleDown = false;
    }
//elegant jumping
    if (keyCode == 32) {
        isJumping = false;
    }

}

//touch for mobile devices

function touchStarted(event) {
    if (
        (event.type == "mousedown" &&
            dist(event.clientX, event.clientY, 100 - 48, floorPos_y + 40) < 25) ||
        (event.type == "touchstart" &&
            dist(event.changedTouches[0].clientX, event.changedTouches[0].clientY, 100 - 48, floorPos_y + 40) < 25)
    ) {
        isLeft = true;
        angleUp = true;

    }
    if (
        (event.type == "mousedown" &&
            dist(event.clientX, event.clientY, width - 100 + 48, floorPos_y + 40) < 25) ||
        (event.type == "touchstart" &&
            dist(event.changedTouches[0].clientX, event.changedTouches[0].clientY, width - 100 + 48, floorPos_y + 40) < 25)
    ) {
        isRight = true;
        angleUp = true;

    }
    if (
        (event.type == "mousedown" &&
            dist(event.clientX, event.clientY, width - 120, floorPos_y + 40) < 35) ||
        (event.type == "touchstart" &&
            dist(event.changedTouches[0].clientX, event.changedTouches[0].clientY, width - 120, floorPos_y + 40) < 35)
    ) {
        if (gameChar_y === floorPos_y ||
            gameChar_y === platformHeight.low - 1 ||
            gameChar_y === platformHeight.high) {
            isRight = true;
            isJumping = true;
            angleUp = true;
            // allSounds[0].play();
        }
    }
    if (
        (event.type == "mousedown" &&
            dist(event.clientX, event.clientY, 120, floorPos_y + 40) < 35) ||
        (event.type == "touchstart" &&
            dist(event.changedTouches[0].clientX, event.changedTouches[0].clientY, 120, floorPos_y + 40) < 35)
    ) {
        if (
            gameChar_y === floorPos_y ||
            gameChar_y === platformHeight.low - 1 ||
            gameChar_y === platformHeight.high) {
            isLeft = true;
            isJumping = true;
            angleUp = true;
            // allSounds[0].play();
        }
    }
    return false;
}

function touchEnded() {
    isLeft = false;
    isRight = false;
    isJumping = false;
    angleDown = false;
    angleDown = false;
}
// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
    //the game character
    if (isLeft && isFalling) {
        // add your jumping-left code
        fill(235, 240, 165);
        ellipse(gameChar_x, gameChar_y - 50, 17); //head

        //glasses
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x - 7, gameChar_y - 52, 5, 6, 0, PI); // glass
        fill(255);
        line(gameChar_x - 5, gameChar_y - 51, gameChar_x + 4, gameChar_y - 53); // frame

//        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x - 7, gameChar_y - 43, 7, 6, PI + HALF_PI, 0); //mustage
        strokeWeight(3);
        arc(gameChar_x - 2, gameChar_y - 47, 12, 8, 0, HALF_PI); //beard

        noStroke();
        fill(30);
        rect(gameChar_x - 5, gameChar_y - 72, 10, 17); //hat
        rect(gameChar_x - 10, gameChar_y - 57, 20, 2); //hat
        rect(gameChar_x - 10, gameChar_y - 40, 20, 25); //body

        fill(255);
        rect(gameChar_x - 4, gameChar_y - 40, 5, 20); //short

//        tie
        fill(0);
        triangle(gameChar_x - 2, gameChar_y - 40, gameChar_x - 4, gameChar_y - 25, gameChar_x + 1, gameChar_y - 25);
        triangle(gameChar_x - 2, gameChar_y - 20, gameChar_x - 4, gameChar_y - 25, gameChar_x + 3, gameChar_y - 25);

        noFill();
        stroke(30);
        strokeWeight(5);
        arc(gameChar_x - 18, gameChar_y - 38, 20, 20, 0, HALF_PI); //left arm
        arc(gameChar_x + 4, gameChar_y - 28, 30, 20, PI + HALF_PI, 0); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x - 18, gameChar_y - 27, 5); //left hand
        ellipse(gameChar_x + 20, gameChar_y - 27, 5); //right hand

        fill(0);
        rect(gameChar_x + 3, gameChar_y - 15, 5, 15); //left leg
        rect(gameChar_x - 1, gameChar_y, 9, 3); //left foot
        rect(gameChar_x - 7, gameChar_y - 22, -5, 10); //right leg
        rect(gameChar_x - 7, gameChar_y - 13, -9, 3); //right foot

    } else if (isRight && isFalling) {
        // add your jumping-right code
        fill(235, 240, 165);
        ellipse(gameChar_x, gameChar_y - 50, 17); //head

        //glasses
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x + 7, gameChar_y - 52, 5, 6, 0, PI); // glass
        fill(255);
        line(gameChar_x + 5, gameChar_y - 51, gameChar_x - 4, gameChar_y - 53); // frame

        //        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x + 7, gameChar_y - 43, 7, 6, PI, PI + HALF_PI); //mustage
        strokeWeight(3);
        arc(gameChar_x + 2, gameChar_y - 47, 12, 8, HALF_PI, PI); //beard

        noStroke();
        fill(30);
        rect(gameChar_x - 5, gameChar_y - 72, 10, 17); //hat
        rect(gameChar_x - 10, gameChar_y - 57, 20, 2); //hat
        rect(gameChar_x - 10, gameChar_y - 40, 20, 25); //body

        fill(255);
        rect(gameChar_x, gameChar_y - 40, 5, 20); //short

//        tie
        fill(0);
        triangle(gameChar_x + 3, gameChar_y - 40, gameChar_x, gameChar_y - 25, gameChar_x + 5, gameChar_y - 25);
        triangle(gameChar_x + 3, gameChar_y - 20, gameChar_x, gameChar_y - 25, gameChar_x + 5, gameChar_y - 25);

        noFill();
        stroke(30);
        strokeWeight(5);
        arc(gameChar_x + 18, gameChar_y - 38, 20, 20, HALF_PI, PI); //left arm
        arc(gameChar_x - 5, gameChar_y - 28, 30, 20, PI, PI + HALF_PI); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x - 20, gameChar_y - 28, 5); //right hand
        ellipse(gameChar_x + 18, gameChar_y - 28, 5); //left hand

        fill(0);
        rect(gameChar_x - 7, gameChar_y - 15, 5, 15); //left leg
        rect(gameChar_x - 7, gameChar_y, 9, 3); //left foot
        rect(gameChar_x + 8, gameChar_y - 22, 5, 10); //right leg
        rect(gameChar_x + 8, gameChar_y - 13, 9, 3); //right foot

    } else if (isLeft) {
        // add your walking left code
        fill(235, 240, 165);
        ellipse(gameChar_x, gameChar_y - 50, 17); //head

        //glasses
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x - 7, gameChar_y - 52, 5, 6, 0, PI); // glass
        fill(255);
        line(gameChar_x - 5, gameChar_y - 51, gameChar_x + 4, gameChar_y - 53); // frame

        //        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x - 7, gameChar_y - 43, 7, 6, PI + HALF_PI, 0); //mustage
        strokeWeight(3);
        arc(gameChar_x - 2, gameChar_y - 47, 12, 8, 0, HALF_PI); //beard

        noStroke();
        fill(30);
        rect(gameChar_x - 5, gameChar_y - 72, 10, 17); //hat
        rect(gameChar_x - 10, gameChar_y - 57, 20, 2); //hat
        rect(gameChar_x - 7, gameChar_y - 40, 16, 25); //body

        fill(255);
        rect(gameChar_x - 4, gameChar_y - 40, 5, 20); //short

//        tie
        fill(0);
        triangle(gameChar_x - 2, gameChar_y - 40, gameChar_x - 4, gameChar_y - 25, gameChar_x + 1, gameChar_y - 25);
        triangle(gameChar_x - 2, gameChar_y - 20, gameChar_x - 4, gameChar_y - 25, gameChar_x + 3, gameChar_y - 25);

        noFill();
        stroke(30);
        strokeWeight(5);
        arc(gameChar_x - 18, gameChar_y - 38, 20, 30, 0, HALF_PI); //left arm
        arc(gameChar_x + 4, gameChar_y - 23, 20, 30, PI + HALF_PI, 0); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x - 18, gameChar_y - 23, 5); //left hand
        ellipse(gameChar_x + 14, gameChar_y - 23, 5); //right hand

        fill(0);
        noStroke();
        checkAngle();
        moveLeft();

    } else if (isRight) {
        // add your walking right code
        fill(235, 240, 165);
        ellipse(gameChar_x, gameChar_y - 50, 17); //head

        //glasses
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x + 7, gameChar_y - 52, 5, 6, 0, PI); // glass
        fill(255);
        line(gameChar_x + 5, gameChar_y - 51, gameChar_x - 4, gameChar_y - 53); // frame

        //        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x + 7, gameChar_y - 43, 7, 6, PI, PI + HALF_PI); //mustage
        strokeWeight(3);
        arc(gameChar_x + 2, gameChar_y - 47, 12, 8, HALF_PI, PI); //beard

        noStroke();
        fill(30);
        rect(gameChar_x - 5, gameChar_y - 72, 10, 17); //hat
        rect(gameChar_x - 10, gameChar_y - 57, 20, 2); //hat
        rect(gameChar_x - 8, gameChar_y - 40, 16, 25); //body

        fill(255);
        rect(gameChar_x, gameChar_y - 40, 5, 20); //short

//        tie
        fill(0);
        triangle(gameChar_x + 3, gameChar_y - 40, gameChar_x, gameChar_y - 25, gameChar_x + 5, gameChar_y - 25);
        triangle(gameChar_x + 3, gameChar_y - 20, gameChar_x, gameChar_y - 25, gameChar_x + 5, gameChar_y - 25);


//        arms & hands
        noFill();
        stroke(30)
        strokeWeight(5);
        arc(gameChar_x - 8, gameChar_y - 23, 10, 30, PI, PI + HALF_PI); //left arm
        arc(gameChar_x + 18, gameChar_y - 38, 20, 30, HALF_PI, PI); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x - 13, gameChar_y - 23, 5); //left hand
        ellipse(gameChar_x + 18, gameChar_y - 23, 5); //right hand

        fill(0);
        noStroke();

        checkAngle();
        moveRight();
    } else if (isFalling || isPlummeting || isJumping) {
        // add your jumping facing forwards code
        fill(235, 240, 165);
        ellipse(gameChar_x, gameChar_y - 50, 17); //head

//        eyes
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x - 4, gameChar_y - 52, 5, 6, 0, PI); //left glass
        arc(gameChar_x + 2, gameChar_y - 52, 5, 6, 0, PI); //right glass
        fill(255);
        line(gameChar_x + 2, gameChar_y - 51, gameChar_x + 8, gameChar_y - 53); //right frame
        line(gameChar_x - 7, gameChar_y - 51, gameChar_x - 8, gameChar_y - 53); //left frame

//        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x, gameChar_y - 43, 7, 6, PI + .6, HALF_PI - 2.3); //mustage
        strokeWeight(3);
        arc(gameChar_x, gameChar_y - 43, 10, 4, 0, PI); //beard
        strokeWeight(1);
        stroke(255, 0, 0)

        strokeWeight(0);
//        hands        
        fill(30);
        noStroke();
        rect(gameChar_x - 10, gameChar_y - 40, 20, 25); //body
        fill(255);
        rect(gameChar_x - 5, gameChar_y - 40, 10, 20); //short

//        tie
        fill(0);
        triangle(gameChar_x, gameChar_y - 40, gameChar_x - 2, gameChar_y - 25, gameChar_x + 2, gameChar_y - 25);
        triangle(gameChar_x, gameChar_y - 20, gameChar_x - 2, gameChar_y - 25, gameChar_x + 2, gameChar_y - 25);

//        arms & hands
        noFill();
        stroke(30)
        strokeWeight(5);
        arc(gameChar_x - 8, gameChar_y - 53, 18, 30, HALF_PI, PI); //left arm
        arc(gameChar_x + 8, gameChar_y - 53, 18, 30, 0, PI - HALF_PI); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x - 17, gameChar_y - 53, 5); //left hand
        ellipse(gameChar_x + 17, gameChar_y - 53, 5); //right hand

        fill(30);
        rect(gameChar_x - 5, gameChar_y - 72, 10, 17); //hat
        rect(gameChar_x - 10, gameChar_y - 57, 20, 2); //hat


        fill(0);
        rect(gameChar_x - 20, gameChar_y - 20, 15, 5); //left leg
        rect(gameChar_x - 22, gameChar_y - 24, 3, 9); //left foot
        rect(gameChar_x + 6, gameChar_y - 20, 15, 5); //right leg
        rect(gameChar_x + 19, gameChar_y - 24, 3, 9); //right foot
    } else {
        // add your standing front facing code
//        head
        fill(235, 240, 165);
        ellipse(gameChar_x, gameChar_y - 50, 17); //head
//        eyes
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x - 4, gameChar_y - 52, 5, 6, 0, PI); //left glass
        arc(gameChar_x + 2, gameChar_y - 52, 5, 6, 0, PI); //right glass
        fill(255);
        line(gameChar_x + 2, gameChar_y - 51, gameChar_x + 8, gameChar_y - 53); //right frame
        line(gameChar_x - 7, gameChar_y - 51, gameChar_x - 8, gameChar_y - 53); //left frame

//        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x, gameChar_y - 43, 7, 6, PI + .6, HALF_PI - 2.3); //mustage
        strokeWeight(3);
        arc(gameChar_x, gameChar_y - 43, 10, 4, 0, PI); //beard
        strokeWeight(1);

        fill(30);
        noStroke();
        rect(gameChar_x - 10, gameChar_y - 40, 20, 25); //body
//        arms & hands
        noFill();
        stroke(30)
        strokeWeight(5);
        arc(gameChar_x - 8, gameChar_y - 23, 18, 30, PI, PI + HALF_PI); //left arm
        arc(gameChar_x + 8, gameChar_y - 23, 18, 30, PI + HALF_PI, 0); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x - 17, gameChar_y - 23, 5); //left hand
        ellipse(gameChar_x + 17, gameChar_y - 23, 5); //right hand

        fill(30);
        rect(gameChar_x - 5, gameChar_y - 72, 10, 17); //hat
        rect(gameChar_x - 10, gameChar_y - 57, 20, 2); //hat

        fill(255);
        rect(gameChar_x - 5, gameChar_y - 40, 10, 20); //short

//        tie
        fill(0);
        triangle(gameChar_x, gameChar_y - 40, gameChar_x - 2, gameChar_y - 25, gameChar_x + 2, gameChar_y - 25);
        triangle(gameChar_x, gameChar_y - 20, gameChar_x - 2, gameChar_y - 25, gameChar_x + 2, gameChar_y - 25)


        fill(0);
        rect(gameChar_x - 10, gameChar_y - 15, 5, 15); //left leg
        rect(gameChar_x - 14, gameChar_y, 9, 3); //left foot
        rect(gameChar_x + 5, gameChar_y - 15, 5, 15); //right leg
        rect(gameChar_x + 5, gameChar_y, 9, 3); //right foot

    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {
        //    	draw the cloud
        fill(255);
        ellipse(clouds[i].x_pos - 40, clouds[i].y_pos, clouds[i].size + 80, clouds[i].size - 30);//lond ellipse below
        ellipse(clouds[i].x_pos - 20, clouds[i].y_pos - 40, clouds[i].size - 20);//mid ellipse right
        ellipse(clouds[i].x_pos - 72, clouds[i].y_pos - 50, clouds[i].size + 10);//big ellipse
        ellipse(clouds[i].x_pos + 20, clouds[i].y_pos - 15, clouds[i].size - 25);//small elipse right
        ellipse(clouds[i].x_pos - 94, clouds[i].y_pos - 18, clouds[i].size - 10);//small elipse left
    }
}

// Function to draw mountains objects.
function drawMountains() {
    for (var i = 0; i < mountains.length; i++) {
        //  draw the mountain
        fill(190, 190, 190);//light grey
        triangle(mountains[i].x_pos,
            mountains[i].size,
            mountains[i].x_pos + 146,
            mountains[i].y_pos,
            mountains[i].x_pos,
            mountains[i].y_pos);
        fill(100, 100, 100);//grey
        triangle(mountains[i].x_pos,
            mountains[i].size,
            mountains[i].x_pos - 50,
            mountains[i].y_pos,
            mountains[i].x_pos,
            mountains[i].y_pos)
    }
}

// Function to draw trees objects.
function drawTrees() {
    for (var i = 0; i < trees_x.length; i++) {
        //  draw the tree
        noStroke();
        fill(74, 43, 18); //brown
        rect(trees_x[i], floorPos_y - 45, 10, 45); // tree trunk

        fill(21, 87, 47); //green
        triangle(trees_x[i] - 25, floorPos_y - 45, trees_x[i] + 5, floorPos_y - 97, trees_x[i] - 35 + 70, floorPos_y - 45); //lower branch
        triangle(trees_x[i] - 25, floorPos_y - 75, trees_x[i] + 5, floorPos_y - 127, trees_x[i] - 35 + 70, floorPos_y - 75); //middle branch
        triangle(trees_x[i] - 25, floorPos_y - 105, trees_x[i] + 5, floorPos_y - 157, trees_x[i] - 35 + 70, floorPos_y - 105);//higher branch

        fill('rgba(50,50,50,.5)');//shadow
        push()
        translate(trees_x[i] - 13, floorPos_y + 13);
        rotate(1);
        ellipse(0, 0, 15, 50);//shadow
        pop();
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {
    //draw the canyon
    fill(80, 80, 0);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height);//borders of the canyon
    fill('rgba(0,0,0, .2)');
    triangle(t_canyon.x_pos + t_canyon.width, floorPos_y,
        t_canyon.x_pos + t_canyon.width, height,
        t_canyon.x_pos + t_canyon.width * 3 / 4, height
    );
    triangle(t_canyon.x_pos + t_canyon.width, floorPos_y,
        t_canyon.x_pos + t_canyon.width, height,
        t_canyon.x_pos + t_canyon.width * 1 / 3, height
    );
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon) {
    if (
        (gameChar_world_x > t_canyon.x_pos + 10 && gameChar_y >= floorPos_y) &&
        (gameChar_world_x < t_canyon.x_pos + t_canyon.width - 10 && gameChar_y >= floorPos_y)
    ) {
        isPlummeting = true;
    }
    if (isPlummeting) {
        if (gameChar_y > -30) {

        }
        gameChar_y += 1;
        isLeft = false;
        isRight = false;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
    image(coinPic, t_collectable.x_pos, t_collectable.y_pos);
    // fill(242, 242, 48);
    // ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size);
    // fill(204, 219, 222)
    // ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size-20)
    //
    // fill(0);
    // textSize(12);
    // text("$",t_collectable.x_pos-3,t_collectable.y_pos+4.5);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
    if (
        (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 35) ||
        (dist(gameChar_world_x - 20, gameChar_y - 50, t_collectable.x_pos, t_collectable.y_pos) < 35)
    ) {
        t_collectable.isFound = true;
        game_score += 1;
        // allSounds[1].play();
    }
}

function renderFlagpole() {
    push();

    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250)

    if (!flagpole.isReached) {
        fill(255, 0, 255);
        noStroke();
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }

    if (flagpole.isReached) {
        fill(255, 0, 255);
        noStroke();
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
    }
    pop();
}

function checkFlagpole() {
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if (d < 15) {
        flagpole.isReached = true;
    }
}

function checkPlayerDie() {
    if (gameChar_y >= floorPos_y + 140 && lives > 0) {
        // allSounds[2].play();
        lives -= 1;
        died = true;
        setTimeout(startGame, 2500);
    }
}

function createPlatforms(x, y, length,) {
    let p = {
        x: x,
        y: y,
        length: length,
        draw: function () {
            fill(100);
            rect(this.x, this.y, this.length, 20)
        },
        checkContact: function (gc_x, gc_y) {
            if (gc_x > this.x && gc_x < this.x + this.length) {
                var d = this.y - gc_y;
                if ((d >= 0 && d < 3) || (isJumping && d > 10 && d <= 100)) {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

function checkAngle() {
    if (angleUp && angle < .3) {
        angle += .02;
        if (angle > .2) {
            angleUp = false;
            angleDown = true;
        }
    }
    if (angleDown) {
        angle -= .02;
        if (angle < 0) {
            angleUp = true;
            angleDown = false;
        }
    }
}

function moveRight() {
    push()
    translate(gameChar_x - 7, gameChar_y - 16);
    rotate(angle);
    rect(0, 0, 5, 15); //left leg
    pop();
    push();
    translate(gameChar_x - 8, gameChar_y - 3);
    rotate(angle);
    rect(0, 0, 8, 3); //left foot
    pop();

    push();
    translate(gameChar_x + 3, gameChar_y - 15);
    rotate(-angle);
    rect(0, 0, 5, 15); //right leg
    pop();
    push();
    translate(gameChar_x + 7, gameChar_y - 3)
    rotate(-angle);
    rect(0, 0, 8, 3); //right foot
    pop();
}

function moveLeft() {
    push()
    translate(gameChar_x - 7, gameChar_y - 16);
    rotate(angle);
    rect(0, 0, 5, 15); //left leg
    pop();
    push();
    translate(gameChar_x - 4, gameChar_y - 3);
    rotate(angle);
    rect(0, 0, -9, 3); //left foot
    pop();

    push();
    translate(gameChar_x + 3, gameChar_y - 15);
    rotate(-angle);
    rect(0, 0, 5, 15); //right leg
    pop();
    push();
    translate(gameChar_x + 9, gameChar_y - 3)
    rotate(-angle);
    rect(0, 0, -9, 3); //right foot
    pop();
}

function levelComplete() {

    fill('rgba(0, 0, 0, 0.2)');
    rect(0, 0, width, height);

    fill(255);
    textSize(50);
    text('LEVEL COMPLETE', width / 2 - 180, height / 2);
    textSize(20);
    text('Refresh the page to start afresh', width / 2 - 100, height / 2 + 50);

    // allSounds[5].play();
    noLoop();
}
