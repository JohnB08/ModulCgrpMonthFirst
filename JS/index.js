import quizObject from "./quizObject.json" assert { type: "json" };

console.log(quizObject);
const sideBar = document.querySelector(".sidebar");
const SideBarContainer = document.querySelector(".sidebarContainer");
const buttons = Object.keys(quizObject);
for (let button of buttons) {
  const btn = document.createElement("button");
  const btnText = document.createTextNode(button);
  btn.appendChild(btnText);
  sideBar.appendChild(btn);
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

const questions = [
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

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  let currentQuestionIndex = 0;
  let score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
  } else {
    selectedBtn.classList.add("incorrect");
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML = "play Again";
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

startQuiz();
