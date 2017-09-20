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
        template: require('./error-modal.view.html'),
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
