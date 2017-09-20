from sqlalchemy import Column, ForeignKey, Integer, Float, String, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine

Base = declarative_base()

class JobGroups(Base):
	__tablename__ = 'job_groups'
	id = Column(String(1), primary_key=True)
	hourly_rate = Column(Float, nullable=False)

class TimeSheet(Base):
	__tablename__ = 'timesheet'
	id = Column(Integer, primary_key=True, autoincrement=True)
	employee_id = Column(Integer, nullable=False)
	date = Column(Date, nullable=False)
	hours_worked = Column(Float, nullable=False)
	job_group = Column(String(1), ForeignKey('job_groups.id'))
	report_id = Column(Integer, ForeignKey('reports.id'))

class Reports(Base):
	__tablename__ = 'reports'
	id = Column(Integer, primary_key=True, autoincrement=False)
	created = Column(DateTime, nullable=False)
