import gameObj from "./game.js";
const game = new gameObj();

const initApp = () => {
  initAllTimeData();
  updateScoreBoard();
  listenForPlayerChoice();
  listenForEnterKey();
  listenForPlayAgain();
  lockComputerGameBoardHeight();
  //focusOnH1
};

document.addEventListener("DOMContentLoaded", initApp);

const initAllTimeData = () => {
  game.setP1AllTime(parseInt(localStorage.getItem("p1AllTime")) || 0);
  game.setCpAllTime(parseInt(localStorage.getItem("cpAllTime")) || 0);
};

const updateScoreBoard = () => {
  const p1 = document.getElementById("p1_all_time_score");
  p1.textContent = game.getP1AllTime();
  p1.ariaLabel = `Player One has ${game.getP1AllTime()} all time wins`;

  const cp = document.getElementById("cp_all_time_score");
  cp.textContent = game.getCpAllTime();
  cp.ariaLabel = `Computer has ${game.getCpAllTime()} all time wins`;

  const p1S = document.getElementById("p1_session_score");
  p1S.textContent = game.getP1Session();
  p1S.ariaLabel = `Player One has ${game.getP1Session()} session wins`;

  const cpS = document.getElementById("cp_session_score");
  cpS.textContent = game.getCpSession();
  cpS.ariaLabel = `Computer has ${game.getCpSession()} session wins`;
};

const listenForPlayerChoice = () => {
  const p1Choice = document.querySelectorAll(
    ".playerBoard .gameBoard__square img"
  );
  p1Choice.forEach((img) => {
    img.addEventListener("click", (event) => {
      if (game.getActiveStatus()) return;
      game.startGame();
      const playerChoice = event.target.parentElement.id;
      updateP1Message(playerChoice);
      p1Choice.forEach((img) => {
        if (img === event.target) {
          img.parentElement.classList.add("selected");
        } else {
          img.parentElement.classList.add("not-selected");
        }
      });
      computerAnimationSequence(playerChoice);
    });
  });
};

const listenForEnterKey = () => {
  window.addEventListener("keydown", (event) => {
    if (event.code === "Enter" && event.target.tagName === "img") {
      event.target.click();
    }
  });
};

const listenForPlayAgain = () => {
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    resetBoard();
  });
};

const lockComputerGameBoardHeight = () => {
  const cpGameBoard = document.querySelector(".computerBoard .gameBoard");
  const cpStyle = getComputedStyle(cpGameBoard);
  const cpHeight = cpStyle.getPropertyValue("height");
  cpGameBoard.style.minHeight = cpHeight;
};

const updateP1Message = (playerChoice) => {
  let p1Msg = document.getElementById("p1msg").textContent;
  p1Msg += ` ${toProperCase(playerChoice)}!`;
  document.getElementById("p1msg").textContent = p1Msg;
};

const toProperCase = (string) => {
  const properString = string.charAt(0).toUpperCase() + string.slice(1);
  return properString;
};

const computerAnimationSequence = (playerChoice) => {
  let interval = 1000;
  setTimeout(() => computerChoiceAnimation("cp_rock", 1), interval);
  setTimeout(() => computerChoiceAnimation("cp_paper", 2), (interval += 500));
  setTimeout(
    () => computerChoiceAnimation("cp_scissors", 3),
    (interval += 500)
  );
  setTimeout(() => countdownFade(), (interval += 750));
  setTimeout(() => {
    deleteCountdown();
    finishGameFlow(playerChoice);
  }, (interval += 1000));
  setTimeout(() => askUsersToPlayAgain(), (interval += 1000));
};

const computerChoiceAnimation = (elementId, number) => {
  const element = document.getElementById(elementId);
  element.firstElementChild.remove();
  const p = document.createElement("p");
  p.textContent = number;
  element.append(p);
};

const countdownFade = () => {
  const countdown = document.querySelectorAll(
    ".computerBoard .gameBoard__square p"
  );
  countdown.forEach((p) => {
    p.className = "fadeOut";
  });
};

const deleteCountdown = () => {
  const countdown = document.querySelectorAll(
    ".computerBoard .gameBoard__square p"
  );
  countdown.forEach((p) => {
    p.remove();
  });
};

const finishGameFlow = (playerChoice) => {
  const computerChoice = getComputerChoice();
  const winner = determineWinner(playerChoice, computerChoice);
  const actionMessage = buildActionMessage(
    winner,
    playerChoice,
    computerChoice
  );
  displayActionMessage(actionMessage);
  updateAriaResult(actionMessage, winner);
  updateScoreState(winner);
  updatePersistentData(winner);
  updateScoreBoard();
  updateWinnerMessage(winner);
  displayComputerChoice(computerChoice);
};

const getComputerChoice = () => {
  const randomNumber = Math.floor(Math.random() * 3);
  const compArray = ["rock", "paper", "scissors"];
  const compChoice = compArray[randomNumber];
  return compChoice;
};

const determineWinner = (playerChoice, computerChoice) => {
  if (playerChoice === computerChoice) return "tie";
  if (
    (playerChoice === "rock" && computerChoice === "paper") ||
    (playerChoice === "paper" && computerChoice === "scissors") ||
    (playerChoice === "scissors" && computerChoice === "rock")
  )
    return "computer";
  return "player";
};

const buildActionMessage = (winner, playerChoice, computerChoice) => {
  if (winner === "tie") return "A Tie Game!";
  if (winner === "computer") {
    const action = getAction(computerChoice);
    return `${toProperCase(computerChoice)} ${action} ${toProperCase(
      playerChoice
    )}.`;
  } else {
    const action = getAction(playerChoice);
    return `${toProperCase(playerChoice)} ${action} ${toProperCase(
      computerChoice
    )}`;
  }
};

const getAction = (choice) => {
  const action =
    choice === "rock" ? "smashes" : choice === "paper" ? "wraps" : "cuts";
  return action;
};

const displayActionMessage = (actionMessage) => {
  const cpmsg = document.getElementById("cpmsg");
  cpmsg.textContent = actionMessage;
};

const updateAriaResult = (actionMessage, winner) => {
  const ariaResult = document.getElementById("playAgain");
  const winMessage =
    winner === "player"
      ? "Congratulations, you are the winner"
      : winner === "computer"
      ? "Computer wins this round!"
      : "";
  ariaResult.ariaLabel = `${actionMessage} ${winMessage} Click or press enter to play again`;
};

const updateScoreState = (winner) => {
  if (winner === "tie") return;
  winner === "player" ? game.p1Wins() : game.cpWins();
};

const updatePersistentData = (winner) => {
  const store = winner === "computer" ? "cpAllTime" : "p1AllTime";
  const score =
    winner === "computer" ? game.getCpAllTime() : game.getP1AllTime();
  localStorage.setItem(store, score);
};

const updateWinnerMessage = (winner) => {
  if (winner === "tie") return;
  const message = winner === "computer" ? "Computer wins!" : "You Win";
  const p1msg = document.getElementById("p1msg");
  p1msg.textContent = message;
};

const displayComputerChoice = (choice) => {
  const square = document.getElementById("cp_paper");
  createGameImage(choice, square);
};

const askUsersToPlayAgain = () => {
  const playAgain = document.getElementById("playAgain");
  playAgain.classList.toggle("hidden");
  playAgain.focus();
};

const resetBoard = () => {
  const gameSquare = document.querySelectorAll(".gameBoard div");
  gameSquare.forEach((el) => {
    el.className = "gameBoard__square";
  });
  const cpSquares = document.querySelectorAll(
    ".computerBoard .gameBoard__square"
  );
  cpSquares.forEach((el) => {
    if (el.firstElementChild) el.firstElementChild.remove();
    if (el.id === "cp_rock") createGameImage("rock", el);
    if (el.id === "cp_paper") createGameImage("paper", el);
    if (el.id === "cp_scissors") createGameImage("scissors", el);
  });
  document.getElementById("p1msg").textContent = "Player One Chooses...";
  document.getElementById("cpmsg").textContent = "Computer Chooses...";
  const aria = document.getElementById("playAgain");
  aria.ariaLabel = "Player One Chooses";
  document.getElementById("p1msg").focus();
  document.getElementById("playAgain").classList.toggle("hidden");
  game.endGame();
};

const createGameImage = (icon, appendToElement) => {
  const Image = document.createElement("img");
  Image.src = `/img/${icon}.png`;
  Image.alt = "icon";
  appendToElement.append(Image);
};
