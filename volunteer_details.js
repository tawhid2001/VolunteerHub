const getQueryParams = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const getWorkName = (workId) =>{
  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/volunteer-work/${workId}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((res) => res.json())
    .then((work) => {
      return work.title;
    })
}

const getDetail = () => {
    const workId = getQueryParams("id");
    const token = localStorage.getItem("authToken");
    const currentUsername = localStorage.getItem("username"); // Assuming you store the username in localStorage
  
    fetch(`https://volunteerhub-backend-zlno.onrender.com/api/volunteer-work/${workId}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((work) => {
        console.log(work);
        localStorage.setItem("organizer",work.organizer);
        const volunteerWork = document.getElementById("volunteer-detail");
  
        // Fetch participant details
        const participantPromises = work.participants.map((participantId) =>
          fetch(`https://volunteerhub-backend-zlno.onrender.com/api/users/${participantId}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          }).then((response) => response.json())
        );
  
        // Fetch join requests if the current user is the organizer
        const joinRequestPromise = currentUsername === work.organizer
          ? fetch(`https://volunteerhub-backend-zlno.onrender.com/api/join-requests/`, {
              headers: {
                Authorization: `Token ${token}`,
              },
            }).then((response) => response.json())
          : Promise.resolve([]);
  
        // Wait for both participants and join requests to be fetched
        Promise.all([Promise.all(participantPromises), joinRequestPromise])
          .then(([participants, joinRequests]) => {
            const isParticipant = participants.some(
              (participant) => participant.username === currentUsername
            );
  
            let joinRequestsHTML = "";
            if (currentUsername === work.organizer) {
              joinRequestsHTML = `
                <h3 class="mt-4">Join Requests</h3>
                <ul class="list-group">
                  ${
                    joinRequests.length > 0
                      ? joinRequests
                          .map(
                            (request) => 
                              
                              `
                    <li class="list-group-item">
                      <strong>User: </strong> ${request.user}<br>
                      <strong>Status:</strong> ${request.status}<br>
                      <strong>Work:</strong> ${request.volunteer_work_title} <br>
                      ${
                        request.status === "pending"
                          ? `
                        <button class="btn btn-success btn-sm mt-2" onclick="approveRequest(${request.id})">Approve</button>
                        <button class="btn btn-danger btn-sm mt-2" onclick="rejectRequest(${request.id})">Reject</button>
                      `
                          : ""
                      }
                    </li>
                  `
                          )
                          .join("")
                      : '<li class="list-group-item">No join requests.</li>'
                  }
                </ul>
              `;
            }
            const imageUrl = work.image_url ? work.image_url : "./image/default_image.jpg";
            volunteerWork.innerHTML = `
            <div class="card-header bg-info text-white text-center py-4">
            <h2 class="display-4">${work.title}</h2>
            </div>
            <div class="card-body bg-card p-5">
            <img src="${imageUrl}" alt="${work.title}"  class="card-img-top mb-3" />
                  <p class="card-text lead"><strong>Description:</strong> ${
                    work.description
                  }</p>
                  <p class="card-text"><strong>Date:</strong> ${new Date(
                    work.date
                  ).toLocaleDateString()}</p>
                  <p class="card-text"><strong>Location:</strong> ${
                    work.location
                  }</p>
                  <p class="card-text"><strong>Organizer:</strong> ${
                    work.organizer
                  }</p>
  
                  <h3 class="mt-4">Participants ${participants.length}</h3>
                  <ul class="list-group">
                      ${
                        participants.length > 0
                          ? participants
                              .map(
                                (participant) => `
                          <li class="list-group-item">
                              <strong><img class="dp" src="${participant.profile.profile_picture}">:</strong> ${participant.username}<br>
                          </li>
                      `
                              )
                              .join("")
                          : '<li class="list-group-item">No participants yet.</li>'
                      }
                  </ul>
  
                  ${
                    !isParticipant && currentUsername !== work.organizer
                      ? `<button class="btn btn-primary mt-4" onclick="requestJoin(${workId})">Join</button>`
                      : ""
                  }
  
                  ${joinRequestsHTML}
              </div>
            `;
          })
          .catch((error) => {
            console.error("Error fetching participant details:", error);
            // Display the work details even if there is an error
            volunteerWork.innerHTML = `
            <div class="card-header bg-info text-white text-center py-4">
            <h2 class="display-4">${work.title}</h2>
            </div>
            <div class="card-body bg-card p-5">
            <img src="${imageUrl}" alt="${work.title}" class="card-img-top mb-3" />
                    <p class="card-text lead"><strong>Description:</strong> ${work.description}</p>
                    <p class="card-text"><strong>Date:</strong> ${new Date(work.date).toLocaleDateString()}</p>
                    <p class="card-text"><strong>Location:</strong> ${work.location}</p>
                    <p class="card-text"><strong>Organizer:</strong> ${work.organizer}</p>
                    <p class="card-text text-danger">Error fetching additional details.</p>
                </div>
            `;
        });
    })
    .catch((error) => {
        console.error("Error fetching volunteer work details:", error);
        // Display a message if fetching volunteer work details fails
        const volunteerWork = document.getElementById("volunteer-detail");
        volunteerWork.innerHTML = `
            <div class="card-header bg-info text-white text-center py-4">
                <h2 class="display-4">Message For You</h2>
                <p>Reviews are below if you are interested login or register to participate and see the details</p>
            </div>
        `;
    });
  };


const requestJoin = (workId) => {
  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/join-requests/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("authToken")}`, // Ensure 'authToken' is used
    },
    body: JSON.stringify({ volunteer_work: workId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "pending") {
        alert("Join request sent successfully!");
      } else {
        alert("Failed to send join request.");
      }
    })
    .catch((error) => console.error("Error sending join request:", error));
};

const approveRequest = (requestId) => {
  const token = localStorage.getItem("authToken");

  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/join-requests/${requestId}/approve/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "approved") {
        alert("Join request approved!");
        getDetail(); // Refresh the details to update the participant list and join requests
      } else {
        alert("Failed to approve the join request.");
      }
    })
    .catch((error) => console.error("Error approving join request:", error));
};

const rejectRequest = (requestId) => {
  const token = localStorage.getItem("authToken");

  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/join-requests/${requestId}/reject/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "rejected") {
        alert("Join request rejected!");
        getDetail(); // Refresh the details to update the join requests
      } else {
        alert("Failed to reject the join request.");
      }
    })
    .catch((error) => console.error("Error rejecting join request:", error));
};

getDetail();


document.addEventListener("DOMContentLoaded", () => {
  const workId = getQueryParams("id");
  const token = localStorage.getItem("authToken");

  if (token) {
    fetch(`https://volunteerhub-backend-zlno.onrender.com/api/volunteer-work/${workId}/has-reviewed/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.reviewed) {
          localStorage.setItem('hasReviewed', 'true');
          document.getElementById('review-form').style.display = 'none';
        } else {
          localStorage.setItem('hasReviewed', 'false');
        }
      })
      .catch(error => console.error('Error checking review status:', error));
  }
  
  fetchReviews();
});

const handleReview = (event) => {
  event.preventDefault();
  
  const workId = getQueryParams("id");
  const token = localStorage.getItem("authToken");
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;

  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/reviews/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
          volunteer_work: workId,
          rating: rating,
          comment: comment
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.id) {
          localStorage.setItem('hasReviewed', 'true');
          alert('Review submitted successfully!');
          document.getElementById('review-form').style.display = 'none';
          fetchReviews(); // Refresh the reviews section
      } else {
          alert('Failed to submit review.');
      }
  })
  .catch(error => console.error('Error submitting review:', error));
};



const fetchReviews = () => {
  const workId = getQueryParams("id");
  const token = localStorage.getItem("authToken");
  const has_reviews = localStorage.getItem("hasReviewed");

  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/reviews/?volunteer_work=${workId}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const reviewsElement = document.getElementById('reviews');

      if (data.length === 0) {
        reviewsElement.innerHTML = `<p class="error">No reviews yet!</p>`;
      } else {
        reviewsElement.innerHTML = data.map(review => `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${review.user}</h5>
              <div class="rating">${'⭐'.repeat(review.rating)}</div>
              <p class="card-text">${review.comment}</p>
              <p class="card-text"><small class="text-muted">Reviewed on: ${new Date(review.created_at).toLocaleDateString()}</small></p>
              ${(has_reviews === "true") ? `<button class="btn btn-info" onclick="editReview(${review.id})">Edit</button> <button class="btn btn-danger" onclick="deleteReview(${review.id})">Delete</button>` : ''}
            </div>
          </div>
        `).join('');
      }
    })
    .catch(error => console.error('Error fetching reviews:', error));
};

const editReview = (reviewId) => {
  const token = localStorage.getItem("authToken");

  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/reviews/${reviewId}/`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    }
  })
  .then(response => response.json())
  .then(review => {
    // Populate the modal fields with the existing review data
    document.getElementById('edit-review-id').value = review.id;
    document.getElementById('edit-rating').value = review.rating;
    document.getElementById('edit-comment').value = review.comment;

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editReviewModal'));
    editModal.show();
  })
  .catch(error => console.error('Error fetching review:', error));
};


const submitEditReview = () => {
  const reviewId = document.getElementById('edit-review-id').value;
  const rating = document.getElementById('edit-rating').value;
  const comment = document.getElementById('edit-comment').value;
  const token = localStorage.getItem("authToken");
  const workId = getQueryParams("id");

  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/reviews/${reviewId}/`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({volunteer_work:workId, rating: rating, comment: comment })
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        console.error('Error updating review:', data);
      });
    } else {
      // Successfully updated, now refresh the reviews list or close the modal
      fetchReviews();
      const editModal = bootstrap.Modal.getInstance(document.getElementById('editReviewModal'));
      editModal.hide();
    }
  })
  .catch(error => console.error('Error updating review:', error));
};


const deleteReview = (reviewId) => {
  const token = localStorage.getItem("authToken");

  fetch(`https://volunteerhub-backend-zlno.onrender.com/api/reviews/${reviewId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
    }
  })
  .then(response => {
    if (response.ok) {
      alert('Review deleted successfully!');
      fetchReviews();
      window.location.href="./volunteer_details.html";
    } else {
      alert('Failed to delete review.');
    }
  })
  .catch(error => console.error('Error deleting review:', error));
};




