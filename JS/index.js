import quizObject from "./quizObject.json" assert { type: "json" };

console.log(quizObject);
const sideBar = document.querySelector(".sidebar")
const buttons = Object.keys(quizObject);
for (let button of buttons) {
  const btn = document.createElement("button");
  const btnText = document.createTextNode(button);
  btn.appendChild(btnText);
  sideBar.appendChild(btn);
}
console.log(Object.keys(quizObject));