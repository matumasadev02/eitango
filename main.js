fetch(
  "https://script.google.com/macros/s/AKfycbyemSqGzoPqjVaQF2OzTXGfCp9uwsIsqfol_zlytD7Qpu3otU6jpouAJh84edMF_JWv-g/exec"
)
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    return json.words;
  })
  .then((words) => {
    var wordsCount = 0;
    words.forEach((wordSet) => {
      wordsCount += 1;
      var newUlEl = document.createElement("ul");
      var newUl = document
        .getElementById("words-container")
        .appendChild(newUlEl);
      wordSet.forEach((word) => {
        var newLiEl = document.createElement("li");
        var newLi = newUl.appendChild(newLiEl);
        newLi.className = "cover";
        newLi.innerHTML = `<span>${word}</span>`;
        newLi.addEventListener("click", function () {
          this.classList.toggle("cover");
        });
      });
      var checkBtnEl = document.createElement("button");
      checkBtnEl.innerHTML = "覚えた！";
      checkBtnEl.value = wordsCount;
      var newBtn = newUl.appendChild(checkBtnEl);
      newBtn.addEventListener("click", () => {
        newUl.classList.add("hidden");
      });
    });
  })
  .catch((e) => {
    document.getElementById("words-container").innerHTML =
      '<p>An error occurred.</p><p>Your browser may not support fetch. Please use <a href="https://google.com/chrome">Google Chome Browser</a>.</p>';
  });