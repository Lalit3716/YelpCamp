const titleInput = document.querySelector("#title");
const invalidText = document.querySelector("#title-invalid");
const form = document.querySelector("form");
const existingImages = document.querySelectorAll(".deleteImages label");
const fileInput = document.querySelector("#formFileMultiple");
const invalidImgText = document.querySelector(".invalid-img-qty");

let timer,
  timeoutVal = 500;

const handleKeyUp = () => {
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
};

const handleKeyPress = () => {
  window.clearTimeout(timer);
};

titleInput.addEventListener("keypress", handleKeyPress);

titleInput.addEventListener("keyup", handleKeyUp);

form.addEventListener("submit", e => {
  fileInput.removeAttribute("style");
  if (fileInput.files.length > 3 - existingImages.length) {
    e.preventDefault();
    fileInput.style.borderColor = "#dc3545";
    fileInput.style.backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")`;
    invalidImgText.classList.remove("d-none");
  } else {
    invalidImgText.classList.add("d-none");
  }
});

fileInput.addEventListener("input", () => {
  fileInput.removeAttribute("style");
  if (fileInput.files.length > 3 - existingImages.length) {
    fileInput.style.borderColor = "#dc3545";
    fileInput.style.background = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e") no-repeat`;
    fileInput.style.backgroundPosition = `right calc(.375em + .1875rem) center`;
    fileInput.style.backgroundSize = `calc(.75em + .375rem) calc(.75em + .375rem)`;
    invalidImgText.classList.remove("d-none");
  } else {
    fileInput.style.borderColor = "#198754";
    fileInput.style.background = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e") no-repeat`;
    fileInput.style.backgroundPosition = `right calc(.375em + .1875rem) center`;
    fileInput.style.backgroundSize = `calc(.75em + .375rem) calc(.75em + .375rem)`;
    invalidImgText.classList.add("d-none");
  }
});
