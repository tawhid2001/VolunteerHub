fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;
    updateNavbarAuthButtons();
  });

function updateNavbarAuthButtons() {
  const authButtons = document.getElementById("auth-buttons");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("authToken");
  const authRequiredItems = document.querySelectorAll(".auth-required");
  const userProfilePicture = localStorage.getItem("dp"); // Assuming you store this

  if (token) {
    authRequiredItems.forEach((item) => (item.style.display = "block"));
    authButtons.innerHTML = `
              <li class="nav-item">
                  <p class="btn"><img id="dp" src="${userProfilePicture}" alt="Profile Picture"><strong>${username}</strong></p>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="profile.html">Profile</a>
              </li>
              <li class="nav-item">
                  <button class="logout-btn" onclick="logout()">Logout</button>
              </li>`;
  } else {
    authRequiredItems.forEach((item) => (item.style.display = "none"));
    authButtons.innerHTML = `
              <li class="nav-item">
                  <a class="nav-link" href="login.html">Login</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="registration.html">Register</a>
              </li>`;
  }
}
