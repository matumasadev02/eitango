fetch(
  "https://script.google.com/macros/s/AKfycbzL6ucRKn-e-r1CSDF_vNRVZ_xNyXHUtshutYqTJvS1XBinp_CbuLv6mtaJZCLkPvbEbg/exec"
)
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    var wordsCount = 0;
    json.words.forEach((wordSet) => {
      wordsCount += 1; //何番目か
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
      checkBtnEl.value = wordsCount; //hiddenをつけるul要素が何番目かをvalueに入れる
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
