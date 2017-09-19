(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  function config($locationProvider) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});
  }

})();
