"use strict";
// Game Object Literal
const game = {
    title: "Guess Kazu Game",
    isRunning: false,
    wasRunning: false,
    totalLives: 10,
    playerLives: 10,
    totalTime: 60,
    totalscores: 70,
    timeRemaining: 60,
    loopDuration: 1,
    timeoutId: null,
    mysteryNumber: null,

    // total score numbers
    scoresPrize: 0,

    // Game board
    playerNameVal: $("#player-name"),
    playerName: null,
    nameDisplay: $("#name-display"),
    scoreDisplay: $("#scores"),
    livesDisplay: $("#live-remaining"),
    timeDisplay: $("#time-remaining"),
    guessNumberVal: $("#guess-numbers"),
    guessNumber: null,
    guessMessage: $("#guess-message"),

    // monkeyMessage1: $("#result"),
    monkeyMessage1: $("#result"),
    monkeyMessage2: $("#result2"),
    monkeyMessage3: $("#result3"),

    // buttons
    startBtn: $("#start-btn"),
    numberEnter: $("#submit-number"),

    // audio
    wrongSong: new Audio('audio/wrong.m4a'),
    gameoverSong: new Audio('audio/gameover.m4a'),
    winSong: new Audio('audio/win.m4a'),
    clickSong: new Audio('audio/click.m4a'),

    init() {
        $("h1").text(game.title);
        // return key for submit-number and Start Game button
        $("#game-form").on("submit", function (e) {
            e.preventDefault();
            $(".item").css("animation", "diagonal-move-anim 60s linear infinite alternate");
            game.submitNumber();
        })
        $("#startgame-form").on("submit", function (e) {
            e.preventDefault();
            $(".item").css("animation-play-state", "paused");
        })

        // -------------------------buttons--------------------------------
        // player Name Submit
        $("#start-btn").on("click", function () {
            game.switchScreen("#game-screen");
            game.nameDisplay.text(game.playerName);
            game.livesDisplay.text(game.playerLives);
            game.timeDisplay.text(game.timeRemaining);
            game.scoreDisplay.text(game.playerLives + game.timeRemaining);
            game.mysteryNumber = Math.floor(Math.random() * 101);
            $(".item").css("animation-play-state", "paused");
            game.clickSong.play();
        });
        // Enter player name and start game btn visible
        game.playerNameVal.on('keyup', () => {
            if (game.playerNameVal.val().length) {
                game.playerName = game.playerNameVal.val();
                game.startBtn.prop("disabled", false);
            } else {
                game.startBtn.prop("disabled", true);
            }
        });

        // sellect btn - generate random number (try to set in reset function but not working)
        let radioBtns = document.querySelectorAll("input[name='mode']");
        let selectedMode = document.querySelector("input[name=mode]:checked");
        let findSelected = () => {
            let selected = document.querySelector("input[name=mode]:checked").value;
            if (selected === "Easy") {
                game.monkeyMessage1.text("Easy: Guess numbers 0-100");
                game.mysteryNumber = Math.floor(Math.random() * 101);
            } else if (selected === "Medium") {
                game.monkeyMessage1.text("Medium: Guess numbers 0-500");
                game.monkeyMessage3.text("Medium: Guess numbers 0-500");
                game.mysteryNumber = Math.floor(Math.random() * 501);
            } else if (selected === "Hard") {
                game.monkeyMessage1.text("Hard: Guess numbers 0-1000");
                game.monkeyMessage3.text("Hard: Guess numbers 0-1000");
                game.mysteryNumber = Math.floor(Math.random() * 1001);
            };
        }
        radioBtns.forEach(radioBtn => {
            radioBtn.addEventListener("change", findSelected);
        });

        // Reset or play again btn clicked refresh game screen
        $(".reset").on("click", function () {
            game.resetGame();
            // $("#easy").prop("checked", true);
            // game.mysteryNumber = Math.floor(Math.random() * 101);
            // game.monkeyMessage1.text("Easy: Guess numbers 0-100");
        });
        // Quit btn clicked - back to splash screen
        $(".quit").on("click", function () {
            game.resetGame();
            $("#easy").prop("checked", true);
            game.switchScreen("#splash-screen");
            $(".game-bg").show();
            game.startBtn.prop("disabled", true);
            game.nameDisplay.innerText = "";
            game.playerNameVal.val("");
            game.playerName = null;
            game.clickSong.play();
            game.monkeyMessage1.text("Easy: Guess numbers 0-100");
            game.monkeyMessage3.text("Easy: Guess numbers 0-100");
        });

        // play-again btn click
        $(".play-again").on("click", function () {
            game.switchScreen("#game-screen");
            game.resetGame();
            $(".game-bg").show();
            $("#easy").prop("checked", true);
            game.mysteryNumber = Math.floor(Math.random() * 101);
            game.clickSong.play();
        })

        // change mode - reset game
        $('input[type=radio][name=mode]').change(function () {
            game.resetGame();
        });

        // game rules btn clicked - timer pause
        $("#game-rules2").on("click", function () {
            if (game.isRunning === true) {
                game.toggleRunning();
                game.wasRunning = true;
                clearTimeout(game.timeoutId);
            };
            if (game.isRunning === false) {
                game.wasRunning === false;
            };
            // pause sun animation
            $(".item").css("animation-play-state", "paused");
        })
        // game rules btn close - timer start again
        $("#game-rules-btn2").on("hidden.bs.modal", function () {
            if (game.wasRunning === true) {
                game.wasRunning = false;
                game.startTimer();
                // run sun animation
                $(".item").css("animation-play-state", "running");
            };
        })
        // Guess numbers
        $("#submit-number").on("click", function () {
            $(".item").css("animation", "diagonal-move-anim 60s linear infinite alternate");
            game.submitNumber();
        })
    },

    // ----------------functions----------------------------

    toggleRunning() {
        game.isRunning = !game.isRunning;
        if (game.isRunning) {
            game.startTimer();
        } else if (!game.isRunning) {
            clearTimeout(game.timeoutId);
        }
    },

    switchScreen(currentScreen) {
        // Hide all of the other screens
        $(".screen").hide();
        // Show the current screen
        $(currentScreen).show();
    },
    // start timer
    startTimer: function () {
        if (!game.isRunning) {
            game.timeoutId = setTimeout(game.timeLoop, 1000);
            game.isRunning = true;
        }
    },
    timeLoop: function () {
        if (!game.isRunning) {
            return true;
        }
        if (game.timeRemaining > 0) {
            game.timeoutId = setTimeout(game.timeLoop, 1000);
            game.timeRemaining -= 1;
            game.updateClock();
            // sun animation start
            $(".item").css("animation-play-state", "running");
        }

        if (game.timeRemaining == 0) {
            game.switchScreen("#game-over");
            $(".game-bg").hide();
        }
    },
    updateClock: function () {
        let timeDisplay2 = game.timeRemaining % 60;
        if (timeDisplay2 < 10) {
            timeDisplay2 = `0${game.timeRemaining}`;
        }
        $("#time-remaining").text(timeDisplay2);
        game.scoreDisplay.text(game.playerLives + game.timeRemaining);
    },

    // reset function
    resetGame: function() {
    game.isRunning = false;
    clearTimeout(game.timeoutId);
    game.timeRemaining = game.totalTime;
    game.playerLives = game.totalLives;
    game.guessNumberVal.val("");
    game.guessNumber = null;
    // Clearing DOM elements
    game.timeDisplay.text(game.timeRemaining);
    game.livesDisplay.text(game.totalLives);
    game.scoreDisplay.text(game.totalscores);
    game.monkeyMessage2.text("");
    // sun animation
    $(".item").css("animation", "none");
    $(".item").css("animation-play-state", "paused");
    game.clickSong.play();
    },

    submitNumber () {
        // Timer start
        $(".game-bg").show();
        // check if player-guess is a number
        const playerGuess = $("#guess-numbers").val();
        let selected = $("input[name=mode]:checked").val();
        if (
            (playerGuess == "" || playerGuess < 0 || (selected === "Easy" && playerGuess > 100)) ||
            (playerGuess == "" || playerGuess < 0 || (selected === "Medium" && playerGuess > 500)) || (playerGuess == "" || playerGuess < 0 || (selected === "Hard" && playerGuess > 1000))
        ) {
            game.wrongSong.play();
            alert("Please enter a valid number.");
        } else {
            game.startTimer();
            // player guess the mystery number
            if (Number(playerGuess) === game.mysteryNumber) {
                $(".fireworks").hide();
                clearTimeout(game.timeoutId);
                game.switchScreen("#win-game");
                game.winSong.play();
                $(".game-bg").hide();
                game.scoresPrize = Number($("#scores").text())
                game.prize();
                $("#win-message").html(`Great Guess, ${game.playerNameVal.val()}!<br>${playerGuess} was correct! Your scores: ${game.scoresPrize}`);
            }
            // guessed number < mystery number
            else if (playerGuess < game.mysteryNumber) {
                $(".game-bg").show();
                game.monkeyMessage2.html(`${playerGuess} is too low. <br> Try again.`);
                // failed = lives -1
                game.playerLives--;
                game.livesDisplay.text(game.playerLives);
                game.wrongSong.play();
                game.guessNumberVal.val("");
            }
            // guessed number > mystery number
            else {
                $(".game-bg").show();
                game.monkeyMessage2.html(`${playerGuess} is too high. <br> Try again.`);
                //  failed = lives -1
                game.playerLives--;
                game.livesDisplay.text(game.playerLives);
                game.wrongSong.play();
                game.guessNumberVal.val("");
            }
            // used 10 lives or time is up - show gameover screen
            if (game.playerLives <= 0 || game.timeRemaining <= 0) {
                game.switchScreen("#game-over");
                $(".game-bg").hide();
                game.gameoverSong.play();
                game.resetGame();
            }
        }
    },
    
    // prize
    prize() {
        if (game.scoresPrize < 15) {
            $("#peel-bg").show();
        } else if (16 <= game.scoresPrize && game.scoresPrize <= 30) {
            $("#insect-bg").show();
        } else if (31 <= game.scoresPrize && game.scoresPrize <= 40) {
            $("#nut-bg").show();
        } else if (41 <= game.scoresPrize && game.scoresPrize <= 50) {
            $("#potato-bg").show();
        } else if (51 <= game.scoresPrize && game.scoresPrize <= 60) {
            $("#banana-bg").show();
        } else if (61 <= game.scoresPrize && game.scoresPrize <= 70) {
            $("#gold-bg").show();
        }
    }
};

game.init();