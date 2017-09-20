from flask import Flask, make_response, request

import json
import payrolllib.payroll as payroll

app = Flask(__name__)

@app.route('/payroll', methods=["GET"])
def get_payroll():

  res = None

  try:
    payroll_data = payroll.get();
    res = make_response(json.dumps(payroll_data),200)
  except Exception as e:
    res = make_response(json.dumps(e),400)

  res.headers['Content-Type'] = 'application/json'
  return res

@app.route('/payroll', methods=["POST"])
def update_payroll():

  res = None

  # check to make sure a file was uploaded
  #
  if 'file' not in request.files:
    return make_response('No file uploaded',400)

  file = request.files['file']

  # check that the file uploaded has the correct type (csv)
  #
  if file.content_type != 'text/csv':
    return make_response('Incorrect content type (text/csv)',400)

  # read the file and extract the report id to check if it exists
  #
  payroll_data = file.read().splitlines()
  report_id = payroll_data[-1].split(',')[1]

  # check if this report id has been used before. exit if this is true
  #
  if payroll.existing_report_id(report_id):
    error = {'reason': "Report ID {id} already exists".format(id=report_id)}
    res = make_response(json.dumps({'error':error}),400)
    res.headers['Content-Type'] = 'application/json'
    return res

  try:
    payroll.update(payroll_data)
    res = make_response('',200)
  except Exception as e:
    res = make_response(json.dumps(e),400)

  res.headers['Content-Type'] = 'application/json'

  return res
