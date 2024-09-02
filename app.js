const getVolunteerWorkList = () => {
  fetch("https://volunteerhub-backend-zlno.onrender.com/api/volunteer-work/")
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
    card.className = "col-md-6 mb-4";

    card.innerHTML = `
                <div class="card h-100">
                    <div class="card-header bg-info text-white text-center py-4">
                    <h2 class="card-title">${work.title}</h2>
                    </div>
                    <div class="card-body bg-card">
                        <img src="${work.image}" alt="${work.title}" class="card-img-top mb-3" />
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
                        }" class= "btn btn-primary">Details</a>
                    </div>
                </div>
            `;

    listContainer.appendChild(card);
  });
}

const loadCategories = () => {
  const token = localStorage.getItem("authToken");
  fetch("https://volunteerhub-backend-zlno.onrender.com/api/category-list/", {
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

const orgainze = () => {
  document
    .getElementById("volunteerWorkForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission

      const token = localStorage.getItem("authToken");
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const location = document.getElementById("location").value;
      const date = document.getElementById("date").value;
      const category = document.getElementById("category").value;
      const image = document.getElementById("image").files[0]; // Get the image file

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("date", date);
      formData.append("category", category);
      if (image) formData.append("image", image); // Append the image file if selected

      fetch("https://volunteerhub-backend-zlno.onrender.com/api/volunteer-work/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      })
        .then((response) =>
          response
            .json()
            .then((data) => ({ status: response.status, body: data }))
        )
        .then((data) => {
          if (data.status === 201) {
            window.location.href = "./index.html";
          } else {
            alert("Error: " + data.body.detail); // Show error message from the API
          }
        })
        .catch((error) =>
          console.error("Error organizing volunteer work:", error)
        );
    });
};


const loadWorkByCategory = (search) => {
  const token = localStorage.getItem("authToken");
  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/list/${search}/`, {
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
  fetch("https://volunteerhub-backend-zlno.onrender.com/api/my-works/", {
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
  fetch("https://volunteerhub-backend-zlno.onrender.com/api/participated/", {
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
  fetch("https://volunteerhub-backend-zlno.onrender.com/api/auth/user/", {
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



