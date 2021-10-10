function getSheetList() {
  fetch(
    "https://script.google.com/macros/s/AKfycbxN6EBW6CNO7P6aIzmHulc6qGLKeNLVRLYHsww-abC_6W_f946m_1YR95LWeGsDpFXdxQ/exec?action=getSheetNames"
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      let sheetNames = json.sheetNames;
      console.log(sheetNames);
      let namesCount = 0;
      sheetNames.forEach((sheetName) => {
        let selectLink = document.createElement("button");
        selectLink.value = namesCount;
        selectLink.innerText = sheetName;
        let newSelectLink = document
          .getElementById("select")
          .appendChild(selectLink);
        newSelectLink.addEventListener("click", function () {
          clearWord();
          getWord(this.value);
        });
        namesCount += 1;
      });
    });
}
function clearWord() {
  document.getElementById("words-container").innerHTML = "";
}
function getWord(sheetId) {
  fetch(
    `https://script.google.com/macros/s/AKfycbxN6EBW6CNO7P6aIzmHulc6qGLKeNLVRLYHsww-abC_6W_f946m_1YR95LWeGsDpFXdxQ/exec?action=getSheetById&sheetId=${sheetId}`
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      document.getElementById("name").innerText = json.name;
      json.words.forEach((wordSet) => {
        var newUlEl = document.createElement("ul"); //ulElを定義
        var newUl = document
          .getElementById("words-container")
          .appendChild(newUlEl); //newUlを定義、ulをHTMLに作成
        var wordCount = 0;
        wordSet.forEach((word) => {
          //wordSetからwordを取り出す
          var newLiEl = document.createElement("li"); //liElを定義
          var newLi = newUl.appendChild(newLiEl); //newLiを定義、liをHTMLに作成
          newLi.className = "cover";
          newLi.innerHTML = `<span>${json.groups[0][wordCount]}</span><span>${word}</span>`; //liの子要素spanにwordを格納
          newLi.addEventListener("click", function () {
            //addEventListenerでクリックを検出し、coverクラスをtoggle
            this.classList.toggle("cover");
          });
          wordCount += 1;
        });
        //checkBtnの実装
        var checkBtnEl = document.createElement("button"); //checkBtnElを定義
        checkBtnEl.innerHTML = "覚えた！"; //innerHTMLで内容を入れる
        var newBtn = newUl.appendChild(checkBtnEl); //newBtnをHTMLに作成
        newBtn.addEventListener("click", () => {
          //addEventListenerでクリックを検出し、hiddenクラスをadd
          newUl.classList.add("hidden");
        });
      });
      // }
    })
    .catch((e) => {
      document.getElementById("words-container").innerHTML =
        '<p>An error occurred.</p><p>Your browser may not support fetch. Please use <a href="https://google.com/chrome">Google Chome Browser</a>.</p>';
    });
}