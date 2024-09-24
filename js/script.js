const cardColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F1C40F",
  "#8E44AD",
  "#E67E22",
  "#2ECC71",
  "#3498DB",
  "#E74C3C",
  "#95A5A6",
  "#1ABC9C",
  "#9B59B6",
];

let cards = [];
let score = 0;
let difficulty = "easy";
const scoreDisplay = document.getElementById("score");
const gameBoard = document.getElementById("game-board");
const restartButton = document.getElementById("restart");
const rankingList = document.getElementById("ranking-list");

document.getElementById("easy").addEventListener("click", () => {
  difficulty = "easy";
  startGame();
});
document.getElementById("hard").addEventListener("click", () => {
  difficulty = "hard";
  startGame();
});
restartButton.addEventListener("click", () => {
  startGame();
  restartButton.style.display = "none";
});

function generateCards(count) {
  const cardPairs = cardColors.slice(0, count / 2);
  const cards = [...cardPairs, ...cardPairs];
  return cards;
}

function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.innerHTML = `<div style="background-color: ${card};"></div>`;
  cardElement.addEventListener("click", () => flipCard(cardElement));
  return cardElement;
}

let flippedCards = [];
function flipCard(card) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flippedCards.push(card);
    checkForMatch();
  }
}

function checkForMatch() {
  if (flippedCards.length === 2) {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.innerHTML === secondCard.innerHTML) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      score += 10;
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
      }, 1000);
    }
    flippedCards = [];
    scoreDisplay.textContent = `Pontuação: ${score}`;
    checkForWin();
  }
}

function checkForWin() {
  const matchedCards = document.querySelectorAll(".matched");
  if (matchedCards.length === cards.length) {
    alert(`Você ganhou! Pontuação final: ${score}`);
    restartButton.style.display = "block";
    saveRanking(score);
  }
}

function saveRanking(finalScore) {
  const name = prompt("Digite seu nome para o ranking:");
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ name, score: finalScore });
  localStorage.setItem("ranking", JSON.stringify(ranking));
  displayRanking();
}

function displayRanking() {
  rankingList.innerHTML = "";
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.sort((a, b) => b.score - a.score);
  ranking.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    rankingList.appendChild(li);
  });
}

function startGame() {
  const cardCount = difficulty === "easy" ? 16 : 36;
  cards = shuffleCards(generateCards(cardCount));

  gameBoard.innerHTML = "";
  cards.forEach((card) => {
    const cardElement = createCardElement(card);
    gameBoard.appendChild(cardElement);
  });

  gameBoard.className = `game-board ${difficulty}`;
  score = 0;
  scoreDisplay.textContent = `Pontuação: ${score}`;
  restartButton.style.display = "none";
}
