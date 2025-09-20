# InternGuide

In India, many students—especially from **rural areas, first-generation learners, women, and underrepresented communities**—struggle to access the right internships.  
They often lack **personalized guidance**, which leads to **missed opportunities** that could shape their careers.  

The **Prime Minister Internship Portal** bridges this gap by:  
✅ Matching students to internships based on their **skills and interests**  
✅ Giving **priority access** to underrepresented groups  
✅ Providing **real-time updates** on the latest opportunities  

---

## 🎯 Objectives  

- **Democratize access** to career opportunities for all students  
- Provide a **personalized recommendation system** powered by AI  
- Ensure **inclusivity and fairness** in internship allocation  
- Deliver a **modern, user-friendly interface** for seamless student experience  

---

## 🛠️ Tech Stack  

### **Frontend**  
- **React.js** → Component-based architecture, modular, responsive UI  
- **TailwindCSS** → Modern, utility-first styling  
- **Framer Motion** → Smooth animations and transitions  
- **Axios** → API communication with backend  

### **Backend**  
- **FastAPI (Python)** → Lightweight, high-performance backend framework  
- **PostgreSQL** → Reliable relational database for storing student & internship data  
- **SQLAlchemy ORM** → Database modeling and queries  
- **n8n** → Workflow automation (chatbot integration, notifications, triggers)  

### **Search & Recommendation Engine**  
- **FAISS / ElasticSearch** → Skill-based semantic search and ranking  
- **AI Matching Algorithm** → Internship recommendations based on profile & skills  
- **n8n Chatbot** → Students interact with an AI assistant to explore opportunities  

### **Design & Prototyping**  
- **Figma** → UI/UX prototyping and design system  

---

## ✨ Features  

🔍 **Smart Search & Filter** – Find internships by **location, skill set, or domain**  
🎯 **Skill-based Recommendations** – AI-powered matching using FAISS/ElasticSearch  
🤖 **Chatbot Assistant** – Explore opportunities through **n8n chatbot integration**  
📢 **Automated Notifications** – Get **real-time alerts** for relevant internships  
🌍 **Inclusive Access** – Special priority for **underrepresented groups**  
📊 **Reports & Insights** – Application analytics & progress tracking  

---




<img width="1897" height="894" alt="image" src="https://github.com/user-attachments/assets/0f3b4784-31c2-4cfb-b39f-954d700960f7" />

<img width="1658" height="870" alt="image" src="https://github.com/user-attachments/assets/e4dbb08c-1db4-480c-87d4-bafb209b20d2" />

<img width="1795" height="899" alt="image" src="https://github.com/user-attachments/assets/04acbe0f-7d70-4cf6-98ba-97aff1e046cf" />

<img width="330" height="745" alt="image" src="https://github.com/user-attachments/assets/c119b44b-4271-483e-9dbd-97018959873d" />

<img width="330" height="741" alt="image" src="https://github.com/user-attachments/assets/162ff69f-8d19-4d37-8d3f-0530df9eb028" />

<img width="330" height="741" alt="image" src="https://github.com/user-attachments/assets/7b60a496-7873-4dff-aff3-a713a739f69e" />


## 🌍 Impact  

The **Prime Minister Internship Portal** creates a **triple impact** for students, government, and industries:  

### 🎓 Students  
- Equal access to internships, regardless of location or background  
- AI-powered personalized recommendations save time and effort  
- Real-time alerts keep them updated on opportunities  
- Inclusivity ensures **women and underrepresented groups** get priority  

### 👩‍🏫 Government  
- Empowers youth by **bridging the skills-to-employment gap**  
- Promotes **Digital India** & **Skill India** initiatives  
- Provides **data-driven insights** for policymaking on internships & education  
- Encourages participation from **rural and first-generation learners**  

### 🏢 Industries  
- Access to a **diverse and skilled talent pool**  
- Streamlined hiring through smart recommendations  
- Increases reach to students in **tier-2 & tier-3 cities**  
- Builds stronger **academia-industry collaboration**  


## 📂 Project Structure  

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
## 🔮 Conclusion  

The **Prime Minister Internship Portal** is more than just a platform—it is a step toward **equal opportunity, inclusivity, and empowerment** for India’s youth.  
By combining **modern technology, AI-driven personalization, and government-led initiatives**, it ensures that **no student is left behind** in the search for meaningful career opportunities.  
With its scalable architecture and impact-driven vision, this project has the potential to become a **national-level solution** connecting students, industries, and policymakers to build a stronger, future-ready workforce for India.  
