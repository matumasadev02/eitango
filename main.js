let data = {
  sheetNames: [],
}
const apiUrl = "https://script.google.com/macros/s/AKfycbzgEkaLJS_lgki6GCRYOBsfmtGpyKPCsFKWyNuGhZLsY8HWg8TjhrsSNFohPN2ZbAXVLg/exec"
async function returnJson(url) {
  try {
    let res = await fetch(url,{method:"GET"});
    let json = await res.json();
    return json;
  }
  catch(e) {
    document.getElementById("error").innerText = "An error occurred. Error:" + e;
    document.getElementById("error").classList.remove("hidden");
    document.getElementById("loading").classList.remove("hidden");
    console.log(e);
  }
}
// get local hidden cards
function getLocalHiddenCards() {
  if (localStorage.getItem("hiddenCards")) {
    let hiddenCards = localStorage.getItem("hiddenCards");
    hiddenCards = JSON.parse(hiddenCards);
    data.hiddenCards = hiddenCards;
  } else {
    data.hiddenCards = {};
    cardsLength = data.sheetNames.length;
    for (let i = 0; i < cardsLength; i++) {
      data.hiddenCards[data.sheetNames[i]] = [];
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
function updateHiddenCards(sheetName) {
  let hiddenCards = () => {
    try {
      let hiddenCards = data.hiddenCards[sheetName];
      return hiddenCards;
    } catch(e) {
      data.hiddenCards[sheetName] = [];
      let hiddenCards = data.hiddenCards[sheetName];
      return hiddenCards;
    }
  }
  let cards = document.querySelectorAll(".card");
  hiddenCards().forEach((hiddenCardIndex) => {
    cards[hiddenCardIndex].classList.add("hidden");
  });
}
async function showSheets() {
  let res = await returnJson(apiUrl + "?action=getSheetNames");
  data.sheetNames = res.sheetNames;
  data.sheetNames.forEach((sheetName,index) => {
    let btnEl = retrunBtn(index,sheetName);
    btnEl.addEventListener("click", () => {
      showSheet(index);
    });
    document.getElementById("sheet-list").appendChild(btnEl);
  });
}

async function showSheet(index) {
  clearCards();
  let sheets = data.sheets;
  let currentSheet = sheets[index];
  let sheetName = data.sheetNames[index];
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
      if (! data.hiddenCards[sheetName].includes(btn.value)) {
        data.hiddenCards[sheetName].push(btn.value);
      }
      localStorage.setItem("hiddenCards",JSON.stringify(data.hiddenCards));
      updateHiddenCards(sheetName);
    });
    card.appendChild(btn);
    document.getElementById("cards-container").appendChild(card);
  });
  updateHiddenCards(sheetName);
}

window.onload = async () => {
  document.getElementById("reset-storage").addEventListener("click",()=>{
    localStorage.clear();
    location.reload();
  });
  data.sheets = await returnJson(apiUrl + "?action=getAllSheets");
  await showSheets();
  document.getElementById("loading").classList.add("hidden");
  getLocalHiddenCards();
}