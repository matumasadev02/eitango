function pushData(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value);
  }
  return true;
}

function getSheetList() {
  fetch(
    "https://script.google.com/macros/s/AKfycbxN6EBW6CNO7P6aIzmHulc6qGLKeNLVRLYHsww-abC_6W_f946m_1YR95LWeGsDpFXdxQ/exec?action=getSheetNames"
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      let sheetNames = json.sheetNames;
      for (let sheetIndex = 0; sheetIndex < sheetNames.length; ++sheetIndex) {
        let selectLink = document.createElement("button");
        selectLink.value = sheetIndex;
        selectLink.innerText = sheetNames[sheetIndex];
        let newSelectLink = document
          .getElementById("select")
          .appendChild(selectLink);
        newSelectLink.addEventListener("click", function () {
          clearWord();
          getWord(this.value);
        });
      }
      hiddenUpdate();
    })
    .catch((e) => {
      document.getElementById("words-container").innerHTML =
        '<p>An error occurred.</p><p>Your browser may not support fetch. Please use <a href="https://google.com/chrome">Google Chome Browser</a>.</p>';
    });
}
function clearWord() {
  document.getElementById("words-container").innerHTML = "";
  hiddenWords = getHidden();
}
function getWord(sheetId) {
  fetch(
    `https://script.google.com/macros/s/AKfycbxN6EBW6CNO7P6aIzmHulc6qGLKeNLVRLYHsww-abC_6W_f946m_1YR95LWeGsDpFXdxQ/exec?action=getSheetById&sheetId=${sheetId}`
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      let words = json.words;
      document.getElementById("name").innerText = json.name;
      for (let wordIndex = 0; wordIndex < words.length; ++wordIndex) {
        var newUlEl = document.createElement("ul"); //ulElを定義
        var newUl = document
          .getElementById("words-container")
          .appendChild(newUlEl); //newUlを定義、ulをHTMLに作成
        for (
          let wordCount = 0;
          wordCount < words[wordIndex].length;
          ++wordCount
        ) {
          //wordSetからwordを取り出す
          var newLiEl = document.createElement("li"); //liElを定義
          var newLi = newUl.appendChild(newLiEl); //newLiを定義、liをHTMLに作成
          newLi.className = "cover";
          newLi.innerHTML = `<span>${json.groups[0][wordCount]}</span><span>${words[wordIndex][wordCount]}</span>`; //liの子要素spanにwordを格納
          newLi.addEventListener("click", function () {
            //addEventListenerでクリックを検出し、coverクラスをtoggle
            this.classList.toggle("cover");
          });
        }
        //checkBtnの実装
        var checkBtnEl = document.createElement("button"); //checkBtnElを定義
        checkBtnEl.innerHTML = "覚えた！"; //innerHTMLで内容を入れる
        var newBtn = newUl.appendChild(checkBtnEl); //newBtnをHTMLに作成
        newBtn.addEventListener("click", () => {
          pushData(hiddenWords, wordIndex);
          console.log(hiddenWords);
          document
            .getElementById("words-container")
            .childNodes[wordIndex].classList.add("hidden");
        });
      }
    })
    .catch((e) => {
      document.getElementById("words-container").innerHTML =
        '<p>An error occurred.</p><p>Your browser may not support fetch. Please use <a href="https://google.com/chrome">Google Chome Browser</a>.</p>';
    });
}
function getHidden() {
  return [];
}
function hiddenUpdate() {
  hiddenWords.forEach((hiddenword) => {
    document
      .getElementById("words-container")
      .childNodes[hiddenword].classList.add("hidden");
  });
  document.cookie = `hiddenWords = ${hiddenWords}`;
}
let hiddenWords = getHidden();
function main() {
  getSheetList();
}
window.onload = main();