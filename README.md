# AISC
✨ Overview

HuskyConnect is a full-stack matching platform designed to help UW students connect with peers who share similar interests and locations.
Built with FastAPI, React (Vite + Tailwind), and Supabase (Postgres), it provides a clean demo of how data-driven recommendations can foster meaningful campus connections.

🧑‍🤝‍🧑 Developed as part of the AISC project to promote student networking through accessible technology.

🧱 Project Structure
AISC-main/
 ├─ frontend/
 │   └─ huskyconnect/       # React (Vite) app
 └─ supabase-fastapi/       # FastAPI backend


Backend: supabase-fastapi/main.py

Frontend Entry: frontend/huskyconnect/src/main.jsx

Main App: frontend/huskyconnect/src/HuskyConnect.jsx

⚙️ Prerequisites
Tool	Version	Notes
Node.js	18+	Required for React + Vite
Python	3.12	Backend (FastAPI)
Database	Postgres / Supabase	DATABASE_URL required
🚀 Quick Start
1️⃣ Backend (FastAPI)
cd AISC-main/supabase-fastapi
.\venv\Scripts\Activate.ps1  # (Windows PowerShell)
# Create .env file
echo DATABASE_URL=postgresql+psycopg2://USER:PASSWORD@HOST:PORT/DBNAME > .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000


✅ Visit http://localhost:8000/ → should return {"message":"FastAPI + Supabase is up"}

2️⃣ Frontend (React + Vite)
cd AISC-main/frontend/huskyconnect
npm install
npm run dev


Then open: http://localhost:5173

🌐 API Endpoints
Method	Endpoint	Description
GET	/students?limit=10	List all students
POST	/students	Add new student
GET	/students/{user_id}	Read one student
PUT	/students/{user_id}	Update existing student
DELETE	/students/{user_id}	Delete a student
GET	/recommendations/{user_id}?limit=10	Get recommended connections
🔍 Recommendation Scoring
Factor	Weight	Example
Shared Interests	×3	"2 shared interest(s)"
Same City	×1	"same city"
Same Country	×0.5	"same country"

Example request:

curl -X PUT "http://localhost:8000/students/1" `
  -H "Content-Type: application/json" `
  -d "{\"interests\":\"ai, ml, python\", \"city\":\"Seattle\", \"country\":\"USA\"}"

🧩 Database Schema

Expected table: "AISC_student_data"

Column	Type	Example
UserID	int	1
Name	text	"Alex"
Gender	text	"Male"
DOB	date	"2003-06-15"
Interests	text	"AI, ML, Python"
City	text	"Seattle"
Country	text	"USA"
🧠 Testing Recommendations

Add or update users with shared interests:

curl -X PUT "http://localhost:8000/students/2" `
  -H "Content-Type: application/json" `
  -d "{\"interests\":\"AI, Python, hiking\", \"city\":\"Seattle\", \"country\":\"USA\"}"


Get top matches:

curl "http://localhost:8000/recommendations/1?limit=5"


Verify: Users with more shared interests and same city should rank higher.

🔧 Configuration & Tuning

Adjust weights directly in main.py (within /recommendations SQL).

Migrate "Interests" to JSON or a join table for advanced matching.

For semantic search, consider pgvector + sentence embeddings.

🧭 Troubleshooting
Issue	Possible Fix
Backend won’t start	Check .env and DB credentials
CORS errors	Ensure backend allow_origins matches frontend host
Empty recommendations	Verify that both users have overlapping interests/location
🧭 Future Improvements

✅ Add user authentication (OAuth via Supabase)

🔍 Use pgvector for semantic similarity search

💬 Improve recommendation explanations with NLP

🚀 Deploy demo on Render (backend) and Vercel (frontend)

🖼️ Demo Preview (optional)

(Add a screenshot here once the app runs locally)

![HuskyConnect Demo Screenshot](assets/huskyconnect_demo.png)

📄 License

This project is licensed under the MIT License — for academic and demo use.
