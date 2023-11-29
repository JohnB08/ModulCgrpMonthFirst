import quizObject from "./quizObject.json" assert { type: "json" };

console.log(quizObject);
const sideBar = document.querySelector(".sidebar");
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
document.body.appendChild(hamburgerMenu);
hamburgerMenu.addEventListener("click", () => {
  if (menuOpen === false) {
    sideBar.style.display = "block";
    menuOpen = true;
  } else {
    sideBar.style.display = "none";
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
