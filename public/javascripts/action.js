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

app.controller('AppCtrl', function($scope,$timeout,$mdSidenav) {
  $scope.pageTitle = "主页";
  $scope.openSidenav = function(menuId) {
    $mdSidenav('main')
      .toggle()
      .then(function() {
        console.log('Main sidebar toggled');
      });
  };
  $scope.userForm = function() {
    console.log("login form");
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
