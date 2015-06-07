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

      var $leftFab = $element.children("md-button.left");
      var $rightFab = $element.children("md-button.right");
      var $content = $element.find(".slider-content");

      var leftHidden = false;
      var rightHidden = false;

      var update = function() {
        console.log(displace);

        if(displace + contentWidth <= wrapperWidth) displace = wrapperWidth - contentWidth;
        if(displace >= 0) displace = 0; // If the slider is not full, defaults to left
        console.log(displace);
        console.log("CONTENT "+contentWidth);

        $content.css("transform","translateX("+displace+"px)");

        if((displace >= 0) != leftHidden) {
          leftHidden = !leftHidden;
          $leftFab.toggleClass("hidden");
        }

        if((displace + contentWidth <= wrapperWidth) != leftHidden) {
          rightHidden = !rightHidden;
          $rightFab.toggleClass("hidden");
        }
      }

      scope.shift = function(direction) {
        console.log("SHIFT");
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
