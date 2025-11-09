import os
from fastapi import FastAPI
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from pydantic import BaseModel
from typing import Optional

from datetime import date
from fastapi import HTTPException

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

# # Define data model for request validation
# class Student(BaseModel):
#     name: str
#     gender: str
#     dob: str
#     interests: Optional[str] = None


# # CREATE
# @app.post("/students")
# def create_student(student: Student):
#     sql = text("""
#         INSERT INTO "AISC_student_data" ("Name", "Gender", "DOB", "Interests")
#         VALUES (:name, :gender, :dob, :interests)
#         RETURNING "UserID"
#     """)
#     with engine.begin() as conn:
#         result = conn.execute(sql, student.dict())
#         new_id = result.scalar_one()
#     return {"message": "Student created successfully", "user_id": new_id}


# # READ (already defined, but let’s add a single record endpoint)
# @app.get("/students/{user_id}")
# def get_student(user_id: int):
#     sql = text("""
#         SELECT "UserID" as user_id, "Name" as name, "Gender" as gender,
#                "DOB" as dob, "Interests" as interests
#         FROM "AISC_student_data"
#         WHERE "UserID" = :user_id
#     """)
#     with engine.connect() as conn:
#         student = conn.execute(sql, {"user_id": user_id}).mappings().first()
#     if not student:
#         return {"error": "Student not found"}
#     return student


# # UPDATE
# @app.put("/students/{user_id}")
# def update_student(user_id: int, student: Student):
#     sql = text("""
#         UPDATE "AISC_student_data"
#         SET "Name" = :name,
#             "Gender" = :gender,
#             "DOB" = :dob,
#             "Interests" = :interests
#         WHERE "UserID" = :user_id
#     """)
#     with engine.begin() as conn:
#         result = conn.execute(sql, {**student.dict(), "user_id": user_id})
#         if result.rowcount == 0:
#             return {"error": "Student not found"}
#     return {"message": "Student updated successfully"}


# # DELETE
# @app.delete("/students/{user_id}")
# def delete_student(user_id: int):
#     sql = text('DELETE FROM "AISC_student_data" WHERE "UserID" = :user_id')
#     with engine.begin() as conn:
#         result = conn.execute(sql, {"user_id": user_id})
#         if result.rowcount == 0:
#             return {"error": "Student not found"}
#     return {"message": "Student deleted successfully"}


class StudentCreate(BaseModel):
    name: str
    gender: str
    dob: date                  # <-- real date
    interests: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    interests: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None


# CREATE
@app.post("/students")
def create_student(student: StudentCreate):
    sql = text("""
        INSERT INTO "AISC_student_data"
            ("Name", "Gender", "DOB", "Interests", "City", "Country")
        VALUES
            (:name, :gender, :dob, :interests, :city, :country)
        RETURNING "UserID"
    """)
    try:
        with engine.begin() as conn:
            new_id = conn.execute(sql, student.dict()).scalar_one()
        return {"message": "Student created successfully", "user_id": new_id}
    except Exception as e:
        # surface the real DB error for now (dev)
        raise HTTPException(status_code=400, detail=str(e))


# READ (single)
@app.get("/students/{user_id}")
def get_student(user_id: int):
    sql = text("""
        SELECT "UserID" as user_id, "Name" as name, "Gender" as gender,
               "DOB" as dob, "Interests" as interests, "City" as city, "Country" as country
        FROM "AISC_student_data"
        WHERE "UserID" = :user_id
    """)
    with engine.connect() as conn:
        row = conn.execute(sql, {"user_id": user_id}).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Student not found")
    return row


# UPDATE (partial-safe: keeps old values when a field is omitted)
@app.put("/students/{user_id}")
def update_student(user_id: int, student: StudentUpdate):
    sql = text("""
        UPDATE "AISC_student_data"
        SET "Name"     = COALESCE(:name, "Name"),
            "Gender"   = COALESCE(:gender, "Gender"),
            "DOB"      = COALESCE(:dob, "DOB"),
            "Interests"= COALESCE(:interests, "Interests"),
            "City"     = COALESCE(:city, "City"),
            "Country"  = COALESCE(:country, "Country")
        WHERE "UserID" = :user_id
    """)
    params = {**student.dict(), "user_id": user_id}  # <-- dict(), not diet()
    with engine.begin() as conn:
        result = conn.execute(sql, params)
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student updated successfully"}


# DELETE
@app.delete("/students/{user_id}")
def delete_student(user_id: int):
    sql = text('DELETE FROM "AISC_student_data" WHERE "UserID" = :user_id')
    with engine.begin() as conn:
        result = conn.execute(sql, {"user_id": user_id})
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}