from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ConfigParser import SafeConfigParser
from payrolllib.schema import Base, JobGroups

config = SafeConfigParser()
config.read('/etc/payroll/payroll.conf')

connection = config.get('database','connection')
engine = create_engine(connection)
Base.metadata.create_all(engine)
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

if not session.query(JobGroups).filter(JobGroups.id == 'A').count():
  session.add(JobGroups(id='A',hourly_rate=20.00))
  session.commit()

if not session.query(JobGroups).filter(JobGroups.id == 'B').count():
  session.add(JobGroups(id='B',hourly_rate=30.00))
  session.commit()
