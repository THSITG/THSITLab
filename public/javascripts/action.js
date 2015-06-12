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

  $(document).ready(function() {
    $scope.pageTitle = "主页";
    $scope.contentPath = "home";
    $scope.$apply();
  });

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
}).directive("expandable", ['$http','$compile', '$timeout', function($http,$compile, $timeout) {
  return {
    restrict: 'C',
    link: function(scope,element,attr) {
      var callback = function() {
        $(".overlap-card").css("opacity",0);
        $timeout(function() {
          $(".overlap-card").remove();
        }, 500, false);
      }

      $(element).click(function(e) {
        var $card = $(this);
        var cardOffset = $card.offset();
        var cardWidth = $card.width();
        var cardHeight = $card.height();

        console.log(cardOffset);

        var $newCard = $("<md-card>").addClass("expandable").addClass("overlap-card");

        $newCard.appendTo(".displayFrame");

        $newCard.css("width",cardWidth+"px");
        $newCard.css("height",cardHeight+"px");
        $newCard.css("top",cardOffset.top);
        $newCard.css("left",cardOffset.left);
        $newCard.addClass("expanding").addClass("md-default-theme");
        window.setTimeout(function() {
          $newCard.css("opacity", "1");
        },0);

        $card.addClass("md-whiteframe-z4");

        window.setTimeout(function() {
          $card.addClass("hidden");
          $newCard.addClass("md-hue-1");
          $newCard.addClass("md-whiteframe-z4");
          $newCard.css("width","100%");
          $newCard.css("height","100%");
          $newCard.css("top","0");
          $newCard.css("left","0");
          
        },500);

        window.setTimeout(function() {
          var bodyScope=angular.element("body").scope();
          bodyScope.pageTitle = attr.newTitle;
          bodyScope.contentPath = attr.newContent;
          bodyScope.contentUpdated = callback;

          bodyScope.$apply();
        },1000);
      });
    }
  }
}]).directive("slider", function() {
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

      window.setTimeout(function() {
        items = $element.find("[ng-transclude] > md-card");
        itemCount = items.size();
        contentWidth = itemCount * 160-32;
        wrapperWidth = $element.width();
        update();
      },0);
    }
  }
}).directive("contentInclude", ["$http", "$compile", function($http, $compile) {
  return {
    restrict: 'A',
    scope: {
      callback: '&contentCallback',
      url: '@contentInclude'
    },
    link: function(scope,elem,attrs) {
      window.setInterval(function() {
        console.log(scope.url);
      },1000);
      scope.$watch("url", function(url) {
        console.log("[Lab] Loading Content: "+url);
        if(!url) return;
        $http({method: 'GET', url: url, cache: true}).success(function(data) {
          elem.html($compile(data)(angular.element("body").scope()));

          try {
            scope.callback();
          } catch(e) {
            console.error("[Lab] Callback Failed:");
            console.error(e);
          }
        }).error(function(error) {
          //TODO: process error
        });
      },true);
    }
  };
}]);

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
