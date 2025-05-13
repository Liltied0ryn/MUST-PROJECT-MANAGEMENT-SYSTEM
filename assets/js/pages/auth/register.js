document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const profileUpload = document.getElementById('profileUpload');
  const profilePreview = document.getElementById('profilePreview');
  
  profileUpload.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(event) {
        profilePreview.src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add registration form handling logic here
  });
});