const getVolunteerWorkList = () => {
  fetch("http://127.0.0.1:8000/api/volunteer-work/")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network Response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      displayVolunteerWork(data);
    });
};

function displayVolunteerWork(volunteerWorks) {
  const listContainer = document.getElementById("volunteer-work-list");
  listContainer.innerHTML = "";

  if (volunteerWorks.length === 0) {
    listContainer.innerHTML = '<p class="error">No volunteer work found.</p>';
    return;
  }

  volunteerWorks.forEach((work) => {
    const card = document.createElement("div");
    card.className = "col-lg-4 col-md-6 mb-4";
    const imageUrl = work.image_url ? work.image_url : "./image/default_image.jpg";
    card.innerHTML = `
                <div class="card h-100">
                    <div class="card-header bg-info text-white text-center py-4">
                    <h2 class="card-title">${work.title}</h2>
                    </div>
                    <div class="card-body">
                        <img src="${imageUrl}" alt="${work.title}" class="card-img-top mb-3" />
                        <p class="card-text"><strong>Description:</strong> ${
                          work.description
                        }</p>
                        <p class="card-text"><strong>Location:</strong> ${
                          work.location
                        }</p>
                        <p class="card-text"><strong>Date:</strong> ${new Date(
                          work.date
                        ).toLocaleDateString()}</p>
                        <p class="card-text"><strong>Organizer:</strong> ${
                          work.organizer
                        }</p>
                        <p class="card-text"><strong>Average Rating:</strong> ${
                          work.average_rating || "No ratings yet"
                        }</p>
                        <a href= "./volunteer_details.html?id=${
                          work.id
                        }" class= "btn-details">Details</a>
                    </div>
                </div>
            `;

    listContainer.appendChild(card);
  });
}

const loadCategories = () => {
  const token = localStorage.getItem("authToken");
  fetch("http://127.0.0.1:8000/api/category-list/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((res) => res.json())
    .then((categories) => {
      console.log(categories);
      if (document.getElementById("category")) {
        const categorySelect = document.getElementById("category");
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id; // Assuming `id` is the primary key for Category
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      } else {
        categories.forEach((category) => {
          const parent = document.getElementById("drop-category");
          const li = document.createElement("li");
          li.classList.add("dropdown-item");
          li.innerHTML = `
                      <li onclick="loadWorkByCategory('${category.slug}')">${category.name}</li>
                  `;
          parent.appendChild(li);
        });
      }
    })
    .catch((error) => console.error("Error fetching categories:", error));
};

const organize = (event) => {
  event.preventDefault();

  const form = document.getElementById("volunteerWorkForm");
  const formData = new FormData(form);

  // Upload the image to ImgBB first
  const imageFile = formData.get('image');
  let imageUrl = '';

  if (imageFile) {
      const imgFormData = new FormData();
      imgFormData.append('image', imageFile);

      fetch('https://api.imgbb.com/1/upload?key=3e434ad625e7ba0c3ac007ba97cfdedf', {
          method: 'POST',
          body: imgFormData
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Image upload failed');
          }
          return response.json();
      })
      .then(imgbbData => {
          if (imgbbData.status === 200) {
              imageUrl = imgbbData.data.url;
              proceedToOrganize(); // Proceed to organize volunteer work after image upload
          } else {
              alert('Image upload failed!');
          }
      })
      .catch(error => {
          console.error('Error uploading to Imgbb:', error);
          alert('Image upload failed!');
      });
  } else {
      // No image, proceed to organize directly
      proceedToOrganize();
  }

  function proceedToOrganize() {
      // Prepare the data to be sent to the backend
      const volunteerData = {
          title: formData.get("title"),
          description: formData.get("description"),
          location: formData.get("location"),
          date: formData.get("date"),
          category: formData.get("category"),
          image_url: imageUrl // Use the URL from Imgbb if available
      };

      const token = localStorage.getItem("authToken");

      fetch("http://127.0.0.1:8000/api/volunteer-work/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json", // Using JSON as we're now sending JSON data
              "Authorization": `Token ${token}` // Fixed token format
          },
          body: JSON.stringify(volunteerData) // Convert data to JSON
      })
      .then(response => {
          if (response.ok) {
              return response.json();
          } else {
              return response.json().then(errorData => {
                  throw new Error(errorData.detail || 'Failed to organize volunteer work!');
              });
          }
      })
      .then(data => {
          // Redirect on success
          window.location.href = "./index.html";
      })
      .catch(error => {
          console.error('Error organizing volunteer work:', error);
          alert('Failed to organize volunteer work: ' + error.message);
      });
  }
};



const loadWorkByCategory = (search) => {
  const token = localStorage.getItem("authToken");
  fetch(`http://127.0.0.1:8000/api/list/${search}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((res) => res.json())
    .then((works) => {
      displayVolunteerWork(works);
    });
};

loadCategories();

const getMyVolunteerWorkList = () => {
  fetch("http://127.0.0.1:8000/api/my-works/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("authToken")}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network Response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      displayVolunteerWork(data);
    });
};

const getMyParticipatedVolunteerWorkList = () => {
  fetch("http://127.0.0.1:8000/api/participated/", {
    headers: {
      Authorization: `Token ${localStorage.getItem("authToken")}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network Response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      displayVolunteerWork(data);
    });
};

const getUserDetail = () => {
  // Fetch user details using the token
  fetch("http://127.0.0.1:8000/api/auth/user/", {
    method: "GET",
    headers: {
      Authorization: `Token ${localStorage.getItem("authToken")}`,
    },
  })
    .then((response) => response.json())
    .then((userData) => {
      console.log("User details:", userData);
      localStorage.setItem("dp", userData.profile.profile_picture);
    });
};

getUserDetail();



