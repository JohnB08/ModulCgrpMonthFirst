//!DENNE KODEN TRENGER IKKE Å KJØRE IGJEN, ER HER KUN FOR Å VISE ARBEIDSMETODE

/* dette er en node package som lar meg skrive til en fil */
const fs = require("fs");

/* Dette er en nodepackage som lar meg sette opp en "schedule" via en cron */
const schedule = require("node-schedule");

/* Dette er en nodepackage som lar meg bruke gitcommands i nodeJS */
const git = require("simple-git");

/* dette er filepathen til quizObject */
const filePath = "./quizObject.json";

/* Starter med å lage et tomt object, dette skal overskrive det som finnes i quizObject allerede. */
const quizObject = {};
quizObject.categories = {};
const key = Math.random() * 10000;
quizObject.updateKey = key.toFixed(8);
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
    quizObject.categories[category.name] = category;
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
  const categories = Object.keys(quizObject.categories);
  let categoryIndex = 0;
  for (let category of categories) {
    await returnPromise(6000);
    categoryIndex++;
    console.log(`fetching category ${categoryIndex}`);
    const questionUrl = `https://opentdb.com/api.php?amount=10&category=${quizObject.categories[category].id}&type=multiple`;
    const fetchedQuestions = await fetchApi(questionUrl);
    quizObject.categories[category].currentIndex = 0;
    quizObject.categories[category].currentScore = 0;
    quizObject.categories[category].questionArray = fetchedQuestions.results;
    for (let answers of quizObject.categories[category].questionArray) {
      answers.allAnswers = answers.incorrect_answers.map((x) => x);
      answers.allAnswers.push(answers.correct_answer);
      answers.allAnswers.sort();
    }
  }
};

/**
 * Funksjon som overskriver det nye objectet inn i quizObject.json via node.js
 * Vi trenger ikke tenke på hva som allerede står, fordi hver gang det kjører vil vi få nye spørsmål fra api, vi vil ikke beholde de gamle.
 */
const writeObject = async () => {
  await getCategories();
  //null er en "replacer", siden vi ikke trenger å replace noe er det null. 2 er "added whitespace", pynting, gjør objectet mye mer leslig både i stringified form, og i JSON filen.
  fs.writeFileSync(filePath, JSON.stringify(quizObject, null, 2));
  console.log("write successfull");
};

/* Scheduler som oppdaterer quizObject hver midnatt. */
schedule.scheduleJob("18 20 * * *", async () => {
  console.log("starting script");
  await writeObject();
  console.log("adding to git commit");
  await git().add([filePath]);
  console.log("commiting change");
  await git().commit("Updating quizObject");
  console.log("pushing change");
  await git().push();
  console.log("push complete");
});
/* Adda mulighet å kjøre scriptet i console via node questionFetcher.js, så lenge man CD til js folder. */
/* Fungerer kun hvis man har node og alle andre packages installert og er checkout til rett repository.
Dette kan potensielt kjøres på en raspberry pi infinitum. Regna litt på det i går, og selv om den oppdaterer quizObject hver natt,
vil vi nå maxsize på github repository om 300 år ish. */
