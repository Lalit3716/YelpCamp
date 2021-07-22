const titleInput = document.querySelector("#title");
const invalidText = document.querySelector("#title-invalid");

let timer,
  timeoutVal = 500;

function handleKeyUp(e) {
  window.clearTimeout(timer);
  timer = window.setTimeout(async () => {
    const res = await axios.get(`/campgrounds/find/${titleInput.value}`);
    if (res.data.found) {
      titleInput.setAttribute("pattern", `^(?!${titleInput.value}$)`);
      invalidText.innerText = "Title Already Exists!";
    } else if (!res.data.found) {
      titleInput.removeAttribute("pattern");
      invalidText.innerText = "Title Must Be Given!";
    }
  }, timeoutVal);
}

function handleKeyPress(e) {
  window.clearTimeout(timer);
}

titleInput.addEventListener("keypress", handleKeyPress);

titleInput.addEventListener("keyup", handleKeyUp);
