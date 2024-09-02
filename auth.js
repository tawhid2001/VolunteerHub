document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');

    // Handle registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Create a FormData object to hold the form data
            let formData = new FormData(this);

            // Send the form data via a POST request
            fetch('https://volunteerhub-backend-zlno.onrender.com/api/auth/registration/', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.key) {
                    // Registration successful
                    document.getElementById('registration-result').innerHTML = `<p class="success">Registration successful!</p>`;
                    window.location.href = "login.html";
                } else {
                    // Registration failed
                    let errors = '';
                    for (const [field, errorMessages] of Object.entries(data)) {
                        errors += `<p class="error">${errorMessages.join(', ')}</p>`;
                    }
                    document.getElementById('registration-result').innerHTML = errors;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('registration-result').innerHTML = '<p class="error">There was an error processing your registration.</p>';
            });
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
            };

            fetch("https://volunteerhub-backend-zlno.onrender.com/api/auth/login/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => {
                // Handle successful login, e.g., store token, redirect
                document.getElementById('login-result').innerHTML = '<p class="text-success">Login successful!</p>';
                localStorage.setItem("authToken",data.key);
                localStorage.setItem("username",formData.username);
                // Redirect to dashboard or another page if needed
                window.location.href = 'profile.html';
            })
            .catch(error => {
                document.getElementById('login-result').innerHTML = `<p class="error">${error.message}</p>`;
            });
        });
    }
});


const logout = () => {
    const token = localStorage.getItem('authToken');
  
    // Make a request to the backend logout endpoint
    fetch('https://volunteerhub-backend-zlno.onrender.com/api/auth/logout/', {
      method: 'POST', // Assuming it's a POST request
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      }
    })
    .then(response => {
      if (response.ok) {
        window.localStorage.clear();
        window.location.href = 'login.html';
      } else {
        console.error('Logout failed');
      }
    })
    .catch(error => {
      console.error('Error during logout:', error);
    });
  }
  