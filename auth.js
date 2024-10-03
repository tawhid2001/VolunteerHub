document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');

    // Handle registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function (event) {
            event.preventDefault();
            handleRegistration();
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
const handleRegistration = () => {
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;
    if (password1 !== password2) {
        document.getElementById("registration-result").innerHTML = '<p class="text-danger">Passwords do not match!</p>';
        return;
    }
    const formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password1", password1);
    formData.append("password2", password2);
    formData.append("first_name", document.getElementById("first_name").value);
    formData.append("last_name", document.getElementById("last_name").value);
    formData.append("bio", document.getElementById("bio").value);
    formData.append("contact_info", document.getElementById("contact_info").value);

    const profilePicture = document.getElementById("profile_picture").files[0];
    if (profilePicture) {
        formData.append("profile_picture", profilePicture);
    }


    fetch('https://volunteerhub-backend-zlno.onrender.com/api/auth/registration/', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Registration successful:', data);
        // Handle successful registration (e.g., redirect or show a success message)
    })
    .catch(error => {
        console.error('Error during registration:', error);
        // Handle error (e.g., show an error message)
    });
};



// Function for handling user login
function handleLogin(formData) {
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

    fetch('https://volunteerhub-backend-zlno.onrender.com/api/auth/logout/', {
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
