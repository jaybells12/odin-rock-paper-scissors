interface ScoreCard {
  player: number;
  computer: number;
}

function gameLoop(): void {
  //All necessary DOM queries are executed once, here, on initialization.
  const choices: HTMLCollection = document.getElementsByClassName("choice");
  const resultsElement: HTMLElement | null = document.getElementById("results");
  const overlayElements: HTMLCollection | null =
    document.getElementsByClassName("overlay");
  const playerScore: HTMLElement | null =
    document.getElementById("player_score");
  const computerScore: HTMLElement | null =
    document.getElementById("computer_score");
  const hands: HTMLCollection | null =
    document.getElementsByClassName("selection--wrapper");
  const playerHand: Element | null = hands[0].firstElementChild;
  const computerHand: Element | null = hands[1].firstElementChild;
  const scores: ScoreCard = {
    player: 0,
    computer: 0,
  };
  let throttled: boolean = false;

  // The player click starts and progresses the game loop.
  function playRound(e: Event): void {
    if (throttled) return;
    throttled = true;

    const playerChoice: EventTarget | null = e.target;

    try {
      if (!(playerChoice instanceof HTMLElement))
        throw new Error("Click target is not an HTML element");
      if (!playerChoice.dataset.value)
        throw new Error(
          "Element clicked does not have a data attribute of value"
        );
      if (!hands) throw new Error("Could not find game hands elements");
      if (!playerHand || !computerHand)
        throw new Error("Could not find individual hand element");
      if (!resultsElement) throw new Error("Could not find results element");
      if (!overlayElements) throw new Error("Could not find overlay elements");
      if (!playerScore) throw new Error("Could not find player score element");
      if (!computerScore)
        throw new Error("Could not find computer score element");

      const playerInput: string = playerChoice.dataset.value;
      const computerInput: string = getComputerChoice();
      const outcome: string = calcWinner(playerInput, computerInput);

      insertHandSelections(playerHand, "rock", computerHand, "rock");
      animateHands(hands);
      // Timeout here to change the image of the hands just before the animation finishes,
      // this gives a more natural look and feel to the transition. animation length is currently 1600ms
      setTimeout(
        () =>
          insertHandSelections(
            playerHand,
            playerInput,
            computerHand,
            computerInput
          ),
        1550
      );

      // Timeout here to allow the animation to finish and half a second to pass for the player to see the hands of the game board,
      // then the outcome is displayed in text, while everything else is faded. The user must click to continue playing.
      // Timings to manipulate:
      //      animation length: (1600) + delay(600)
      //      transition duration: 250ms
      setTimeout(() => {
        nextRound(outcome, hands, scores, playerScore, computerScore);
        isGameOver(
          resultsElement,
          overlayElements,
          scores,
          playerScore,
          computerScore
        );
        throttled = false;
      }, 2200);
    } catch (err: any) {
      console.log(`Error: ${err}`);
    }
  }

  for (let i: number = 0; i < choices.length; i++) {
    choices[i].addEventListener("click", playRound);
  }
}

function getComputerChoice(): string {
  // Use random number, 0-2 inclusive, to select a string to return, from the static array
  return ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
}

function calcWinner(player: string, computer: string): string {
  if (player === computer) return "Draw";
  switch (player) {
    case "rock":
      if (computer === "scissors") {
        return "Win";
      } else {
        return "Lose";
      }
    case "paper":
      if (computer === "rock") {
        return "Win";
      } else {
        return "Lose";
      }
    case "scissors":
      if (computer === "paper") {
        return "Win";
      } else {
        return "Lose";
      }
    default:
      throw new Error("Invalid player input string");
  }
}

function animateHands(hands: HTMLCollection): void {
  for (let i = 0; i < hands.length; i++) {
    hands[i].classList.add("animateHand");
  }
}

function insertHandSelections(
  pHand: Element,
  pSelection: string,
  cHand: Element,
  cSelection: string
): void {
  if (!pHand.hasAttribute("src") || !cHand.hasAttribute("src"))
    throw new Error("No src attribute found on selection element");

  pHand.setAttribute("src", `./assets/${pSelection}-player.svg`);
  cHand.setAttribute("src", `./assets/${cSelection}-comp.svg`);
}

function updateScoreboard(
  scores: ScoreCard,
  playerScore: HTMLElement,
  computerScore: HTMLElement
): void {
  playerScore.innerText = `${scores.player}`;
  computerScore.innerText = `${scores.computer}`;
}

function activateOverlay(
  resultsElement: HTMLElement,
  overlayElements: HTMLCollection,
  resultText: string,
  scores: ScoreCard,
  playerScore: HTMLElement,
  computerScore: HTMLElement
): void {
  for (let i = 0; i < overlayElements.length; i++) {
    overlayElements[i].classList.add("fade");
  }

  resultsElement.innerText = resultText;
  window.addEventListener("click", (e: Event) =>
    resetGame(
      e,
      scores,
      playerScore,
      computerScore,
      overlayElements,
      resultsElement
    )
  );
}

function nextRound(
  resultsString: string,
  hands: HTMLCollection,
  scores: ScoreCard,
  playerScore: HTMLElement,
  computerScore: HTMLElement
): void {
  // Can insert logic here for game reset, IE reaching 5 points
  if (resultsString === "Win") {
    scores.player += 1;
  } else if (resultsString === "Lose") {
    scores.computer += 1;
  }

  // for (let i = 0; i < overlayElements.length; i++) {
  //   overlayElements[i].classList.remove("fade");
  // }

  for (let i = 0; i < hands.length; i++) {
    hands[i].classList.remove("animateHand");
  }

  // resultsElement.innerText = "";

  updateScoreboard(scores, playerScore, computerScore);
  // insertHandSelections(pHand, "rock", cHand, "rock");
}

function isGameOver(
  resultsElement: HTMLElement,
  overlayElements: HTMLCollection,
  scores: ScoreCard,
  playerScore: HTMLElement,
  computerScore: HTMLElement
): void {
  if (scores.player === 5) {
    activateOverlay(
      resultsElement,
      overlayElements,
      "Congratulations! You won!",
      scores,
      playerScore,
      computerScore
    );
  } else if (scores.computer === 5) {
    activateOverlay(
      resultsElement,
      overlayElements,
      "Better luck next time!",
      scores,
      playerScore,
      computerScore
    );
  }
}

function resetGame(
  e: Event,
  scores: ScoreCard,
  pScoreElement: HTMLElement,
  cScoreElement: HTMLElement,
  overlayElements: HTMLCollection,
  resultsElement: HTMLElement
): void {
  e.stopPropagation();

  scores.player = 0;
  scores.computer = 0;

  for (let i = 0; i < overlayElements.length; i++) {
    overlayElements[i].classList.remove("fade");
  }

  resultsElement.innerText = "";
  updateScoreboard(scores, pScoreElement, cScoreElement);
}
// Initialize
gameLoop();
