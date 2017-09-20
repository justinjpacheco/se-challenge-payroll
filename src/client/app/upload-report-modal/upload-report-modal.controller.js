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

      // build the request that will be sent the backend for processing
      // 'Content-Type': undefined enables us to let AngularJS figure out
      // the correct content type based on the file
      //
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
