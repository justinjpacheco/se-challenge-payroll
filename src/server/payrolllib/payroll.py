import csv
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ConfigParser import SafeConfigParser

from payrolllib.schema import Base, JobGroups, TimeSheet, Reports

config = SafeConfigParser()
config.read('/etc/payroll/payroll.conf')

def dbh():
  connection = config.get('database','connection')
  engine = create_engine(connection)
  Base.metadata.bind = engine
  DBSession = sessionmaker(bind=engine)
  return DBSession()

def get():

  session = dbh()

  # create the structure that will evetually be the data tha we return
  # to the api
  #
  data = {
    'payroll': [],
    'report': {}
  }

  # search for all the payroll records and the job groups that go with them
  #
  query = (
    session
      .query(TimeSheet,JobGroups)
      .filter(JobGroups.id == TimeSheet.job_group)
      .all()
  )

  # get the latest report information to know when the system was last updated
  #
  report = (
    session
      .query(Reports)
      .order_by(Reports.created.desc())
      .first()
  )

  # populate our data structure with informatio from our queries
  #
  for t,j in query:

    data['payroll'].append({
      'employee_id': t.employee_id,
      'date': t.date.isoformat(),
      'hours_worked': t.hours_worked,
      'hourly_rate': j.hourly_rate
    })

  if len(data['payroll']) and report != None:
    data['report'] = {
      'id': report.id,
      'created': report.created.isoformat()
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

