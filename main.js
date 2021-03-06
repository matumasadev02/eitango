let data = {
  sheetNames: [],
  cards: {}
}
const apiUrl = "https://script.google.com/macros/s/AKfycbzgEkaLJS_lgki6GCRYOBsfmtGpyKPCsFKWyNuGhZLsY8HWg8TjhrsSNFohPN2ZbAXVLg/exec"

//get json from url
async function returnJson(url) {
  try {
    let res = await fetch(url, { method: "GET" });
    let json = await res.json();
    return json;
  }
  catch (e) {
    document.getElementById("error").innerText = "An error occurred. Error:" + e;
    document.getElementById("error").classList.remove("hidden");
    document.getElementById("loading").classList.remove("hidden");
    console.log(e);
  }
}

// show buttons for sheets
async function showSheets() {
  let res = await returnJson(apiUrl + "?action=getSheetNames");
  data.sheetNames = res.sheetNames;
  data.sheetNames.forEach((sheetName, sheetIndex) => {
    let btnEl = retrunBtn(sheetIndex, sheetName);
    btnEl.addEventListener("click", () => {
      render(sheetIndex);
    });
    document.getElementById("sheet-list").appendChild(btnEl);
  });
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

// set data.hiddenCards to localStorage
function setHiddenCards() {
  localStorage.setItem("hiddenCards", JSON.stringify(data.hiddenCards));
}

// clear cards-container
function clearCards() {
  let cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = "";
}

// return button element
function retrunBtn(value, text) {
  let btn = document.createElement("button");
  btn.setAttribute("value", value);
  btn.innerHTML = text;
  return btn;
}
// return wordset element
function returnWordSet(group, word) {
  let wordSet = document.createElement("ul");
  wordSet.setAttribute("class", "word-set");
  let groupEl = document.createElement("li");
  groupEl.innerHTML = group;
  let wordEl = document.createElement("li");
  wordEl.classList.add("cover");
  wordEl.addEventListener("click", () => {
    wordEl.classList.toggle("cover");
  })
  wordEl.innerHTML = word;
  wordSet.appendChild(groupEl);
  wordSet.appendChild(wordEl);
  return wordSet;
}

// update hidden cards
function updateHiddenCards(sheetName) {
  let hiddenCards = () => {
    try {
      let hiddenCards = data.hiddenCards[sheetName];
      return hiddenCards;
    } catch (e) {
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

// return card elements list
async function getCards(sheetIndex) {
  let currentSheetName = data.sheetNames[sheetIndex];
  if (data.cards[data.sheetNames[sheetIndex]]) {
    return data.cards[currentSheetName];
  } else {
    let currentSheet = await returnJson(apiUrl + "?action=getSheetById&sheetId=" + sheetIndex);
    let groups = currentSheet.groups[0];
    let wordSets = currentSheet.words;
    let cardElenents = [];
    wordSets.forEach((wordSet, cardIndex) => {
      let cardEl = document.createElement("div");
      cardEl.classList.add("card");
      wordSet.forEach((word, wordIndex) => {
        let wordSetEl = returnWordSet(groups[wordIndex], word);
        cardEl.appendChild(wordSetEl);
      });
      let hiddenBtn = retrunBtn(cardIndex, "????????????");
      cardEl.appendChild(hiddenBtn);
      hiddenBtn.addEventListener("click", () => {
        if (!data.hiddenCards[currentSheetName].includes(cardIndex)) {
          data.hiddenCards[currentSheetName].push(cardIndex);
        }
        setHiddenCards();
        updateHiddenCards(currentSheetName);
      });
      cardElenents.push(cardEl);
    });
    data.cards[currentSheetName] = cardElenents;
    return cardElenents;
  }
}

// show cards
async function render(sheetIndex) {
  clearCards();
  document.getElementById("loading").classList.remove("hidden");
  let cards = await getCards(sheetIndex).catch(e => {
    document.getElementById("error").innerText = "An error occurred. Error:" + e;
  });
  cards.forEach(card => {
    document.getElementById("cards-container").appendChild(card);
  });
  document.getElementById("sheet-name").innerText = data.sheetNames[sheetIndex];
  updateHiddenCards(data.sheetNames[sheetIndex]);
  document.getElementById("loading").classList.add("hidden");
}

window.onload = async () => {
  document.getElementById("menu-toggler").addEventListener("click", () => {
    document.getElementById("popup").classList.remove("hidden");
  });
  document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("popup").classList.add("hidden");
  });
  document.getElementById("clear-data").addEventListener("click", () => {
    if (confirm("??????????????????????????????????????????????????????")) {
      localStorage.clear();
      location.reload();
    }
  });
  document.getElementById("export-data").addEventListener("click", () => {
    try {
      const data = localStorage.getItem("hiddenCards").toString();
      console.log(data)
      const fileName = "eitango.json";
      const link = document.createElement("a");
      link.href = "data:application/json," + encodeURIComponent(data);
      link.download = fileName;
      link.click();
    }
    catch (e) {
      alert(e)
    }
  });
  document.getElementById("import-data").addEventListener("click", () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.addEventListener("change", e => {
        var result = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(result);
        reader.addEventListener("load", () => {
          data = JSON.parse(reader.result);
          localStorage.setItem("hiddenCards", JSON.stringify(data));
          alert("????????????????????????")
        });
        location.reload()
      });
      input.click();
    }
    catch (e) {
      alert(e)
    }
  });
  await showSheets();
  document.getElementById("loading").classList.add("hidden");
  getLocalHiddenCards();
};