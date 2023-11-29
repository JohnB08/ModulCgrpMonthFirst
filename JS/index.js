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

let menuOpen = false
const hamburgerMenu = document.createElement("img");
hamburgerMenu.setAttribute("src", "img/hamburger-button.svg");
hamburgerMenu.setAttribute("width", "48");
hamburgerMenu.setAttribute("height", "48");
hamburgerMenu.setAttribute("alt", "test");
document.body.appendChild(hamburgerMenu);
hamburgerMenu.addEventListener("click", () => {
    if (menuOpen === false){
    sideBar.style.display = "block";
    menuOpen = true
    }else{
        sideBar.style.display = "none"
        menuOpen = false
    }
  console.log("Hamburger button is working.");
});