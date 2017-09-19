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
