/*

The Game Project 5 - Bring it all together

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

var game_score;
var flagpole;
var lives;

var platforms;

var died;

var isJumping; //added virable to make jumping smooth
var isContact; // added global variable to control elegant jumping

var platformHeight;

var maxJump; //needed to cap the jump when the character is on the platform (isContact == true)

var leftTouchButtonLocation;
var rightTouchButtonLocation;

function startGame(){

    gameChar_x = 100;
    gameChar_y = floorPos_y;

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

    trees_x = [
        130, 
        300, 
        600, 
        900
    ];

    collectables = [
        {
            x_pos: 400, 
            y_pos: floorPos_y-10, 
            size: 30,
            isFound: false
        },
        {
            x_pos: 900, 
            y_pos: floorPos_y-10, 
            size: 30,
            isFound: false
        },
        {
            x_pos: 120, 
            y_pos: floorPos_y-10, 
            size: 30,
            isFound: false
        }
    ];

    canyons = [
        {x_pos: 500, width: 100},
        {x_pos: 800, width: 80},
        {x_pos: 950, width: 80},
        {x_pos: 150, width: 100}
    ];

    mountains = [
        {x_pos: -100, y_pos: floorPos_y, size: floorPos_y -300},
        {x_pos: -50, y_pos: floorPos_y, size: floorPos_y-200},
        {x_pos: 500, y_pos: floorPos_y, size: floorPos_y-150},
        {x_pos: 550, y_pos: floorPos_y, size: floorPos_y-250},
        {x_pos: 1200, y_pos: floorPos_y, size: floorPos_y-250},
        {x_pos: 1250, y_pos: floorPos_y, size: floorPos_y-350}
    ];

    clouds = [
        {x_pos: -200, y_pos: 200, size: 80},
        {x_pos: 100, y_pos: 170, size: 80},
        {x_pos: 400, y_pos: 200, size: 80},
        {x_pos: 800, y_pos: 170, size: 80},
        {x_pos: 1100, y_pos: 200, size: 80}
    ];
    
    platforms = [];
    
    platformHeight = {
        high: floorPos_y - 90,
        low: floorPos_y - 50
    }
    
    platforms.push(createPlatforms(650, platformHeight.high, 100));
    platforms.push(createPlatforms(800, platformHeight.low, 100));

    game_score = 0;

    flagpole = {isReached: false, x_pos: 1500};
    
    died = false;

    maxJump = 0; //needed to cap the jump when the character is on the platform (isContact == true)

    leftTouchButtonLocation = 100;
    rightTouchButtonLocation = width-100;
}

function setup()
{
	createCanvas(windowWidth, windowHeight);
	floorPos_y = height * 3/4;
   
    lives = 3;
        
    startGame();

}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos, 0);
    
	// Draw clouds.
    drawClouds();
	// Draw mountains.
    drawMountains();
	// Draw trees.
    drawTrees();

	// Draw canyons.
    for (var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
    //draw platform
    for (var i = 0; i < platforms.length; i++){
        platforms[i].draw();
    }

	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {
        if (!collectables[i].isFound){
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        } 
    } 
    
    renderFlagpole();
    
    if(flagpole.isReached == false){
        checkFlagpole();
    }
    
    if(!died){
        checkPlayerDie();
    }

    //touch screen buttons
    fill(0);
    ellipse(leftTouchButtonLocation-48, floorPos_y + 40, 45);
    ellipse(rightTouchButtonLocation+48, floorPos_y + 40, 45);

    fill(255);
    triangle (leftTouchButtonLocation-50, floorPos_y + 50, leftTouchButtonLocation-60, floorPos_y + 40, leftTouchButtonLocation-50, floorPos_y + 30); //left
    triangle (leftTouchButtonLocation-40, floorPos_y + 50, leftTouchButtonLocation-50, floorPos_y + 40, leftTouchButtonLocation-40, floorPos_y + 30);
    triangle (rightTouchButtonLocation+50, floorPos_y + 50, rightTouchButtonLocation+60, floorPos_y + 40, rightTouchButtonLocation+50, floorPos_y + 30); //right
    triangle (rightTouchButtonLocation+40, floorPos_y + 50, rightTouchButtonLocation+50, floorPos_y + 40, rightTouchButtonLocation+40, floorPos_y + 30);


    pop();

    
        //return if flagpole.isReached and give a message
    if (flagpole.isReached){
        fill('rgba(0, 0, 0, 0.5)');
        rect(0,0,width,height);
        
        fill(255);
        textSize(50);
        text('LEVEL COMPLETE', width/2-220, height/2);
        textSize(20);
        text('Press space to continue', width/2-100, height/2+50);        
        return;        
    }
    
        //return if game is over and give a message
    if (lives < 1){
        fill('rgba(0, 0, 0, 0.5)');
        rect(0,0,width,height);
        
        fill(255);
        textSize(50);
        text('GAME OVER', width/2-170, height/2);
        textSize(20);
        text('Press space to continue', width/2-120, height/2+50);
        
        return;
    }


	// Draw game character.
	
	drawGameChar();
    
    //Draw the scores and lives
    fill(255);
    noStroke();
    textSize(15);
    text("SCORE: " + game_score, 30,30);
    //draw the lives
    text("LIVES: " + lives, 30,50);

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if (gameChar_x > scrollPos - 100) {
            if (gameChar_x > width / 2 && isPlummeting == false) {
                gameChar_x -= 3;
            } else {
                scrollPos += 3;
                leftTouchButtonLocation -= 3;
                rightTouchButtonLocation -= 3;
            }
        }
	}

	if(isRight)
	{
		if(gameChar_x < width/2 && isPlummeting == false)
		{
			gameChar_x += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
            leftTouchButtonLocation += 3;
            rightTouchButtonLocation += 3;		}
	}
    
    //elegant way of jumping (need new variable isJumping)
    if (isJumping) {
        console.log(isContact);
        if(!isContact){
            gameChar_y -= 12;
            if (gameChar_y <= floorPos_y - 100) {
                isJumping = false;
            }
        }
        if(isContact){
            gameChar_y -= 12;
            console.log(maxJump, gameChar_y);
            if (gameChar_y <= maxJump) {
                isJumping = false;
                isFalling = true;
            }
        }
    }

	// Logic to make the game character rise and fall.
    //gravity
    if (gameChar_y < floorPos_y){
        isContact = false;
        for (var i = 0; i < platforms.length; i++){
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true){
                maxJump = platforms[i].y-100;
                isContact = true;
                isFalling = false;
                break;
            }                
        }
        if(isContact == false){
            gameChar_y +=3;
            isFalling = true;
        }
//for smooth jumping
//        check if reached floorPos_y in order to ground
        if (gameChar_y >= floorPos_y){
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

function keyPressed(){
    
    // if statements to control the animation of the character when
	// keys are pressed.
    if (keyCode == 37) {
        isLeft = true;
    }
    if (keyCode == 39) {
        isRight = true;
    }
//    if(keyCode == 32 && gameChar_y == floorPos_y) {
//        isJumping = true;
//    }
    if(keyCode == 32 && (gameChar_y == floorPos_y || isContact)) {
        isJumping = true;
    }
    

}

function keyReleased()
{
    	// if statements to control the animation of the character when
	// keys are released.
    if (keyCode == 37) {
        isLeft = false;
    }
    if (keyCode == 39) {
        isRight = false;
    }
//elegant jumping
    if(keyCode == 32) {
        isJumping = false;
    }
    
}

function touchStarted(event) {

    if (
        (event.type == "mousedown" &&
            dist(event.clientX, event.clientY, 100-48, floorPos_y + 40) < 25) ||
        (event.type == "touchstart" &&
            dist(event.changedTouches[0].clientX, event.changedTouches[0].clientY, 100-48, floorPos_y + 40) < 25)
    )
    {
        isLeft = true;
    }
    if (
        (event.type == "mousedown" &&
            dist(event.clientX, event.clientY, width-100+48, floorPos_y + 40) < 25) ||
        (event.type == "touchstart" &&
            dist(event.changedTouches[0].clientX, event.changedTouches[0].clientY, width-100+48, floorPos_y + 40) < 25)
    )
    {
        isRight = true;
    }
    return false;
}

function touchEnded(event){
    isLeft = false;
    isRight = false;
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
		//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,17); //head
        
        //glasses
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x-7, gameChar_y-52, 5, 6, 0, PI); // glass
        fill(255);
        line(gameChar_x-5, gameChar_y-51, gameChar_x+4, gameChar_y-53); // frame
        
//        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x-7,gameChar_y-43,7, 6, PI+HALF_PI, 0); //mustage
        strokeWeight(3);
        arc(gameChar_x-2,gameChar_y-47,12, 8, 0, HALF_PI); //beard
        
        noStroke();
        fill(30);
        rect(gameChar_x-5,gameChar_y-72,10,17); //hat
        rect(gameChar_x-10,gameChar_y-57,20,2); //hat
        rect(gameChar_x-10,gameChar_y-40,20,25); //body
                
        fill(255);
        rect(gameChar_x-4,gameChar_y-40,5,20); //short
                
//        tie
        fill(0);
        triangle(gameChar_x-2, gameChar_y-40, gameChar_x-4, gameChar_y-25,gameChar_x+1, gameChar_y-25);
        triangle(gameChar_x-2, gameChar_y-20, gameChar_x-4, gameChar_y-25,gameChar_x+3, gameChar_y-25);

        noFill();
        stroke(30);
        strokeWeight(5);
        arc(gameChar_x-18,gameChar_y-38,20,20, 0, HALF_PI); //left arm
        arc(gameChar_x+4,gameChar_y-28,30,20, PI + HALF_PI, 0); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x-18,gameChar_y-27,5); //left hand
        ellipse(gameChar_x+20,gameChar_y-27,5); //right hand

        fill(0);
        rect(gameChar_x+3,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-1,gameChar_y,9,3); //left foot
        rect(gameChar_x-7,gameChar_y-22,-5,10); //right leg
        rect(gameChar_x-7,gameChar_y-13,-9,3); //right foot

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,17); //head
        
        //glasses
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x+7, gameChar_y-52, 5, 6, 0, PI); // glass
        fill(255);
        line(gameChar_x+5, gameChar_y-51, gameChar_x-4, gameChar_y-53); // frame
        
        //        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x+7,gameChar_y-43,7, 6, PI, PI+HALF_PI); //mustage
        strokeWeight(3);
        arc(gameChar_x+2,gameChar_y-47,12, 8, HALF_PI, PI); //beard
        
        noStroke();
        fill(30);
        rect(gameChar_x-5,gameChar_y-72,10,17); //hat
        rect(gameChar_x-10,gameChar_y-57,20,2); //hat
        rect(gameChar_x-10,gameChar_y-40,20,25); //body
        
        fill(255);
        rect(gameChar_x,gameChar_y-40,5,20); //short
                
//        tie
        fill(0);
        triangle(gameChar_x+3, gameChar_y-40, gameChar_x, gameChar_y-25,gameChar_x+5, gameChar_y-25);
        triangle(gameChar_x+3, gameChar_y-20, gameChar_x, gameChar_y-25,gameChar_x+5, gameChar_y-25);

        noFill();
        stroke(30);
        strokeWeight(5);
        arc(gameChar_x+18,gameChar_y-38,20,20, HALF_PI, PI); //left arm
        arc(gameChar_x-5,gameChar_y-28,30,20, PI, PI+HALF_PI); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x-20,gameChar_y-28,5); //right hand
        ellipse(gameChar_x+18,gameChar_y-28,5); //left hand
        
        fill(0);
        rect(gameChar_x-7,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-7,gameChar_y,9,3); //left foot
        rect(gameChar_x+8,gameChar_y-22,5,10); //right leg
        rect(gameChar_x+8,gameChar_y-13,9,3); //right foot

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,17); //head
        
        //glasses
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x-7, gameChar_y-52, 5, 6, 0, PI); // glass
        fill(255);
        line(gameChar_x-5, gameChar_y-51, gameChar_x+4, gameChar_y-53); // frame
        
        //        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x-7,gameChar_y-43,7, 6, PI+HALF_PI, 0); //mustage
        strokeWeight(3);
        arc(gameChar_x-2,gameChar_y-47,12, 8, 0, HALF_PI); //beard
        
        noStroke();
        fill(30);
        rect(gameChar_x-5,gameChar_y-72,10,17); //hat
        rect(gameChar_x-10,gameChar_y-57,20,2); //hat
        rect(gameChar_x-7,gameChar_y-40,16,25); //body
        
        fill(255);
        rect(gameChar_x-4,gameChar_y-40,5,20); //short
                
//        tie
        fill(0);
        triangle(gameChar_x-2, gameChar_y-40, gameChar_x-4, gameChar_y-25,gameChar_x+1, gameChar_y-25);
        triangle(gameChar_x-2, gameChar_y-20, gameChar_x-4, gameChar_y-25,gameChar_x+3, gameChar_y-25);

        noFill();
        stroke(30);
        strokeWeight(5);
        arc(gameChar_x-18,gameChar_y-38,20,30, 0, HALF_PI); //left arm
        arc(gameChar_x+4,gameChar_y-23,20,30, PI + HALF_PI, 0); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x-18,gameChar_y-23,5); //left hand
        ellipse(gameChar_x+14,gameChar_y-23,5); //right hand

        fill(0);
        noStroke();
        rect(gameChar_x-7,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-11,gameChar_y,9,3); //left foot
        rect(gameChar_x+3,gameChar_y-15,5,15); //right leg
        rect(gameChar_x-1,gameChar_y,9,3); //right foot

	}
	else if(isRight)
	{
		// add your walking right code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,17); //head
        
        //glasses
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x+7, gameChar_y-52, 5, 6, 0, PI); // glass
        fill(255);
        line(gameChar_x+5, gameChar_y-51, gameChar_x-4, gameChar_y-53); // frame
        
        //        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x+7,gameChar_y-43,7, 6, PI, PI+HALF_PI); //mustage
        strokeWeight(3);
        arc(gameChar_x+2,gameChar_y-47,12, 8, HALF_PI, PI); //beard
                
        noStroke();
        fill(30);
        rect(gameChar_x-5,gameChar_y-72,10,17); //hat
        rect(gameChar_x-10,gameChar_y-57,20,2); //hat
        rect(gameChar_x-8,gameChar_y-40,16,25); //body
        
        fill(255);
        rect(gameChar_x,gameChar_y-40,5,20); //short
                
//        tie
        fill(0);
        triangle(gameChar_x+3, gameChar_y-40, gameChar_x, gameChar_y-25,gameChar_x+5, gameChar_y-25);
        triangle(gameChar_x+3, gameChar_y-20, gameChar_x, gameChar_y-25,gameChar_x+5, gameChar_y-25);


//        arms & hands
        noFill();
        stroke(30)
        strokeWeight(5);
        arc(gameChar_x-8,gameChar_y-23,10,30, PI, PI + HALF_PI); //left arm
        arc(gameChar_x+18,gameChar_y-38,20,30, HALF_PI, PI); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x-13,gameChar_y-23,5); //left hand
        ellipse(gameChar_x+18,gameChar_y-23,5); //right hand

        fill(0);
        noStroke();
        rect(gameChar_x-7,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-7,gameChar_y,9,3); //left foot
        rect(gameChar_x+3,gameChar_y-15,5,15); //right leg
        rect(gameChar_x+3,gameChar_y,9,3); //right foot
	}
	else if(isFalling || isPlummeting || isJumping)
	{
		// add your jumping facing forwards code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,17); //head
        
//        eyes
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x-4, gameChar_y-52, 5, 6, 0, PI); //left glass
        arc(gameChar_x+2, gameChar_y-52, 5, 6, 0, PI); //right glass
        fill(255);
        line(gameChar_x+2, gameChar_y-51, gameChar_x+8, gameChar_y-53); //right frame
        line(gameChar_x-7, gameChar_y-51, gameChar_x-8, gameChar_y-53); //left frame
        
//        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x,gameChar_y-43,7, 6, PI+.6, HALF_PI-2.3); //mustage
        strokeWeight(3);
        arc(gameChar_x,gameChar_y-43,10, 4, 0, PI); //beard
        strokeWeight(1);
        stroke(255,0,0)
        
        strokeWeight(0);
//        hands        
        fill(30);
        noStroke();
        rect(gameChar_x-10,gameChar_y-40,20,25); //body
        fill(255);
        rect(gameChar_x-5,gameChar_y-40,10,20); //short
                
//        tie
        fill(0);
        triangle(gameChar_x, gameChar_y-40, gameChar_x-2, gameChar_y-25,gameChar_x+2, gameChar_y-25);
        triangle(gameChar_x, gameChar_y-20, gameChar_x-2, gameChar_y-25,gameChar_x+2, gameChar_y-25);
        
//        arms & hands
        noFill();
        stroke(30)
        strokeWeight(5);
        arc(gameChar_x-8,gameChar_y-53,18,30, HALF_PI, PI); //left arm
        arc(gameChar_x+8,gameChar_y-53,18,30, 0, PI - HALF_PI); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x-17,gameChar_y-53,5); //left hand
        ellipse(gameChar_x+17,gameChar_y-53,5); //right hand

        fill(30);
        rect(gameChar_x-5,gameChar_y-72,10,17); //hat
        rect(gameChar_x-10,gameChar_y-57,20,2); //hat


        fill(0);
        rect(gameChar_x-20,gameChar_y-20,15,5); //left leg
        rect(gameChar_x-22,gameChar_y-24,3,9); //left foot
        rect(gameChar_x+6,gameChar_y-20,15,5); //right leg
        rect(gameChar_x+19,gameChar_y-24,3,9); //right foot
	}
	else
	{
		// add your standing front facing code
//        head
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,17); //head
//        eyes
        stroke(0);
        strokeWeight(.6);
        fill(0);
        arc(gameChar_x-4, gameChar_y-52, 5, 6, 0, PI); //left glass
        arc(gameChar_x+2, gameChar_y-52, 5, 6, 0, PI); //right glass
        fill(255);
        line(gameChar_x+2, gameChar_y-51, gameChar_x+8, gameChar_y-53); //right frame
        line(gameChar_x-7, gameChar_y-51, gameChar_x-8, gameChar_y-53); //left frame
        
//        beard
        noFill();
        strokeWeight(1.2);
        stroke(50)
        arc(gameChar_x,gameChar_y-43,7, 6, PI+.6, HALF_PI-2.3); //mustage
        strokeWeight(3);
        arc(gameChar_x,gameChar_y-43,10, 4, 0, PI); //beard
        strokeWeight(1);
        
        fill(30);
        noStroke();
        rect(gameChar_x-10,gameChar_y-40,20,25); //body
//        arms & hands
        noFill();
        stroke(30)
        strokeWeight(5);
        arc(gameChar_x-8,gameChar_y-23,18,30, PI, PI + HALF_PI); //left arm
        arc(gameChar_x+8,gameChar_y-23,18,30, PI + HALF_PI, 0); //right arm
        strokeWeight(0);
        fill(235, 240, 165);
        ellipse(gameChar_x-17,gameChar_y-23,5); //left hand
        ellipse(gameChar_x+17,gameChar_y-23,5); //right hand

        fill(30);
        rect(gameChar_x-5,gameChar_y-72,10,17); //hat
        rect(gameChar_x-10,gameChar_y-57,20,2); //hat
        
        fill(255);
        rect(gameChar_x-5,gameChar_y-40,10,20); //short
        
//        tie
        fill(0);
        triangle(gameChar_x, gameChar_y-40, gameChar_x-2, gameChar_y-25,gameChar_x+2, gameChar_y-25);
        triangle(gameChar_x, gameChar_y-20, gameChar_x-2, gameChar_y-25,gameChar_x+2, gameChar_y-25)
        

        fill(0);
        rect(gameChar_x-10,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-14,gameChar_y,9,3); //left foot
        rect(gameChar_x+5,gameChar_y-15,5,15); //right leg
        rect(gameChar_x+5,gameChar_y,9,3); //right foot
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds ()
{
     for (var i = 0; i < clouds.length; i++){
     //    	draw the cloud
        fill(255);
        ellipse(clouds[i].x_pos-40, clouds[i].y_pos, clouds[i].size+80, clouds[i].size-30);//lond ellipse below
        ellipse(clouds[i].x_pos-20, clouds[i].y_pos-40, clouds[i].size-20);//mid ellipse right
        ellipse(clouds[i].x_pos-72, clouds[i].y_pos-50, clouds[i].size+10);//big ellipse
        ellipse(clouds[i].x_pos+20, clouds[i].y_pos-15, clouds[i].size-25);//small elipse right
        ellipse(clouds[i].x_pos-94, clouds[i].y_pos-18, clouds[i].size-10);//small elipse left
    }
}

// Function to draw mountains objects.
function drawMountains ()
{
    for (var i = 0; i < mountains.length; i++){
        //  draw the mountain
        fill(190,190,190);//light grey
        triangle(mountains[i].x_pos, 
                 mountains[i].size,
                 mountains[i].x_pos+146,
                 mountains[i].y_pos,
                 mountains[i].x_pos,
                 mountains[i].y_pos);
        fill(100,100,100);//grey
        triangle(mountains[i].x_pos,
                 mountains[i].size,
                 mountains[i].x_pos-50,
                 mountains[i].y_pos,
                 mountains[i].x_pos,
                 mountains[i].y_pos)  
    }
}

// Function to draw trees objects.
function drawTrees () 
{
    for (var i = 0; i < trees_x.length; i++){
    //  draw the tree
        noStroke();
        fill(74, 43, 18); //brown
        rect(trees_x[i],floorPos_y-45,10,45); // tree trunk

        fill(21, 87, 47); //green
        triangle(trees_x[i]-25,floorPos_y-45,trees_x[i]+5,floorPos_y-97,trees_x[i]-35+70,floorPos_y-45); //lower branch
        triangle(trees_x[i]-25,floorPos_y-75,trees_x[i]+5,floorPos_y-127,trees_x[i]-35+70,floorPos_y-75); //middle branch
        triangle(trees_x[i]-25,floorPos_y-105,trees_x[i]+5,floorPos_y-157,trees_x[i]-35+70,floorPos_y-105);//higher branch
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{    
    //draw the canyon
    fill(102,102,153);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height);//borders of the canyon
    fill(100,155,255);
    rect(t_canyon.x_pos + 20, height, t_canyon.width - 40, -26);//water
    fill(255,215,0);
    rect(t_canyon.x_pos + 20, floorPos_y, t_canyon.width - 40, height);//yellow space for the character to fall within

}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if  (
        (gameChar_world_x > t_canyon.x_pos + 30 && gameChar_y >= floorPos_y) && 
        (gameChar_world_x < t_canyon.x_pos + t_canyon.width - 30 && gameChar_y >= floorPos_y)
        )
    {
        isPlummeting = true;
    }
    if (isPlummeting){
        gameChar_y +=1;
        isLeft = false;
        isRight = false;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(242, 242, 48);
    ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size);
    fill(204, 219, 222)
    ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size-20)

    fill(0);
    textSize(12);
    text("$",t_collectable.x_pos-3,t_collectable.y_pos+4.5);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 35){
        t_collectable.isFound = true;
        game_score +=1;
    }
}

function renderFlagpole (){
    push();
    
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250)
    
    if (flagpole.isReached){
        fill(255,0,255);
        noStroke();
        rect(flagpole.x_pos,floorPos_y - 250,50,50)
    }
    
    if (!flagpole.isReached){
        fill(255,0,255);
        noStroke();
        rect(flagpole.x_pos,floorPos_y-50,50,50)
    }
    
    pop();
}

function checkFlagpole () {
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15){
        flagpole.isReached = true;
    }
}

function checkPlayerDie () {
    if (gameChar_y >= floorPos_y + 140 && lives > 0){
        lives -= 1;
        died = true;
        startGame();
    }
}

function createPlatforms (x,y,length,) {
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function (){
            fill(100);
            rect(this.x, this.y, this.length, 20)
        },
        checkContact: function(gc_x, gc_y){
            if(gc_x > this.x && gc_x < this.x + this.length){
                var d = this.y - gc_y;
                if (this.y === platformHeight.high) {
                    if ((d >= 0 && d < 3) || (isJumping && d > 10 && d <= 100)) {
                        return true;
                    }
                }
                if (this.y === platformHeight.low) {
                    if ((d > 0 && d < 3) || (isJumping && d > 45 && d <= 100)) {
                        return true;
                    }
                }
            }   
            return false;
        }
    }
    return p;
}