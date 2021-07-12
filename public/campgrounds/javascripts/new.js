const titleInput = document.querySelector("#title");
const invalidText = document.querySelector("#title-invalid");
titleInput.addEventListener("input", async () => {
  const res = await axios.get(
    `http://localhost:3000/campgrounds/find/${titleInput.value}`
  );
  if (res.data.found) {
    titleInput.setAttribute("pattern", `^(?!${titleInput.value}$)`);
    invalidText.innerText = "Title Already Exists!";
  } else if (!res.data.found) {
    titleInput.removeAttribute("pattern");
    invalidText.innerText = "Title Must Be Given!";
  }
});
