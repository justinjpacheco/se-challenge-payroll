from setuptools import setup, find_packages

setup(
  name='payroll',
  version='1.0',
  packages=find_packages(),
  include_package_data=True,
  install_requires=[
    'Flask',
    'MySQL-python',
    'SQLAlchemy',
    'sqlalchemy_utils'
  ]
)
