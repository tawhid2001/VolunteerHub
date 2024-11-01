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
const handleRegistration = async () => {
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;

    if (password1 !== password2) {
        document.getElementById("registration-result").innerHTML = '<p class="error">Passwords do not match!</p>';
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

    try {
        if (profilePicture) {
            const profilePictureUrl = await uploadToImgbb(profilePicture);
            formData.append("profile_picture", profilePictureUrl);
        }

        const response = await fetch('https://volunteer-backend-xi.vercel.app/api/auth/registration/', {
            method: 'POST',
            body: formData,
        });

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            const text = await response.text(); // Get the raw text response
            throw new Error(`Server error: ${text}`);
        } else if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log('Registration successful:', data);
            window.location.href = "./login.html";
        } else {
            console.error("Unexpected response format: Not JSON");
            throw new Error("Unexpected response format: Not JSON");
        }
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById("registration-result").innerHTML = `<p class="error">${error.message || 'An error occurred during registration.'}</p>`;
    }
};


// Helper function to upload image to Imgbb
const uploadToImgbb = async (file) => {
    const imgbbApiKey = '74a46b9f674cfe097a70c2c8824668a7'; // Replace with your Imgbb API key
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image to Imgbb');
        }

        const data = await response.json();
        return data.data.url; // Return the full image URL from Imgbb
    } catch (error) {
        console.error('Error uploading image to Imgbb:', error);
        throw error;
    }
};



// Function for handling user login
function handleLogin(formData) {
    fetch("https://volunteer-backend-xi.vercel.app/api/auth/login/", {
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

    fetch('https://volunteer-backend-xi.vercel.app/api/auth/logout/', {
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
