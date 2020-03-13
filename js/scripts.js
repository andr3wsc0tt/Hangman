var canvas = document.getElementById('hangCanvas');
var ctx = canvas.getContext("2d");

function drawCircle(x, y, r, s0, e0) {
    ctx.beginPath();
    ctx.arc(x, y, r, s0, e0);
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawEyes(x1, y1)
{
    ctx.font = "9px Arial";
    ctx.fillText("x", x1, y1);
}

function happyEyes(x1, y1)
{
    ctx.font = "9px Arial";
    ctx.fillText("> <", x1, y1);
}

function drawMan(guesses) {
    switch (guesses) {
        case 6:
            drawCircle(150, 25, 10, 0, 2 * Math.PI); // head
            break;
        case 5:
            drawLine(150, 35, 150, 55); // neck
            break;
        case 4:
            drawLine(125, 55, 150, 55); // left arm
            break;
        case 3:
            drawLine(175, 55, 150, 55); // right arm
            break;
        case 2:
            drawLine(150, 55, 150, 80); // body
            break;
        case 1:
            drawLine(150, 80, 135, 95); // left leg
            break;
        case 0:
            drawLine(150, 80, 165, 95); // right leg
            drawEyes(145, 25); // left eye
            drawEyes(151, 25); // right eye
            drawCircle(150, 32, 5, Math.PI+0.2, -0.2);
            break;
        default: // Happy Man
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCircle(150, 25, 10, 0, 2 * Math.PI); // head
            drawLine(150, 35, 150, 55); // neck
            drawLine(125, 55, 150, 55); // left arm
            drawLine(175, 55, 150, 55); // right arm
            drawLine(150, 55, 150, 80); // body
            drawLine(150, 80, 135, 95); // left leg
            drawLine(150, 80, 165, 95); // right leg
            happyEyes(144, 25); // left eye
            drawCircle(150, 27, 5, -0.2, Math.PI+0.2);
    }
}
function buildNoose()
{
    drawLine(5, 130, 55, 130);
    drawLine(30, 130, 30, 10);
    drawLine(30, 10, 150, 10);
    drawLine(150, 10, 150, 15);
}

function Hangman(Guesses, Word) {

    this.Guesses = Guesses;
    this.Word = Word;

    this.hidden = [...Array(Word.length).keys()]; // Store the indices of the hidden (unguessed) letters
    this.shown = []; // Store the indices of the found letters

    buildNoose();

    this.makeGuess = function (letter) {
        var finalword = "";

        if (this.Word.includes(letter)) { // If the secret word 'includes()' the guessed letter
            for (let i = 0; i < this.Word.length; i++) { // Check each letter in the chosen word
                if (this.Word[i] == letter && !this.shown.includes(i)) { // If the guessed letter is the same as a letter in the secret word and it hasn't been guessed yet (it's index isn't in shown[])
                    this.hidden.splice(i, 1); // Remove it's index from the hidden list
                    this.shown.push(i); // Add it's index to the shown list
                }
            }
        }
        else {
            this.Guesses -= 1; // Lose a turn
            drawMan(this.Guesses); 
        }

        /* Create the "Guessed so far" word */
        for (var show = 0; show < Word.length; show++) {
            if (this.shown.includes(show)) { // If a letter in the secret words' index is in shown
                finalword += Word[show]; // Add it to the "Guessed so far" word

            }
            else // Else add a '-'
                finalword += "-";
        }

        /* Add the letter guessed and the word so far to the HTML*/
        var guessedList = document.getElementById('letterguess');
        guessedList.textContent += ` ${letter}`;

        var wordStat = document.getElementById('guess');
        wordStat.textContent = finalword;
        

    }

    this.playGame = function (letter) {
        this.makeGuess(letter); // Get guess

        if (this.shown.length == this.Word.length) // If you found all the letters
        {  
            drawMan();
            alert("YOU WIN!");
        }
        if (Game.Guesses == 0) // If you ran out of turns
        {
            var wordStat = document.getElementById('guess');
            wordStat.textContent = this.Word; // Show what the hidden word was

            /* alert() needs a timeout function to set the background HTML or it doesn't let the HTML load */
            setTimeout(function(){
                alert("GAME OVER");
            },2);
            setTimeout(function(){
                location.reload(); 
            },2);
        }
    }

}
var wordlist = `Ant
Antelope
Ape
Ass
Badger
Bat
Bear
Beaver
Bird
Boar
Camel
Canary
Cat
Cheetah
Chicken
Chimpanzee
Chipmunk
Cow
Crab
Crocodile
Deer
Dog
Dolphin
Donkey
Duck
Eagle
Elephant
Ferret
Fish
Fox
Frog
Goat
Hamster
Hare
Horse
Kangaroo
Leopard
Lion
Lizard
Mole
Monkey
Mousedeer
Mule
Ostritch
Otter
Panda
Parrot
Pig
Polecat
Porcupine
Rabbit
Rat
Rhinoceros
Seal
Sheep
Snake
Squirrel
Tapir
Toad
Tiger
Tortoise
Walrus
Whale
Wolf
Zebra`.toUpperCase(); // Convert all the words to UPPERCASE

wordlist = wordlist.split('\n'); // Split each word into it's own array element

var randomNum = Math.floor((Math.random() * wordlist.length)); // Choose a random number between 0 and the length of the wordlist-1

Game = new Hangman(7, wordlist[randomNum]); // Initialize the game with the word chosen and 7 guesses (Head, neck, 2 arms, body, 2 legs) == 7

var wordStat = document.getElementById('guess');
wordStat.textContent = '-'.repeat(Game.Word.length); // Show how many letters are in the word at the beginning of the game

var x = document.getElementById('formGet'); // Get the input form (Guess Box)

x.addEventListener('submit', function (event) { // Wait for the submit click
    event.preventDefault();

    var letter = document.getElementById('letter').value;
    letter = letter.toUpperCase();
    if (letter.length == 1) // Don't let more than one letter be entered
        Game.playGame(letter); // PLAY!

    document.getElementById('letter').value = ""; // Reset the Guess input box
});
