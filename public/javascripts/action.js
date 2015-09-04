var app = angular.module("THSITLab", [
    'ngMaterial',
    'ngMessages'
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

app.controller('AppCtrl', ['$scope', '$timeout', '$http', '$mdSidenav', '$mdDialog', function($scope,$timeout,$http,$mdSidenav,$mdDialog) {
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

  $scope.loggedIn = false;

  $scope.user = null;

  $scope.openProject = function(url) {
    console.log("pretend to open: "+url);
  }

  $scope.openSetting = function() {
    console.log("pretend to open the setting page");
  }

  $scope.openProfile = function() {
    console.log("pretend to open the profile page");
  }

  $scope.openAbout = function() {
    console.log("pretend to open the about dialog");
  }

  var doLogin = function(credential, callback) {
    $http.post('/user/login', credential).
      success(function(data, status, headers, config) {
        callback(data);
      });
  }

  var doRegister = function(credential, callback) {
    $http.post('/user/register', credential).
      success(function(data, status, headers, config) {
        callback(data);
      })
  }

  $scope.userForm = function(e) {
    $mdDialog.show({
      clickOutsideToClode: true,
      controller: userFormController,
      templateUrl: '/tmpl/static/user_form.tmpl.html',
      targetEvent: e,
      locals: {doLogin: doLogin, doRegister: doRegister}
    }).then(function(user) {
      console.log(user);
      $scope.user = user;
      $scope.loggedIn = true;
      $mdSidenav("main").open();
    }, function() {});
  };
}]).directive("expandable", ['$http','$compile', '$timeout', function($http,$compile, $timeout) {
  return {
    restrict: 'C',
    link: function(scope,element,attr) {
      var callback = function(path,title) {
        // Push history
        history.pushState({
            currentPath: path,
            currentTitle: title
          },
          "", // Ignore this parameter for right now
          "/"+path);

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

        var $newCard = $("<md-card>").addClass("expandable").addClass("overlap-card");
        $("<md-content>").addClass("md-hue-1").addClass("md-default-theme").addClass("expanding-mask").appendTo($newCard);

        $newCard.appendTo(".displayFrame");

        $newCard.css("width",cardWidth+"px");
        $newCard.css("height",cardHeight+"px");
        $newCard.css("top",cardOffset.top);
        $newCard.css("left",cardOffset.left);
        $newCard.addClass("expanding").addClass("md-default-theme");
        $newCard.addClass("no-shadow");

        window.getComputedStyle($newCard[0]).opacity; //Get the style computed
        $newCard.css("opacity", "1");

        $card.addClass("md-whiteframe-z4");

        $timeout(function() {
          var targetHeight = $(".displayFrame").height();
          var targetWidth = $(".displayFrame").width();
          var heightRatio = targetHeight/cardHeight;
          var widthRatio = targetWidth/cardWidth;

          var offset = $newCard.offset();
          var targetOffset = $(".displayFrame").offset();

          $card.addClass("hidden");
          $newCard.removeClass("no-shadow");
          $newCard.addClass("expanding-colored");
          $newCard.addClass("md-whiteframe-z4");
          $newCard.css("transform", "matrix(" + widthRatio + ", 0, 0, " + heightRatio + ", " + ( - offset.left + targetOffset.left ) + ", " + ( - offset.top + targetOffset.top ) + ")");
        },500);

        $timeout(function() {
          /*
           * FIXME:
           * If the overlap card keeps the transform
           * Then it takes extraordinaty time to paint the page ( like 800ms )
           * So I'm reseting the transform here and makes the overlap fills the page
           */

          var targetHeight = $(".displayFrame").height();
          var targetWidth = $(".displayFrame").width();
          var targetOffset = $(".displayFrame").offset();

          var $overlap = $(".overlap-card");
          $overlap.addClass("finished");
          $overlap.css("transform", "matrix(1, 0, 0, 1, 0, 0)");
          $overlap.height(targetHeight);
          $overlap.width(targetWidth);

          // Don't use jQuery.offset(coordinate) here, which sets the offset relative to its parent element ( and is in conflict with the document, I don't know why )
          $overlap.css("top", targetOffset.top + "px");
          $overlap.css("left", targetOffset.left + "px");

          var bodyScope=angular.element("body").scope();

          bodyScope.pageTitle = attr.newTitle;
          bodyScope.contentPath = attr.newContent;
          bodyScope.contentUpdated = function() {callback(attr.newContent,attr.newTitle)};

          bodyScope.$apply();
        },1000);
      });
    }
  }
}]).directive("slider", ['$timeout', function($timeout) {
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

      $timeout(function() {
        items = $element.find("[ng-transclude] > md-card");
        itemCount = items.size();
        contentWidth = itemCount * 160-32;
        wrapperWidth = $element.width();
        update();
      },0);
    }
  }
}]).directive("contentInclude", ["$http", "$compile", "$timeout", function($http, $compile, $timeout) {
  return {
    restrict: 'A',
    scope: {
      callback: '&contentCallback',
      path: '@contentInclude'
    },
    link: function(scope,elem,attrs) {
      scope.$watch("path", function(path) {
        console.log("[Lab] Loading Content: "+path);
        if((!path) || path== '') return;
        $http({method: 'GET', url: '/content/'+path, cache: true}).success(function(data) {
          var bodyScope = angular.element("body").scope();
            
          elem.html($compile(data)(bodyScope));

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

      $(window).bind("popstate", function(e) {
        var state = history.state;
        if(state == null) { // To the front page
          state = {
            currentPath: "home",
            currentTitle: "主页"
          };
        }
        var bodyScope = angular.element("body").scope();
        if(state.currentPath) {
          var overlap = $("<md-content>").addClass("md-default-theme").addClass("md-hue-1").addClass("history-overlap");

          bodyScope.contentUpdated = function() {
            overlap.removeClass("active");
            $timeout(function() {
              overlap.remove();
            },200);
          }

          $timeout(function() {
            bodyScope.contentPath = state.currentPath;
          },200);

          overlap.appendTo(".displayFrame");

          $timeout(function() {
            overlap.addClass("active");
          },0);
        }
        if(state.currentTitle) bodyScope.pageTitle = state.currentTitle;
        bodyScope.$apply();
      });
    }
  };
}]);

function userFormController($scope, $mdDialog, doLogin, doRegister) {
  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.proceed = function() {
    // Check if any field is empty
    // TODO: link to required event
    var continueFlag = true;
    if(!$scope.user.name || $scope.user.name == "") {
      continueFlag = false;
      $scope.error.name = true;
      $scope.error.map["empty-name"]=true;
    }

    if(!$scope.user.passwd || $scope.user.napasswd == "") {
      continueFlag = false;
      $scope.error.passwd = true;
      $scope.error.map["empty-passwd"]=true;
    }

    if(!continueFlag) return;

    if($scope.isRegister) {
      doRegister($scope.user, function(data) {
        if(data.success) {
          $mdDialog.hide(data.user);
        } else {
          $scope.error = data.error;
        }
      });
    } else {
      doLogin($scope.user, function(data) {
        if(data.success) {
          $mdDialog.hide(data.user);
        } else {
          $scope.error = data.error;
        }
      });
    }
  }

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

  $scope.error = {
    name: false,
    passwd: false,
    map: {
      "empty-name": false,
      "empty-passwd": false,
      "invalid-credentials": false
    }
  }
}
