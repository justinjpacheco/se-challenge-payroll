import csv
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from payrolllib.schema import Base, JobGroups, TimeSheet, Reports

def dbh():
  engine = create_engine('mysql://payroll:password@localhost/payroll')
  Base.metadata.bind = engine
  DBSession = sessionmaker(bind=engine)
  return DBSession()

def get():

  data = {}
  payroll = []
  session = dbh()

  query = (
    session
      .query(TimeSheet,JobGroups)
      .filter(JobGroups.id == TimeSheet.job_group)
      .all()
  )

  report = (
    session
      .query(Reports)
      .order_by(Reports.created.desc())
      .first()
  )

  for t,j in query:

    payroll.append({
      'employee_id': t.employee_id,
      'date': t.date.isoformat(),
      'hours_worked': t.hours_worked,
      'hourly_rate': j.hourly_rate
    })

  if len(payroll) and report != None:
    data = {
      'payroll': payroll,
      'report': {
        'id': report.id,
        'created': report.created.isoformat()
      }
    }

  return data;

def existing_report_id(report_id):
  session = dbh()

  if session.query(Reports).filter(Reports.id == report_id).count():
    return True

def update(payroll_data):
  session = dbh()

  # remove the report info row (footer)
  #
  report_info = payroll_data.pop()
  report_id = report_info.split(',')[1]

  # parse the csv file into a dictionary
  #
  payroll_data = csv.DictReader(payroll_data)

  # skip over the header line
  #
  payroll_data.next()

  try:
    session.add(Reports(id = report_id,created = datetime.now()))
    session.commit()

    for row in payroll_data:
      session.add(
        TimeSheet(
          employee_id = row['employee id'],
          date = datetime.strptime(row['date'], '%d/%m/%Y'),
          hours_worked = row['hours worked'],
          job_group = row['job group'],
          report_id = report_id
        )
      )

    session.commit()
  except:
    session.rollback()
    raise
  finally:
    session.close()

