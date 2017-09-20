(function() {
  'use strict';

  angular
    .module('app')
    .controller('PayrollCtrl',PayrollCtrl);

  function PayrollCtrl($route,UploadReportModal,RouteResolve) {
    var self = this;

    angular.extend(self,{
      model: {
        report_info: RouteResolve.report,
        payroll: summarize_payroll(RouteResolve.payroll)
      }
    });

    self.add_report = function() {
      UploadReportModal
        .show()
        .then(
          function(r) { $route.reload() },
          function(r) { }
        );
    }

    if (self.model.payroll.length === 0) {
      self.add_report();
    }

  }

  function summarize_payroll(records) {

    // initialize variable that we will return at the end
    //
    var tmp = {};
    var payroll = [];

    records.forEach(function(r) {
      var id = r.employee_id;
      var hours_worked = r.hours_worked;
      var hourly_rate = r.hourly_rate;
      var pay_period = pay_period_string(moment(r.date));

      if (!(id in tmp)) {
        tmp[id] = {};
      }

      if (!(pay_period in tmp[id])) {
        tmp[id][pay_period] = 0;
      }

      tmp[id][pay_period] += hours_worked * hourly_rate;
    });

    for (var id in tmp) {
      for (var pay_period in tmp[id]) {
        payroll.push({
          employee_id: id,
          pay_period: pay_period,
          amount: tmp[id][pay_period]
        });
      }
    }

    return payroll;
  }

  function pay_period_string(date) {

    // momentjs indexes months starting at 0, so we'll add 1 to get 1-12
    //
    var month = date.month() + 1;
    var year = date.year();
    var day_of_month = date.date();
    var end_of_month = date.daysInMonth();

    if (day_of_month <= 15) {
      return '1/' + month + '/' + year + ' - ' + '15/' + month + '/' + year;
    } else {
      return '16/' + month + '/' + year + ' - ' + end_of_month + '/' + month + '/' + year;
    }
  }
})();
