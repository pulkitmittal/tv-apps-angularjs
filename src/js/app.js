var xdk = angular.module('xdk', ['ngRoute', 'fm', 'ui.bootstrap']);

xdk.factory("utils", function () {
    return {
        elementInViewport: function (el) {
            var offsets = el.getBoundingClientRect();
            var bodyWidth = document.body.clientWidth;
            var bodyHeight = document.body.clientHeight;

            return (
                offsets.left >= 0 &&
                offsets.right < bodyWidth &&
                offsets.top >= 0 &&
                offsets.bottom < bodyHeight
            );
        }
    };
});

xdk.filter('skip', function(){
    return function(a,n) {
        if (!n) {
            return a;
        }
        var res = [];
        for (var i = 0; i < a.length; i+=n) {
            res.push(a[i]);
        }
        return res;
    };
});

xdk.filter('range', function(){
    return function(n) {
        var res = [];
        for (var i = 0; i < n; i++) {
            res.push(i);
        }
        return res;
    };
});

xdk.factory("itemsService", ['$http', function ($http) {
    var handleSuccess = function (response) {
            return response.data;
        },
        handleError = function (response) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        };

    return {
        getItems: function(type) {
            var request = $http({
                method: "get",
                url: "http://dev2.popcorn.intigral-i6.net/popcorn-api-rs-2.6/v1/rewind",
                params: {
                    apikey: "a29zbzV0YWsyMjE",
                    byCategory: type
                }
            });
            return request.then(handleSuccess, handleError);
        }
    };
}]);

xdk.controller('BodyCtrl', function (focusMouse, focusKeyboard) {
    focusKeyboard.enableArrowKeys();
});

xdk.controller('HeaderCtrl', function ($scope, $location) {
    $scope.items = [
        { text: "Home",     url: "/" },
        { text: "TV",       url: "/tv" },
        { text: "Movies",   url: "/movies" },
        { text: "Kids",     url: "/kids" },
        { text: "My List",  url: "/mylist" },
        { text: "History",  url: "/history" }
    ];
    $scope.isActive = function (item) {
        return $location.path() === item.url;
    };
});