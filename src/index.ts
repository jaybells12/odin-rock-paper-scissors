function getComputerChoice(): string {
  // Use random number, 0-2 inclusive, to select a string to return, from the static array
  return ["Rock", "Paper", "Scissors"][Math.floor(Math.random() * 3)];
}

function getPlayerChoice(): string {
  let input: string | null;
  let keepGoing: boolean = true;
  let choice: string = "";
  // Loop prompting user for a valid input. Loop continues until a valid response is entered, then the formatted response is returned
  do {
    input = prompt("Please type your choice: Rock, Paper, or Scissors?");
    if (typeof input === "string") {
      choice = input.toLowerCase();
      if (choice === "rock" || choice === "paper" || choice === "scissors")
        keepGoing = false;
    }
  } while (keepGoing);

  // Formats string so first letter is capitalized
  return choice.charAt(0).toUpperCase() + choice.slice(1);
}

//playRound function compares player selection to computer selection in the form of strings, it returns a win/lose message.
function playRound(
  playerSelection: string,
  computerSelection: string,
  scoreCard: [number, number]
): string {
  let msg: string = "";

  if (playerSelection === computerSelection) {
    msg = "It's a tie!";
  } else {
    switch (playerSelection) {
      case "Rock":
        if (computerSelection === "Scissors") {
          msg = `You Win! ${playerSelection} crushes ${computerSelection}`;
          scoreCard[0]++;
        } else {
          msg = `You Lose! ${playerSelection} is covered by ${computerSelection}`;
          scoreCard[1]++;
        }
        break;
      case "Paper":
        if (computerSelection === "Rock") {
          msg = `You Win! ${playerSelection} covers ${computerSelection}`;
          scoreCard[0]++;
        } else {
          msg = `You Lose! ${playerSelection} is cut by ${computerSelection}`;
          scoreCard[1]++;
        }
        break;
      case "Scissors":
        if (computerSelection === "Paper") {
          msg = `You Win! ${playerSelection} cuts ${computerSelection}`;
          scoreCard[0]++;
        } else {
          msg = `You Lose! ${playerSelection} is crushed by ${computerSelection}`;
          scoreCard[1]++;
        }
        break;
    }
  }

  return msg;
}

// Main game loop: currently hardcoded to run until either the player or the computer reaches 5 wins.

function game(): void {
  const scoreCard: [number, number] = [0, 0];

  do {
    console.log(playRound(getPlayerChoice(), getComputerChoice(), scoreCard));
    console.log(
      `Current score: Player - ${scoreCard[0]} Computer - ${scoreCard[1]}`
    );
  } while (scoreCard[0] < 5 && scoreCard[1] < 5);

  //The player score is held in first position
  if (scoreCard[0] >= 5) {
    console.log(`Great Job! You Won!!`);
  } else {
    console.log(`Aw shucks! The computer won. Better luck next time!`);
  }
}
