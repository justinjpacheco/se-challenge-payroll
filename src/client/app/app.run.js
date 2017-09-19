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
