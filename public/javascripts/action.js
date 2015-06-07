var app = angular.module("THSITLab", [
    'ngMaterial'
]).config(function($mdThemingProvider, $mdIconProvider) {
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

  $mdIconProvider
    .icon('lab:logo', '/icons/logo.svg');
});

app.controller('AppCtrl', function($scope,$timeout,$mdSidenav,$mdDialog) {
  $scope.pageTitle = "主页";

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId)
      .toggle()
      .then(function() {
        console.log('sidebar toggled: '+menuId);
      });
  };

  $scope.swipeRight = function(event) {
    if(event.pointer.startX < window.innerWidth * 0.1) {
      $scope.toggleSidenav('main');
    }
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
}).directive("slider", function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/tmpl/slider.tmpl.html',
    link: function(scope, element, attr) {
      var $element = $(element[0]).children(".slider");;
      var itemCount = undefined;
      var contentWidth = undefined;
      var wrapperWidth = undefined;
      var displace = 0;

      var $leftFab = $element.find(".slider-control.left");
      var $rightFab = $element.find(".slider-control.right");
      var $content = $element.find(".slider-content");

      var leftHidden = false;
      var rightHidden = false;

      var update = function() {
        if(displace + contentWidth <= wrapperWidth) displace = wrapperWidth - contentWidth;
        if(displace >= 0) displace = 0; // If the slider is not full, defaults to left

        $content.css("transform","translateX("+displace+"px)");

        if((displace >= 0) != leftHidden) {
          leftHidden = !leftHidden;
          $leftFab.toggleClass("hidden");
        }

        if((displace + contentWidth <= wrapperWidth) != rightHidden) {
          rightHidden = !rightHidden;
          $rightFab.toggleClass("hidden");
        }
      }

      scope.shift = function(direction) {
        //TODO: find a way to read the width when the page finishes loading
        //Currently it returns 0
        if(!wrapperWidth) {
          itemCount = $element.find("[ng-transclude] > md-card").size();
          contentWidth = itemCount * 160-32;
          wrapperWidth = $element.width();
          update();
        }
        //Shift to the first hidden card
        if(direction == "right") {
          displace = Math.ceil((displace - wrapperWidth-20)/160)*160;
        } else {
          displace = Math.ceil(displace/160)*160-128+wrapperWidth;
        }

        update();
      };

      $(window).resize(function(e) {
        wrapperWidth = $element.width();
        update();
      });
    }
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
