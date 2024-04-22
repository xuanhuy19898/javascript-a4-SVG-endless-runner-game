//Xuan Huy Pham / 000899551
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const startButton = document.getElementById('start-button');
    const optionForm = document.getElementById('option-form');
    const player = document.getElementById('player');
    const obstacle = document.getElementById('obstacle');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const gameOverPopup = document.getElementById('game-over-popup');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');


    //declares variables
    let score = 0;
    let lives = 5;
    let obstacleSpeed = 7;
    let gameRunning = false; //game won't start until user select START button
    let isJumping = false;
    let jumpHeight = 130;
    let obstacleAppearance = 'default';
    let playerAppearance = 'player-default';
    let hasCollided = false;


    //display pop-up menu to select object/obstacles when the page loads
    modal.style.display = 'block'; 

    //event listener for START button
    startButton.addEventListener('click', () => {
        modal.style.display = 'none';
        startGame();
    });

    //event listener for selecting player/obstacles appearance
    optionForm.addEventListener('change', (event) => {
        obstacleAppearance = event.target.value;
        playerAppearance = event.target.value;
    });

    //function to initialize game
    function startGame() {
        gameRunning = true;
        //set obstacle appearance based on user's choice
        if (obstacleAppearance === 'default') {
            obstacle.style.backgroundColor = 'yellow';
            obstacle.style.backgroundImage = 'none';
        } else if (obstacleAppearance === 'imageA') {
            obstacle.style.backgroundColor = 'transparent';
            obstacle.style.backgroundImage = "url('additional/imageA.png')";
            obstacle.style.backgroundSize = 'cover';
            obstacle.style.width = '80px';
            obstacle.style.height = '70px';
        } else if (obstacleAppearance === 'imageB') {
            obstacle.style.backgroundColor = 'transparent';
            obstacle.style.backgroundImage = "url('additional/imageB.png')";
            obstacle.style.backgroundSize = 'cover';
            obstacle.style.width = '60px';
            obstacle.style.height = '60px';
        }
    
        //set player appearance based on user's choice
        const playerAppearance = document.querySelector('input[name="player-option"]:checked').value;
        if (playerAppearance === 'player-default') {
            player.style.backgroundColor = 'white';
            player.style.backgroundImage = 'none';
        } else if (playerAppearance === 'picA') {
            player.style.backgroundColor = 'transparent';
            player.style.backgroundImage = "url('additional/bart.png')";
            player.style.backgroundSize = 'cover';
            player.style.width = '100px';
            player.style.height = '100px';
        } else if (playerAppearance === 'picB') {
            player.style.backgroundColor = 'transparent';
            player.style.backgroundImage = "url('additional/mario.png')";
            player.style.backgroundSize = 'cover';
            player.style.width = '80px';
            player.style.height = '100px';
        }
    }
    

    //function to make the obstacles move
    function moveObstacle() {
        //if the game is running
        if (gameRunning) {
            //retrieve the game container and its width
            const gameContainer = document.getElementById('game-container');
            const gameContainerWidth = gameContainer.offsetWidth;
            //get the current position of the obstacle
            let obstaclePosition = obstacle.offsetLeft;

            //if current obstacle is out of the container
            if (obstaclePosition <= 0) {
                //move the obstacle to the right side of the container again
                obstacle.style.left = `${gameContainerWidth}px`;
                score++; //increase score and then update score
                scoreDisplay.textContent = `Score: ${score}`;

                //increase obstacle speed by 1 for every 2 score user achieves
                if (score % 2 === 0) {
                    obstacleSpeed += 1;
                }
            } else {
                //move obstacle towards the left
                obstacle.style.left = `${obstaclePosition - obstacleSpeed}px`;
            }

            //if there's collision between player and obstacle
            //decrease the number of lives and update the lives
            if (checkCollision()) {
                lives--;
                livesDisplay.innerHTML = `<img id="heartIcon" src="additional/live.png" alt="Heart" width="40px"> <span id="livesCount">${lives}</span>`;
                if (lives === 0) {//end game if there's no lives left
                    endGame();
                }
            }
        }
    }


    // Function to check collision between player and obstacle
    function checkCollision() {
        //get the bounding rectangles of player and obstacle
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        //check if  player and obstacle intersect
        const collision = playerRect.right >= obstacleRect.left &&
                        playerRect.left <= obstacleRect.right &&
                        playerRect.bottom >= obstacleRect.top &&
                        playerRect.top <= obstacleRect.bottom;

        //if there's a collision and player hasn't already collided in this cycle
        if (collision && !hasCollided) {
            hasCollided = true;
            return true; //collision found
        } else if (!collision) {//if there's no collision, set the flag as false
            hasCollided = false;
        }
        return false; //no collision found
    }


    //function to handle player jump
    function jump() {
        //if player is not already jumping
        if (!isJumping) {
            isJumping = true;
            let jumpCount = 0;
            //start jump interval, get the current position of player
            let jumpInterval = setInterval(() => {
                let playerPosition = parseInt(getComputedStyle(player).getPropertyValue('bottom'));
                //if the jump count exceeds twice the jump height
                if (jumpCount >= jumpHeight * 2) { 
                    clearInterval(jumpInterval);
                    //start fall interval the make player descend
                    let fallInterval = setInterval(() => {
                        //if player touches the ground, clear fall interval and set isJumping flag as false
                        if (playerPosition <= 0) {
                            clearInterval(fallInterval);
                            isJumping = false;
                        } else {
                            player.style.bottom = `${playerPosition - 5}px`;
                            playerPosition -= 5;
                        }
                    }, 20);
                    //if the jump count is less than the jump height, move player upwards
                } else if (jumpCount < jumpHeight) {
                    player.style.bottom = `${playerPosition + 6}px`; //ascend player
                } else {
                    player.style.bottom = `${playerPosition - 5}px`; //descend player
                }
                playJumpSound();//add sound
                jumpCount += 5;//increment jump count
            }, 20);
        }
    }

    //function to add jumping sound effect when player jumps
    function playJumpSound() {
        const jumpSound = document.getElementById('jumpSound');
        jumpSound.currentTime = 0; //reset audio to start
        jumpSound.play();
    }


    //function to end the game, set gameRunning flag as false since game is done and display score
    function endGame() {
        gameRunning = false;
        gameOverPopup.style.display = 'block';
        finalScoreDisplay.textContent = `Your Score: ${score}`;
    }

      //function to restart the game
      function restartGame() {
        //reset to initial score and lives, and obstacle speed as well as its position
        score = 0;
        lives = 5;
        obstacleSpeed = 7;
        obstacle.style.left = '100%';
        scoreDisplay.textContent = `Score: ${score}`;
        livesDisplay.innerHTML = `<img id="heartIcon" src="additional/live.png" alt="Heart" width="40px"> <span id="livesCount">${lives}</span>`;
        gameOverPopup.style.display = 'none';
        gameRunning = false;
        modal.style.display = 'block';
    }



    //event listener for restart button
    restartButton.addEventListener('click', restartGame);

    //event listener for space key on keyboard
    document.addEventListener('keydown', (event) => {
        if (gameRunning && event.code === 'Space') {
            jump();
        }
    });

    //event listener for mouse click option
    document.addEventListener('click', () => {
        if (gameRunning) {
            jump();
        }
    });

    //set game loop
    setInterval(() => {
        if (gameRunning) {
            moveObstacle();
        }
    }, 20);
});
