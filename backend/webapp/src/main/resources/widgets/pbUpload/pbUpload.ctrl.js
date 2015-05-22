
  function PbUploadCtrl($scope, $sce, $element, widgetNameFactory, $timeout, $log) {
    var ctrl = this;
    this.name = widgetNameFactory.getName('pbInput');
    this.filename = '';
    this.filemodel = '';

    this.clear = clear;
    this.startUploading = startUploading;
    this.uploadError = uploadError;
    this.uploadComplete = uploadComplete;

    this.name = widgetNameFactory.getName('pbUpload');

    var input = $element.find('input');
    var form = $element.find('form');

    input.on('change', forceSubmit);
    $scope.$on('$destroy', function() {
      input.off('change', forceSubmit);
    });

    $scope.$watch('properties.url', function(newUrl, oldUrl){
      ctrl.url = $sce.trustAsResourceUrl(newUrl);
      if (newUrl === undefined) {
        $log.warn('you need to define a url for pbUpload');
      }
    });

    function clear() {
      ctrl.filename = '';
      ctrl.filemodel = '';
      $scope.properties.value = {};
    }

    function uploadError(error) {
      $log.warn('upload fails too', error);
      ctrl.filemodel = '';
      ctrl.filename = 'Upload failed';
    }

    function startUploading() {
      ctrl.filemodel = '';
      ctrl.filename  = 'Uploading...';
    }

    function uploadComplete(response) {
      if(response && response.type && response.message){
        $log.warn('upload fails');
        ctrl.filemodel = '';
        ctrl.filename = 'Upload failed';
        return;
      }

      if (response.filename) {
        ctrl.filemodel = true;
        ctrl.filename = response.filename;
      }

      $scope.properties.value = response;
    }

    function forceSubmit(event) {
      if( !event.target.value) {
        return;
      }

      form.triggerHandler('submit');
      form[0].submit();
    }
  }