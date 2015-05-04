var app = angular.module("THSITLab", [
    'ngMaterial',
    'eee-c.angularBindPolymer'
]).config(function($mdThemingProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue', {
      'default': '500',
      'hue-1': '300',
      'hue-2': '900',
      'hue-3': '100'
    }).accentPalette('teal', {
      'default': '500',
      'hue-1': '200',
      'hue-2': '800',
      'hue-3': '100'
    });
});

app.controller('AppCtrl', function($scope,$timeout,$mdSidenav,$mdDialog) {
  $scope.pageTitle = "主页";
  $scope.openSidenav = function(menuId) {
    $mdSidenav('main')
      .toggle()
      .then(function() {
        console.log('Main sidebar toggled');
      });
  };
  $scope.userForm = function(e) {
    $mdDialog.show({
      controller: userFormController,
      templateUrl: '/tmpl/static/user_form.tmpl.html',
      targetEvent: e
    }).then(function(answer) {
      //TODO: Login logic
    }, function() {
      // Login Canceled
    });
  };
}).controller("NavMain", function($scope,$timeout,$mdSidenav) {
  $scope.close = function() {
    $mdSidenav('main')
      .close()
      .then(function() {
        console.log('Main sidebar closed');
      });
  }
});

function userFormController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

  $scope.state = "登陆";
  $scope.isRegister = false;
  
  $scope.stateChange = function(newState) {
    if(newState) $scope.state = "注册";
    else $scope.state = "登陆";
  };

  $scope.user = {
    name: "",
    passwd: ""
  };
}
