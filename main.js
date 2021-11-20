let datas = {
  sheetNames: [],
}
const apiUrl = "https://script.google.com/macros/s/AKfycbzgEkaLJS_lgki6GCRYOBsfmtGpyKPCsFKWyNuGhZLsY8HWg8TjhrsSNFohPN2ZbAXVLg/exec"
async function returnJson(url) {
  let res = await fetch(url);
  let json = await res.json();
  return json;
}
// get local hidden cards
function getLocalHiddenCards() {
  if (localStorage.getItem("hiddenCards")) {
    let hiddenCards = localStorage.getItem("hiddenCards");
    hiddenCards = JSON.parse(hiddenCards);
    datas.hiddenCards = hiddenCards;
  } else {
    datas.hiddenCards = {};
    cardsLength = datas.sheetNames.length;
    for (let i = 0; i < cardsLength; i++) {
      datas.hiddenCards[i] = [];
    }
  }
}
// return button element
function retrunBtn(value,text) {
  let btn = document.createElement("button");
  btn.setAttribute("value", value);
  btn.innerHTML = text;
  return btn;
}
// return wordset element
function returnWordSet(group,word) {
  let wordSet = document.createElement("ul");
  wordSet.setAttribute("class","word-set");
  let groupEl = document.createElement("li");
  groupEl.innerHTML = group;
  let wordEl = document.createElement("li");
  wordEl.classList.add("cover");
  wordEl.addEventListener("click",()=>{
    wordEl.classList.toggle("cover");
  })
  wordEl.innerHTML = word;
  wordSet.appendChild(groupEl);
  wordSet.appendChild(wordEl);
  return wordSet;
}
// rerurn card element
function returnCard(){
  let card = document.createElement("div");
  card.setAttribute("class","card");
  return card;
}
// clear cards-container
function clearCards() {
  let cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = "";
}
// update hidden cards
function updateHiddenCards(sheetIndex) {
  let hiddenCards = datas.hiddenCards[sheetIndex];
  let cards = document.querySelectorAll(".card");
  hiddenCards.forEach((hiddenCardIndex) => {
    cards[hiddenCardIndex].classList.add("hidden");
  });
}
async function showSheets() {
  let res = await returnJson(apiUrl + "?action=getSheetNames");
  datas.sheetNames = res.sheetNames;
  datas.sheetNames.forEach((sheetName,index) => {
    let btnEl = retrunBtn(index,sheetName);
    btnEl.addEventListener("click", () => {
      showSheet(index);
    });
    document.getElementById("sheet-list").appendChild(btnEl);
  });
}

async function showSheet(index) {
  clearCards();
  let sheets = datas.sheets;
  let currentSheet = sheets[index];
  let sheetName = datas.sheetNames[index];
  document.getElementById("sheet-name").innerHTML = sheetName;
  let groups = currentSheet.groups[0];
  let words = currentSheet.words;
  words.forEach((wordList,cardIndex) => {
    let card = returnCard();
    wordList.forEach((word,wordIndex) => {
      let wordSet = returnWordSet(groups[wordIndex],word);
      card.appendChild(wordSet);
    });
    let btn = retrunBtn(cardIndex,"覚えた!");
    btn.addEventListener("click",()=>{
      let sheetIndex = index;
      if (! datas.hiddenCards[sheetIndex].includes(btn.value)) {
        datas.hiddenCards[sheetIndex].push(btn.value);
      }
      localStorage.setItem("hiddenCards",JSON.stringify(datas.hiddenCards));
      updateHiddenCards(sheetIndex);
    });
    card.appendChild(btn);
    document.getElementById("cards-container").appendChild(card);
  });
  updateHiddenCards(index);
}
function updateCards(currentSheet) {
  let cards = document.querySelectorAll(".card");
}
window.onload = async () => {
  document.getElementById("reset-storage").addEventListener("click",()=>{
    localStorage.clear();
    location.reload();
  })
  datas.sheets = await returnJson(apiUrl + "?action=getAllSheets");
  await showSheets();
  document.getElementById("loading").classList.add("hidden");
  getLocalHiddenCards();
}