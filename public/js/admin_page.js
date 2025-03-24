function showPopup(
  message,
  bgColor = "grey",
  textColor = "white",
  url = "/admin/1111"
) {
  const popup = document.createElement("div");
  popup.innerText = message;
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.width = "100%";
  popup.style.height = "fit-content";
  popup.style.left = "0";
  popup.style.padding = "10px 20px";
  popup.style.textAlign = "center";
  popup.style.backgroundColor = bgColor;
  popup.style.color = textColor;
  popup.style.zIndex = "1000";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
    window.location.href = url;
  }, 3000);
}

function closePopup() {
  document.getElementById("error-popup").style.display = "none";
  const url = new URL(window.location);
  url.searchParams.delete("error");
  window.history.replaceState({}, document.title, url);
}

document
  .querySelector("#error-popup button")
  .addEventListener("click", closePopup);
