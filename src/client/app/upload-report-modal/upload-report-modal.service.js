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
        template: require('./upload-report-modal.view.html'),
        controller: 'UploadReportModalCtrl',
        controllerAs: 'ctrl'
      });
      return modal.result;
    }
  }
})();
