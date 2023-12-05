import quizObject from "./quizObject.json" assert { type: "json" };

console.log(quizObject);

let currentCategory = "";

const sideBar = document.querySelector(".sidebar");
const SideBarContainer = document.querySelector(".sidebarContainer");
const buttons = Object.keys(quizObject);
for (let button of buttons) {
  const btn = document.createElement("button");
  btn.textContent = button;
  btn.style.width = "10vh"
  btn.style.height = "4vh";
  sideBar.appendChild(btn);
  btn.addEventListener("click", () => {
    currentCategory = btn.textContent;
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

/* const questions = [
  {
    question: "Who is the best football star in the world?",
    answers: [
      { text: "Lionel Messi", correct: false },
      { text: "Cristiano Ronaldo R7", correct: false },
      { text: "Ronaldo Phenomeno R9", correct: true },
      { text: "Pele Edson", correct: false },
    ],
  },
  {
    question: "The first programming language?",
    answer: [
      { text: "python", correct: false },
      { text: "react", correct: false },
      { text: "javascript", correct: false },
      { Text: "FORTRAN", correct: true },
    ],
  },
  {
    question: "Who discovered the internet?",
    answer: [
      { text: "Bob Khan", correct: false },
      { text: "Vinton Cerf", correct: false },
      { text: "Tim Berners Lee", correct: true },
      { text: "Paul Baran", correct: false },
    ],
  },
  {
    question: "Who discovered America in the 14th century?",
    answer: [
      { text: "Cristoffer Columbus", correct: false },
      { text: "Zheng He", correct: true },
      { text: "Leif Erikson", correct: true },
      { text: "John Alcock", correct: true },
    ],
  },
];
 */
const startPage = document.querySelector(".homeScreen");
const questionCard = document.querySelector(".card");
const summaryPage = document.querySelector(".summaryPage");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreOutput = document.querySelector(".scoreOutput");
const resetBtn = document.querySelector("#resetBtn");

let activeScreen = startPage;
let activeBtns = [];
let activeAnswer = "";

const fetchQuizElement = (categoryName) => {
  activeScreen.style.display = "none";
  activeScreen = questionCard;
  activeScreen.style.display = "flex";
  questionElement.textContent = `${
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
    button.textContent = answer;
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
  if (selectedBtn.textContent === activeAnswer) {
    selectedBtn.classList.add("correct");
    console.log("correct!");
    quizObject[categoryName].currentScore++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  activeBtns.forEach((button) => {
    button.disabled = true;
    if (button.textContent === activeAnswer) {
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

/* function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("btn", "btnDark", "btnText");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  }); */
/* } */

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
  activeScreen.style.display = "none";
  activeScreen = summaryPage;
  activeScreen.style.display = "flex";
  scoreOutput.textContent = `${quizObject[categoryName].currentScore} of ${quizObject[categoryName].questionArray.length}`;
  quizObject[categoryName].currentScore = 0;
}
resetBtn.addEventListener("click", () => fetchQuizElement(currentCategory));
