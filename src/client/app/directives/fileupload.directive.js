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
