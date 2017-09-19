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
