/* Vi brukte import her før. Men import assert: JSON er ikke suporta på alle browsers. Dermed bruker vi fetchQuizObject funksjonen for å fetche data fra JSON objektet. */

/**
 * funksjon for å fetche quizObject fra JSON fil til index.js
 * @param {*} location hvor quizObject er lagret
 * @returns jsonified response
 */
const fetchQuizObject = async (location) => {
  const response = await fetch(location);
  const result = await response.json();
  return result;
};

/* Fetcher quizObjectet fra json fil */
const quizObject = await fetchQuizObject("./JS/quizObject.json");

/**
 * Funksjon som ser om objektet er oppdatert siden sist siden ble lastet inn hos bruker.
 * @returns
 */
const updateChecker = () => {
  if (quizObject.updateKey === JSON.parse(localStorage.getItem("updateKey")))
    return;
  else {
    localStorage.clear();
    localStorage.setItem("updateKey", JSON.stringify(quizObject.updateKey));
  }
};

/* Ser om quizObjektet har blitt oppdatert siden sist. */

updateChecker();

/* Henter elementer fra document. */

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
const hamParts = document.querySelectorAll(".arm");

/* Lager globale variabler som appen jobber med. */

let activeScreen = startPage;
let activeBtns = [];
let activeAnswer = "";
let currentCategory = "General Knowledge";
let menuOpen = false;
let currentCategoryObject = {};

/* Oppdater dette arrayet med andre keys som skal bli ignorert av quiz. */

/* Lager knappene til sidebar, knappene lukker også sidebar. */
const buttons = Object.keys(quizObject.categories);
for (let button of buttons) {
  const btn = document.createElement("button");
  btn.value = button;
  let cleansedButtonText = "";
  if (button.includes("Entertainment:"))
    cleansedButtonText = button.split("Entertainment:").pop();
  else cleansedButtonText = button;
  btn.textContent = cleansedButtonText;
  btn.classList.add("btn", "btnDark", "btnText", "sideBarBtn");
  sideBar.appendChild(btn);
  /* eventlistener til hver knapp. Lukker også sidebar */
  btn.addEventListener("click", () => {
    currentCategory = btn.value;
    resetState();
    closeSideBar();
    fetchQuizElement(currentCategory);
  });
}

/* Lager hamburgermeny knappen som åpner og lukker sidebaren. */
hamburgerMenu.addEventListener("click", () => {
  !menuOpen ? openSideBar() : closeSideBar();
});

/**
 * Funksjon som åpner sidebar og animerer hamburger knapp
 */
function openSideBar() {
  SideBarContainer.style.display = "flex";
  for (let i = 0; i < hamParts.length; i++) {
    hamParts[i].classList.add(`armAnim${i + 1}`);
  }
  menuOpen = true;
}

/**
 * funksjon som lukker sidebar og animerer hamburger knapp
 */
function closeSideBar() {
  SideBarContainer.style.display = "none";
  for (let i = 0; i < hamParts.length; i++) {
    hamParts[i].classList.remove(`armAnim${i + 1}`);
  }
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
 * Ser om score finnes i local storage for gjeldene kategori.
 * @param {*} categoryName
 * @returns
 */
const fetchLocalStorageScore = (categoryName) => {
  let currentScore =
    JSON.parse(localStorage.getItem(`${categoryName}Score`)) || 0;
  return currentScore;
};

/**
 * Ser om index finnes i local storage for gjeldene kategori.
 * @param {*} categoryName
 * @returns
 */
const fetchLocalStorageIndex = (categoryName) => {
  let currentIndex =
    JSON.parse(localStorage.getItem(`${categoryName}Index`)) || 0;
  return currentIndex;
};

/**
 * lagrer scoren for gjeldene kategori i local storage.
 * @param {*} categoryName
 * @param {*} score
 */
const setLocalStorageScore = (categoryName, score) => {
  localStorage.setItem(`${categoryName}Score`, JSON.stringify(score));
};

/**
 * lagrer index for gjeldene kategori i local storage.
 * @param {*} categoryName
 * @param {*} index
 */
const setlocalStorageIndex = (categoryName, index) => {
  localStorage.setItem(`${categoryName}Index`, index);
};

/**
 * Finner spørsmål i kategorien den får inn, velger spørsmål basert på hva som er currentIndex.
 * Lager knapper basert på antal svar til spørsmålet.
 * alt som hentes fra quizObject må sendes til innerHTML for at formateringen fra API skal vises rett. pga unicode encoding.
 * @param {*} categoryName Kategorien som blir sendt inn, string.
 */
const fetchQuizElement = (categoryName) => {
  /* For å gjøre koden mer leslig lagrer vi quizObject i en currentCategoryObject variabel. */
  currentCategoryObject = quizObject.categories[categoryName];
  currentCategoryObject.currentIndex = fetchLocalStorageIndex(categoryName);
  currentCategoryObject.currentScore = fetchLocalStorageScore(categoryName);
  /* Vi bruker innerHTML for at spørsmålene skal dekodes rett. */
  questionTracker.innerHTML = `${currentCategoryObject.currentIndex + 1} of ${
    currentCategoryObject.questionArray.length
  } ${categoryName}`;
  setActiveScreen(questionCard);
  questionElement.innerHTML = `${
    currentCategoryObject.questionArray[currentCategoryObject.currentIndex]
      .question
  }`;
  activeAnswer =
    currentCategoryObject.questionArray[currentCategoryObject.currentIndex]
      .correct_answer;
  currentCategoryObject.questionArray[
    currentCategoryObject.currentIndex
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
    currentCategoryObject.currentScore++;
    setLocalStorageScore(categoryName, currentCategoryObject.currentScore);
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
  nextButton.disabled = false;
  nextButton.style.opacity = "100%";
}

/**
 * Funksjonen som styrer "next" knappen
 * oppdaterer current index i den aktive kategorien, starter fetchQuiz på nytt så lenge det er flere spørsmål igjen.
 * Ellers kjører den showScore funksjon. sender categoryName videre til begge.
 * @param {*} categoryName aktiv kategori
 */
function handleNextButton(categoryName) {
  currentCategoryObject.currentIndex++;
  setlocalStorageIndex(categoryName, currentCategoryObject.currentIndex);
  resetState();
  if (
    currentCategoryObject.currentIndex <
    currentCategoryObject.questionArray.length
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
  nextButton.disabled = true;
  nextButton.style.opacity = "0%";
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
  resetState();
  setActiveScreen(summaryPage);
  scoreOutput.textContent = `${currentCategoryObject.currentScore} of ${currentCategoryObject.questionArray.length}`;
  currentCategoryObject.currentIndex = 0;
  setlocalStorageIndex(categoryName, currentCategoryObject.currentIndex);
  currentCategoryObject.currentScore = 0;
  setLocalStorageScore(categoryName, currentCategoryObject.currentScore);
}

/* Reset knappen starter quizen på nytt uten å skifte kategori. */
resetBtn.addEventListener("click", () => fetchQuizElement(currentCategory));
