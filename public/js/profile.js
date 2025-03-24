function toggleEditForm() {
  const editForm = document.getElementById("editProfileForm");
  if (editForm) {
    editForm.style.display =
      editForm.style.display === "none" ? "block" : "none";
  }
}

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profilePic").src = e.target.result;
      document.getElementById("uploadBtn").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const profilePic = document.getElementById("profilePic");
  const fileInput = document.getElementById("fileInput");
  const saveBtn = document.getElementById("saveBtn");
  const previewImage = document.getElementById("previewImage");
  const imagePreviewModal = document.getElementById("imagePreviewModal");
  const closePreview = document.querySelector(".close-preview");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const deletePhotoBtn = document.querySelector(".delete-btn");
  const profileButtons = document.querySelector(".profile-buttons");

  if (profilePic && imagePreviewModal) {
    profilePic.addEventListener("click", () => {
      imagePreviewModal.style.display = "block";
      if (profileButtons) profileButtons.style.display = "none"; // Hide buttons
    });
  }

  if (closePreview && imagePreviewModal) {
    closePreview.addEventListener("click", () => {
      imagePreviewModal.style.display = "none";
      if (profileButtons) profileButtons.style.display = "flex"; // Show buttons again
    });
  }

  if (changePhotoBtn && fileInput) {
    changePhotoBtn.addEventListener("click", () => {
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      document
        .querySelectorAll(".toHide")
        .forEach((e) => (e.style.display = "none"));

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
          profilePic.src = e.target.result;
          previewImage.src = e.target.result;
          saveBtn.style.display = "block"; // Show Save Button
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    });
  }
});
