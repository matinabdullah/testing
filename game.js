var gameOptions = {
    tileSize: 200,
    tileSpacing: 20,
    boardSize: {
        rows: 4,
        cols: 4
    },
    tweenSpeed: 2000
}




window.onload = function () {

    var gameConfig = {
        width: gameOptions.boardSize.cols * (gameOptions.tileSize +
            gameOptions.tileSpacing) + gameOptions.tileSpacing,
        height: gameOptions.boardSize.rows * (gameOptions.tileSize +
            gameOptions.tileSpacing) + gameOptions.tileSpacing,
        backgroundColor: 0xecf0f1,
        scene: [bootGame, playGame]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
}


class playGame extends Phaser.Scene {

    constructor() {
        super("PlayGame"); // Call the superclass constructor first

        // Define properties
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.timerEvent = null;
        this.timerText = null;

        this.questions = [
            { question: 'শান্তিরক্ষা মিশনে সৈন্য \nপ্রেরণে বাংলাদেশ কততম?:', answers: ['প্রথম', 'দ্বিতীয়', 'পঞ্চম', 'দশম'], correct: 'প্রথম' },
            { question: 'কৃষি উৎপাদনে বিশ্বে \nবাংলাদেশ কততম?:', answers: ['প্রথম', 'দ্বিতীয়', 'পঞ্চম', 'দশম'], correct: 'প্রথম' },
            { question: 'গত ৫ বছরে বাংলাদেশে \nআনুমানিক কত পর্যটক এসেছে?:', answers: ['১ লক্ষ', '২ লক্ষ', '৪ লক্ষ', '৫ লক্ষ'], correct: '৫ লক্ষ'},
            // Add more questions as needed
        ];
    }

    onTimerEvent() {        
        this.timer -= 1;
        this.timerText.setText(`Timer: ${this.timer}`);

        if (this.timer <= 0) {
            this.currentQuestion++;
            if (this.currentQuestion < this.questions.length) {
                // Go to the next question
                this.scene.restart();
            } else {
                this.timerEvent.remove(); // Stop the timer                
                this.children.removeAll();
                console.log(`Game Over! Your score is ${this.score}`);
                this.add.text(200, 300, `Game Over! \nYour score is ${this.score}`, { font: '48px Arial', fill: '#f00' });
            }
    
        }
    }
    create() {
        // Get the width and height of the game scene
        const sceneWidth = this.cameras.main.width;
        const sceneHeight = this.cameras.main.height;
        self = this;
        console.log(sceneWidth);
        console.log(sceneHeight);

        this.timer = 10; // 30 seconds per question
        this.timerText = this.add.text(sceneWidth/2, 10, `Timer: ${this.timer}`,
            { font: '24px Arial', fill: '#FF0000' });
        this.timerText.setOrigin(0.5, 0);

        //debugger;
        this.timerEvent = this.time.addEvent({
            delay: 1000, callback: this.onTimerEvent,
            callbackScope: this, loop: true
        });

        const scoreText = this.add.text(sceneWidth/2, 40, `Score: ${this.score}`,
            { font: '24px Arial', fill: '#FF0000' });
        scoreText.setOrigin(0.5, 0);


        this.displayQuestion.call(this);
    }

    displayQuestion() {
        // Get the width and height of the game scene
        const sceneWidth = this.cameras.main.width;
        const sceneHeight = this.cameras.main.height;
        const self = this; // Store a reference to the scene's `this`
        const question = this.add.text(sceneWidth / 2, 200, this.questions[this.currentQuestion].question,
            { font: '32px Arial', fill: '#05014a' });

        question.setOrigin(0.5, 0);
        for (let i = 0; i < 4; i++) {
            const answer = this.add.text(sceneWidth / 2, 400 + i * 100, this.questions[this.currentQuestion].answers[i],
                { font: '24px Arial', fill: '#05014a' });
            answer.setOrigin(0.5, 0);
            answer.setInteractive();
            answer.on('pointerdown', function () {
                this.setFill('#0f0');
                
                self.checkAnswer.call(self, self.questions[self.currentQuestion].answers[i]);
                
            });
        }
    }

    checkAnswer(selectedAnswer) {

        //debugger;
        this.timerEvent.remove(); // Stop the timer
        this.timer = 10; // Reset the timer for the next question
        
        if (selectedAnswer === this.questions[this.currentQuestion].correct) {
            // Correct answer
            console.log('Correct!');
            this.score += 10;
        } else {
            // Wrong answer
            console.log('Wrong!');
        }

        this.currentQuestion++;

        if (this.currentQuestion < this.questions.length) {
            // Go to the next question
            this.scene.restart();
        } else {
            this.children.removeAll();

            console.log(`Game Over! Your score is ${this.score}`);
            this.add.text(200, 300, `Game Over! \nYour score is ${this.score}`, { font: '40px Arial', fill: '#f00' });
        }
    }

}

class bootGame extends Phaser.Scene {
    constructor() {
        super("BootGame");
    }
    preload() {
        this.load.image("emptytile", "assets/sprites/emptytile.png");
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });
    }
    create() {
        console.log("game is booting...");
        this.scene.start("PlayGame");
    }
}

// there's a whole new function below this comment
function resizeGame() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}