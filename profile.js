document.addEventListener('DOMContentLoaded', function () {
    const authToken = localStorage.getItem("authToken");
    const profileForm = document.getElementById('profile-form');
    const profilePictureInput = document.getElementById('profile-picture-input');
    const updateResult = document.getElementById('update-result');

    // Imgbb API key (replace with your actual key)
    const imgbbApiKey = '74a46b9f674cfe097a70c2c8824668a7';

    // Fetch user details
    function loadUserProfile() {
        fetch("https://volunteer-backend-xi.vercel.app/api/auth/user/", {
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

    // Helper function to upload image to Imgbb
    const uploadToImgbb = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image to Imgbb');
        }

        const data = await response.json();
        return data.data.url; // Return the full URL of the uploaded image
    };

    // Update user profile
    profileForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const formData = new FormData(profileForm);

        try {
            // Check if a new profile picture is selected
            if (profilePictureInput.files.length > 0) {
                const profilePictureUrl = await uploadToImgbb(profilePictureInput.files[0]);
                formData.set('profile_picture', profilePictureUrl); // Set Imgbb URL in form data
            } else {
                formData.delete('profile_picture'); // Remove field if no new picture is selected
            }

            const response = await fetch("https://volunteer-backend-xi.vercel.app/api/auth/user/edit/", {
                method: "PUT",
                headers: {
                    "Authorization": `Token ${authToken}`,
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Error details:', data);
                throw new Error(data.detail || 'Failed to update profile.');
            }

            updateResult.innerHTML = '<p class="success">Profile updated successfully!</p>';
            loadUserProfile(); // Reload profile data after update
        } catch (error) {
            console.error('Error updating profile:', error);
            updateResult.innerHTML = '<p class="error">Error updating profile.</p>';
        }
    });

    // Initial load of user profile data
    loadUserProfile();
});
