import quizObject from "./quizObject.json" assert { type: "json" };

const hamburgerMenu = document.querySelector(".hamburgermenu");
const sideBar = document.querySelector(".sidebar");
const SideBarContainer = document.querySelector(".sidebarContainer");
const startPage = document.querySelector(".homeScreen");
const questionCard = document.querySelector(".card");
const summaryPage = document.querySelector(".summaryPage");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreOutput = document.querySelector(".scoreOutput");
const resetBtn = document.querySelector("#resetBtn");
const questionTracker = document.querySelector("#questionTracker");
const arm1 = document.querySelector("#arm1");
const arm2 = document.querySelector("#arm2");
const arm3 = document.querySelector("#arm3");

let activeScreen = startPage;
let activeBtns = [];
let activeAnswer = "";
let currentCategory = "";
let menuOpen = false;

/* Lager knappene til sidebar, knappene lukker også sidebar. */
const buttons = Object.keys(quizObject);
for (let button of buttons) {
  const btn = document.createElement("button");
  btn.textContent = button;
  btn.style.width = "90%";
  btn.style.height = "4vh";
  sideBar.appendChild(btn);
  btn.addEventListener("click", () => {
    currentCategory = btn.textContent;
    resetState();
    closeSideBar();
    fetchQuizElement(currentCategory);
  });
}

/* Lager hamburgermeny knappen som åpner og lukker sidebaren. */
hamburgerMenu.addEventListener("click", () => {
  if (menuOpen === false) {
    openSideBar();
  } else {
    closeSideBar();
  }
  console.log("Hamburger button is working.");
});

function openSideBar() {
  SideBarContainer.style.display = "flex";
  arm1.classList.add("armAnim1");
  arm2.classList.add("armAnim2");
  arm3.classList.add("armAnim3");
  menuOpen = true;
}

function closeSideBar() {
  SideBarContainer.style.display = "none";
  arm1.classList.remove("armAnim1");
  arm2.classList.remove("armAnim2");
  arm3.classList.remove("armAnim3");
  menuOpen = false;
}

/**
 * Setter hvilke div som skal vises til en hver tid.
 * @param {*} screenElement hvilket element som skal vises.
 */
const setActiveScreen = (screenElement) => {
  activeScreen.style.display = "none";
  activeScreen = screenElement;
  activeScreen.style.display = "flex";
};

/**
 * Finner spørsmål i kategorien den får inn, velger spørsmål basert på hva som er currentIndex.
 * Lager knapper basert på antal svar til spørsmålet.
 * alt som hentes fra quizObject må sendes til innerHTML for at formateringen fra API skal vises rett. pga unicode encoding.
 * @param {*} categoryName Kategorien som blir sendt inn, string.
 */
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

/**
 * Funksjon som skjekker om knappen som er trykt er rett svar.
 * Hviser evt hva som er rett hvis knappen er feil
 * @param {*} e click event
 * @param {*} categoryName aktive kategorinavnet, får det fra fetchQuizElement
 */
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

/**
 * Funksjonen som styrer "next" knappen
 * oppdaterer current index i den aktive kategorien, starter fetchQuiz på nytt så lenge det er flere spørsmål igjen.
 * Ellers kjører den showScore funksjon. sender categoryName videre til begge.
 * @param {*} categoryName aktiv kategori
 */
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

/**
 * fjerner alle knapper som blir vist dynamisk, setter activeBtns til et tomt array.
 */
function resetState() {
  nextButton.style.display = "none";
  activeBtns.forEach((button) => {
    button.remove();
  });
  activeBtns = [];
}

/**
 * resetter alle dynamiske knapper via resetState, setter summaryPage til element som vises, rekner ut hvor mange poeng du fikk og viser det.
 * setter både currentIndex og currentScore for gjeldene kategori til 0, sånn at kategorien kan spilles på nytt.
 * @param {*} categoryName
 */
function showScore(categoryName) {
  quizObject[categoryName].currentIndex = 0;
  resetState();
  setActiveScreen(summaryPage);
  scoreOutput.textContent = `${quizObject[categoryName].currentScore} of ${quizObject[categoryName].questionArray.length}`;
  quizObject[categoryName].currentScore = 0;
}

/* Reset knappen starter quizen på nytt uten å skifte kategori. */
resetBtn.addEventListener("click", () => fetchQuizElement(currentCategory));
