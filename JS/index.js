import quizObject from "./quizObject.json" assert { type: "json" };

console.log(quizObject);

let currentCategory = "";

const sideBar = document.querySelector(".sidebar");
const SideBarContainer = document.querySelector(".sidebarContainer");
const buttons = Object.keys(quizObject);
for (let button of buttons) {
  const btn = document.createElement("button");
  btn.textContent = button;
  btn.style.width = "10vh";
  btn.style.height = "4vh";
  sideBar.appendChild(btn);
  btn.addEventListener("click", () => {
    currentCategory = btn.textContent;
    resetState();
    fetchQuizElement(currentCategory);
  });
}
console.log(Object.keys(quizObject));

let menuOpen = false;
const hamburgerMenu = document.createElement("img");
hamburgerMenu.setAttribute("src", "img/hamburger-button.svg");
hamburgerMenu.setAttribute("width", "48");
hamburgerMenu.setAttribute("height", "48");
hamburgerMenu.setAttribute("alt", "test");
hamburgerMenu.classList.add("hamburgermenu");
document.body.appendChild(hamburgerMenu);
hamburgerMenu.addEventListener("click", () => {
  if (menuOpen === false) {
    SideBarContainer.style.display = "flex";
    menuOpen = true;
  } else {
    SideBarContainer.style.display = "none";
    menuOpen = false;
  }
  console.log("Hamburger button is working.");
});

const startPage = document.querySelector(".homeScreen");
const questionCard = document.querySelector(".card");
const summaryPage = document.querySelector(".summaryPage");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreOutput = document.querySelector(".scoreOutput");
const resetBtn = document.querySelector("#resetBtn");
const questionTracker = document.querySelector("#questionTracker");

let activeScreen = startPage;
let activeBtns = [];
let activeAnswer = "";

const setActiveScreen = (screenElement) => {
  activeScreen.style.display = "none";
  activeScreen = screenElement;
  activeScreen.style.display = "flex";
};

const fetchQuizElement = (categoryName) => {
  questionTracker.innerHTML = `${
    quizObject[categoryName].currentIndex + 1
  } of ${quizObject[categoryName].questionArray.length} ${categoryName}`;
  setActiveScreen(questionCard);
  questionElement.innerHTML = `${
    quizObject[categoryName].questionArray[
      quizObject[categoryName].currentIndex
    ].question
  }`;
  activeAnswer =
    quizObject[categoryName].questionArray[
      quizObject[categoryName].currentIndex
    ].correct_answer;
  quizObject[categoryName].questionArray[
    quizObject[categoryName].currentIndex
  ].allAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer;
    button.classList.add("btn", "btnDark", "btnText");
    answerButtons.appendChild(button);
    activeBtns.push(button);
    button.addEventListener("click", (event) =>
      selectAnswer(event, categoryName)
    );
  });
};

function selectAnswer(e, categoryName) {
  const selectedBtn = e.target;
  if (selectedBtn.innerHTML === activeAnswer) {
    selectedBtn.classList.add("correct");
    console.log("correct!");
    quizObject[categoryName].currentScore++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  activeBtns.forEach((button) => {
    button.disabled = true;
    if (button.innerHTML === activeAnswer) {
      button.classList.add("correct");
    }
  });
  nextButton.textContent = "Next";
  nextButton.style.display = "block";
}
function handleNextButton(categoryName) {
  quizObject[categoryName].currentIndex++;
  activeBtns.forEach((button) => {
    button.remove();
  });
  activeBtns = [];
  if (
    quizObject[categoryName].currentIndex <
    quizObject[categoryName].questionArray.length
  ) {
    fetchQuizElement(categoryName);
  } else {
    showScore(categoryName);
  }
}

nextButton.addEventListener("click", () => {
  handleNextButton(currentCategory);
});

function resetState() {
  nextButton.style.display = "none";
  activeBtns.forEach((button) => {
    button.remove();
  });
  activeBtns = [];
}

function showScore(categoryName) {
  quizObject[categoryName].currentIndex = 0;
  resetState();
  setActiveScreen(summaryPage);
  scoreOutput.textContent = `${quizObject[categoryName].currentScore} of ${quizObject[categoryName].questionArray.length}`;
  quizObject[categoryName].currentScore = 0;
}
resetBtn.addEventListener("click", () => fetchQuizElement(currentCategory));
