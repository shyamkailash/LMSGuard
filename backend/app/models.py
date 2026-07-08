from sqlalchemy import Column, Integer, String
from app.database import Base
from app.database import engine




class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    register_no = Column(String, unique=True)
    department = Column(String)
    year = Column(String)


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    department = Column(String)
    year = Column(String)


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    subject = Column(String)
    class_name = Column(String)