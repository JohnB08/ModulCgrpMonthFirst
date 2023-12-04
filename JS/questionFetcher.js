//!DENNE KODEN TRENGER IKKE Å KJØRE IGJEN, ER HER KUN FOR Å VISE ARBEIDSMETODE
const fs = require("fs");
const filePath = "./quizObject.json";
const quizObject = {};
//URL for å finne alle categoriene fra openTDB
const triviaUrl = "https://opentdb.com/api_category.php";

//lager et tomt quizObject

/**
 * funksjon for å fetche api basert på URL
 * @param {*} url url til api
 * @returns jsonified response
 */
const fetchApi = async (url) => {
  const response = await fetch(url);
  const result = response.json();
  return result;
};

/**
 * lager et returnPromise basert på en timeout
 * @param {*} timer tiden til promise er returned
 * @returns resolved promise
 */
const returnPromise = async (timer) => {
  const returnPromise = new Promise((response) => {
    setTimeout(response, timer);
  });
  return returnPromise;
};

/**
 * Fetcher først categories fra triviaUrl via fetchApi(triviaUrl)
 *
 * Setter hver kategori som sin egen key i quizObject
 *
 * fetcher getQuestions basert på API
 *
 * stringifier quizObject så det kan lagres i en json fil
 *
 */
const getCategories = async () => {
  const fetchedCategoryObject = await fetchApi(triviaUrl);
  const categories = fetchedCategoryObject.trivia_categories;
  for (let category of categories) {
    quizObject[category.name] = category;
  }
  await getQuestions();
};

/**
 * fetcher questions basert på category ID
 *
 * pga hver IP kun kan fetche fra api hvert 5 sec har eg en timer på 6 sec før koden kjøres.
 *
 * lagrer questions i questionArray til categorien.
 */
const getQuestions = async () => {
  const categories = Object.keys(quizObject);
  for (let category of categories) {
    await returnPromise(6000);
    const questionUrl = `https://opentdb.com/api.php?amount=10&category=${quizObject[category].id}&type=multiple`;
    const fetchedQuestions = await fetchApi(questionUrl);
    quizObject[category].currentIndex = 0;
    quizObject[category].currentScore = 0;
    quizObject[category].questionArray = fetchedQuestions.results;
    for (let answers of quizObject[category].questionArray) {
      answers.allAnswers = answers.incorrect_answers.map((x) => x);
      answers.allAnswers.push(answers.correct_answer);
      answers.allAnswers.sort();
    }
  }
};

/**
 * Funksjon som skriver det nye objectet inn i quizObject.json via node.js
 */
const writeObject = async () => {
  await getCategories();
  fs.writeFileSync(filePath, JSON.stringify(quizObject, null, 2));
  console.log("write successfull");
};

writeObject();

/* Adda mulighet å kjøre scriptet i console via node questionFetcher.js, så lenge man CD til js folder. */
/* Fungerer kun hvis man har node installert. */
