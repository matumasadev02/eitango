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
    words.forEach((wordSet) => {
      var newUlEl = document.createElement("ul"); // p要素作成
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
    });
  });
