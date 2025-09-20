In India, many students—especially from rural areas, first-generation learners, women, and underrepresented communities—face challenges in accessing the right internships.
They lack personalized guidance and often miss opportunities that could shape their careers.

The Prime Minister Internship Portal bridges this gap by:

Matching students to internships based on their skills and interests.

Giving priority access to underrepresented groups.

Providing regular updates on the latest internships.

🎯 Objectives

Democratize access to career opportunities.

Provide a personalized recommendation system.

Ensure inclusivity and fairness in the internship selection process.

Deliver a modern, user-friendly interface for students.

🛠️ Tech Stack

Frontend: React.js (with modular components and modern UI/UX)

Backend / Automation: n8n (for workflows, chatbot, notifications)

Database: (to be defined – MongoDB / Firebase / PostgreSQL)

Design: Figma (for UI/UX prototyping)

✨ Features

🔍 Smart Search & Filter – Find internships by location, skill set, or domain.

🎯 Skill-based Recommendations – AI/Workflow powered matching.

🤖 n8n Chatbot Integration – Students can interact with a chatbot to explore opportunities.

📢 Automated Notifications (via n8n) – Get real-time updates on internships that match your profile.

🌍 Inclusive Access – Special priority for underrepresented groups.

📊 Reports & Insights – Progress tracking and application analytics.

## Project Structure

```
my-project
├── backend
│   ├── app
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── routers
│   │       ├── __init__.py
│   │       └── items.py
│   └── requirements.txt
├── frontend
└── README.md
```

## Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the FastAPI application:
   ```
   uvicorn app.main:app --reload
   ```
The application will be accessible at `http://127.0.0.1:8000`.
 ## Frontend
This is the frontend client for the Prime Minister Internship Portal, built with React.js.
It provides a modern, responsive interface for students to explore internships, interact with a chatbot, and receive real-time notifications.
``` frontend/
│── public/                # Static assets  
│── src/  
│   ├── assets/            # Images, icons, etc.  
│   ├── components/        # Reusable UI components  
│   │   ├── Admin/         # Admin panel components  
│   │   ├── DashboardComp/ # Dashboard components  
│   │   ├── HeaderComp/    # Navbar, Footer, Header  
│   │   ├── HomeComp/      # Homepage sections  
│   │   ├── ui/            # Chatbot & Smart Assistant  
│   │   └── ...            # Other pages (Login, SignUp, Profile)  
│   ├── App.js             # Main application component  
│   ├── index.js           # React entry point  
│   └── App.css            # Global styles  
│── package.json           # Project dependencies  
│── README.md              # Documentation (this file)  
```
1. Install dependencies
```
cd frontend
npm i
npm run dev
 ```
## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features.
