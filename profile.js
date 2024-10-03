document.addEventListener('DOMContentLoaded', function () {
    const authToken = localStorage.getItem("authToken");
    const profileForm = document.getElementById('profile-form');
    const profilePictureInput = document.getElementById('profile-picture-input');
    const updateResult = document.getElementById('update-result');

    // Fetch user details
    function loadUserProfile() {
        fetch("http://127.0.0.1:8000/api/auth/user/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${authToken}`,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user profile.');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('username').value = data.username;
            document.getElementById('first_name').value = data.first_name;
            document.getElementById('last_name').value = data.last_name;
            document.getElementById('email').value = data.email;
            document.getElementById('bio').value = data.profile.bio;
            document.getElementById('contact_info').value = data.profile.contact_info;
            document.getElementById('profile-picture').src = data.profile.profile_picture;
        })
        .catch(error => {
            console.error('Error loading user profile:', error);
        });
    }

    // Update user profile
    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let formData = new FormData(profileForm);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Only append the profile picture if a new file is selected
        if (profilePictureInput.files.length > 0) {
            formData.append('profile_picture', profilePictureInput.files[0]);
        }
        
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }


        fetch("http://127.0.0.1:8000/api/auth/user/edit/", {
            method: "PUT",
            headers: {
                "Authorization": `Token ${authToken}`,
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error details:', data);
                throw new Error(data.detail || 'Failed to update profile.');
            }
            return response.json();
        })
        .then(data => {
            updateResult.innerHTML = '<p class="success">Profile updated successfully!</p>';
            loadUserProfile(); // Reload profile data after update
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            updateResult.innerHTML = '<p class="error">Error updating profile.</p>';
        });
    });

    // Initial load of user profile data
    loadUserProfile();
});
