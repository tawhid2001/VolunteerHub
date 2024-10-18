# Volunteer Hub

Volunteer Hub is a web application built using Django and Django REST Framework (DRF) that connects individuals looking to organize volunteer work with those willing to participate. The platform allows users to post about upcoming volunteer opportunities, join initiatives, and provide feedback on their experiences.

## Features
- User authentication for organizers and participants
- Ability to create, view, and manage volunteer opportunities
- Join requests for users to participate in volunteer work
- Rating and review system for assessing the impact of volunteer activities
- REST API for frontend integration

## Technologies
- Python (Django, DRF)
- HTML, CSS, JavaScript (with Bootstrap for styling)

## Live Demo
You can access the live application at: [Volunteer Hub Live](https://volunteerhub-backend-zlno.onrender.com/)

## GitHub Repository
You can find the backend repository for Volunteer Hub at: [Volunteer Hub GitHub Repository](https://github.com/tawhid2001/VolunteerHub_backend).

## Important URLs

### Authentication
- **Login**: `POST /api/auth/login/`
- **Registration**: `POST /api/auth/registration/`

### Volunteer Opportunities
- **Create Volunteer Opportunity**: `POST /api/volunteer/`
- **List Volunteer Opportunities**: `GET /api/volunteer/`
- **Volunteer Opportunity Detail**: `GET /api/volunteer/<int:id>/`

### Join Requests
- **Join Request for Opportunity**: `POST /api/volunteer/<int:id>/join/`
- **List My Join Requests**: `GET /api/my-join-requests/`

### Reviews
- **Submit Review**: `POST /api/volunteer/<int:id>/review/`
- **List Reviews for Opportunity**: `GET /api/volunteer/<int:id>/reviews/`

## How to Run
1. Clone the repository.
2. Install dependencies: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Start the server: `python manage.py runserver`
