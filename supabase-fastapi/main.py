# from fastapi import FastAPI, Depends
# from sqlalchemy import create_engine, Column, Integer, String, Date
# from sqlalchemy.orm import declarative_base, sessionmaker, Session
# from dotenv import load_dotenv
# import os

# # Load environment variables
# load_dotenv()
# DATABASE_URL = os.getenv("DATABASE_URL")

# # Connect to Supabase Postgres
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
# Base = declarative_base()

# # Define your table (match your Supabase table name + columns)
# class Student(Base):
#     __tablename__ = "AISC_student_data"
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String)
#     gender = Column(String)
#     dob = Column(Date)
#     interests = Column(String)

# app = FastAPI()

# # Dependency to get DB session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @app.get("/")
# def root():
#     return {"message": "Connected to FastAPI + Supabase!"}

# @app.get("/students")
# def get_students(db: Session = Depends(get_db)):
#     students = db.query(Student).limit(10).all()
#     return students

# import os
# from fastapi import FastAPI, Depends
# from sqlalchemy import create_engine, text
# from sqlalchemy.orm import sessionmaker, Session
# from dotenv import load_dotenv

# import os
# from dotenv import load_dotenv

# # load .env from the project directory
# load_dotenv(override=True)

# DATABASE_URL = os.getenv("DATABASE_URL")
# if not DATABASE_URL:
#     raise RuntimeError("DATABASE_URL is missing")

# # Good safety: pre_ping so dead connections are recycled
# engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
# SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

# app = FastAPI()

# @app.on_event("startup")
# def _test_db():
#     # fail fast with a clear error if DB is unreachable
#     with engine.connect() as conn:
#         conn.execute(text("select 1"))

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


#         from sqlalchemy import text

# @app.get("/")
# def root():
#     return {"message": "FastAPI + Supabase is up"}

# @app.get("/students")
# def list_students():
#     # Simple SQL (no ORM) so you don't need the Student class right now
#     with engine.connect() as conn:
#         rows = conn.execute(
#             text('select id, name, gender, dob, interests from "AISC_student_data" limit 10')
#         ).mappings().all()  # returns list[dict]
#     return rows

# main.py
import os
from fastapi import FastAPI
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables (expects DATABASE_URL in .env)
load_dotenv(override=True)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing")

# Create engine + session factory
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

app = FastAPI()

@app.on_event("startup")
def startup_db_check():
    # Fail fast if DB is unreachable
    with engine.connect() as conn:
        conn.execute(text("select 1"))

@app.get("/")
def root():
    return {"message": "FastAPI + Supabase is up"}

# API CALL
@app.get("/students")
def list_students(limit: int = 10):
    sql = text(
        'select "UserID"   as user_id,'
        '       "Name"     as name,'
        '       "Gender"   as gender,'
        '       "DOB"      as dob,'
        '       "Interests" as interests '
        'from "AISC_student_data" '
        'limit :limit'
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"limit": limit}).mappings().all()
    return rows

# CRUD API = C = Create, R = , U = update, D = Delete. 

# Write CRUD API for fast api to manage database table...
# Create Git hub repo and share to everyone. 