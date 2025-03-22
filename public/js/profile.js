function toggleEditForm() {
  document.getElementById("editProfileForm").style.display =
    document.getElementById("editProfileForm").style.display === "none"
      ? "block"
      : "none";
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

  // 📌 Show Image in Large Preview Box
  profilePic.addEventListener("click", () => {
    imagePreviewModal.style.display = "block";
  });

  // 📌 Close Image Preview
  closePreview.addEventListener("click", () => {
    imagePreviewModal.style.display = "none";
  });

  // 📌 When User Clicks Pencil Icon, Open File Selector
  document.querySelector(".edit-icon").addEventListener("click", (event) => {
    event.preventDefault();
    fileInput.click();
  });

  // 📌 When File is Selected, Update Profile Picture Preview
  fileInput.addEventListener("change", (event) => {
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
});
