(function() {
  'use strict';

  angular.module('app',['ngRoute','ui.bootstrap']);

})();

(function() {
  'use strict';

  angular
    .module('app')
    .run(run);

  function run($rootScope,ErrorModal) {

    $rootScope.$on('$routeChangeError', function(evt, curr, prev, error) {
      ErrorModal
        .show(error)
        .then(function() {}, function() {});
    });

  }

})();

(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  function config($locationProvider) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});
  }

})();

(function() {
  'use strict';

  angular
    .module('app')
    .config(routes);

  function routes($routeProvider) {
    $routeProvider
      .when('/',{
        controllerAs: 'pc',
        controller: 'PayrollCtrl',
        templateUrl: '/payroll.view.html',
        resolve: {
          RouteResolve: function($q,$http) {
            var defer = $q.defer();
            $http
              .get('/api/payroll')
              .then(
                function(r) {
                  var data = {
                    report: r.data.report,
                    payroll: r.data.payroll
                  }
                  defer.resolve(data);
                },
                function(r) {
                  defer.reject(r);
                }
              );
            return defer.promise;
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();

(function() {
  'use strict';

  angular
    .module('app')
    .directive('fileUpload',fileUpload);

  function fileUpload() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
				element[0].addEventListener('change', function(e) {
					var filename = e.target.value.split('\\').pop();
          document.getElementById('payroll_filename').innerHTML = filename;
				});
      }
    };
  }

})();

(function() {
  'use strict';

  angular
    .module('app')
    .service('UploadReportModal',UploadReportModal);

  function UploadReportModal($q,$uibModal) {
    this.show = function() {
      var self = this;
      var modal = $uibModal.open({
        size: 'sm',
        backdrop: 'static',
        templateUrl: '/upload-report-modal.view.html',
        controller: 'UploadReportModalCtrl',
        controllerAs: 'ctrl'
      });
      return modal.result;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app')
    .controller('UploadReportModalCtrl',UploadReportModalCtrl);

  function UploadReportModalCtrl($uibModalInstance,$http,ErrorModal) {
    var self = this;

    self.upload = function() {
      var fileInput = document.getElementById('payroll_report');
      var file = fileInput.files[0];
      var formData = new FormData();
      formData.append('file', file);

			var request = {
				method: 'POST',
				url: '/api/payroll',
				data: formData,
				headers: {
					'Content-Type': undefined
				}
			};

			$http(request)
        .then(
          function(r) {
            $uibModalInstance.close();
          },
          function(r) {
            ErrorModal
              .show(r)
              .then(function() {},function() {});
          }
        );
    };

    self.close = function() {
      $uibModalInstance.dismiss('close');
    };
  }
})();

(function() {
  'use strict';

  angular
    .module('app')
    .service('ErrorModal',ErrorModal);

  function ErrorModal($q,$uibModal) {
    this.show = function(r) {
      var self = this;
      var modal = $uibModal.open({
        size: 'sm',
        backdrop: 'static',
        templateUrl: '/error-modal.view.html',
        controller: 'ErrorModalCtrl',
        controllerAs: 'emc',
        resolve: {
          ModalResolve: function() {
            return r;
          }
        }
      });
      return modal.result;
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('app')
    .controller('ErrorModalCtrl',ErrorModalCtrl);

  function ErrorModalCtrl($uibModalInstance,$http,ModalResolve) {
    var self = this;

    angular.extend(self,{
      model: {},
      res: ModalResolve
    });


    try {
      if ('data' in self.res &&
          'error' in self.res.data &&
          'reason' in self.res.data.error)
      {
        self.model.reason = self.res.data.error.reason;
      }
    } catch(error) {
      self.model.reason = self.res.statusText;
    }

    self.close = function() {
      $uibModalInstance.dismiss();
    };
  }
})();

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
