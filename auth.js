document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');

    // Handle registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function (event) {
            event.preventDefault();
            handleRegistration(new FormData(this));
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
            handleLogin(formData);
        });
    }
});

// Function for handling user registration
function handleRegistration(formData) {
    fetch('http://127.0.0.1:8000/api/auth/registration/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.key) {
            document.getElementById('registration-result').innerHTML = `<p class="success">Registration successful!</p>`;
            window.location.href = "login.html";
        } else {
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
}

// Function for handling user login
function handleLogin(formData) {
    fetch("http://127.0.0.1:8000/api/auth/login/", {
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
        document.getElementById('login-result').innerHTML = '<p class="text-success">Login successful!</p>';
        localStorage.setItem("authToken", data.key);
        localStorage.setItem("username", formData.username);
        window.location.href = 'profile.html';
    })
    .catch(error => {
        document.getElementById('login-result').innerHTML = `<p class="error">${error.message}</p>`;
    });
}

// Function for handling logout
function logout() {
    const token = localStorage.getItem('authToken');

    fetch('http://127.0.0.1:8000/api/auth/logout/', {
        method: 'POST',
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
