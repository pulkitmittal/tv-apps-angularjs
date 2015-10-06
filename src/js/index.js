var xdk = angular.module('xdk', ['ngRoute', 'fm']);

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

xdk.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/grids.html',
            controller: 'GridController',
            resolve: {
                items: function (itemsService) {
                    return itemsService.getItems("movies");
                },
                gridProperties: function () {
                    return {};
                }
            }
        })
        .when('/tv', {
            templateUrl: 'partials/grids.html',
            controller: 'GridController',
            resolve: {
                items: function (itemsService) {
                    return itemsService.getItems("movies");
                },
                gridProperties: function () {
                    return {
                        rows: 2,
                        itemAttr: {
                            type: "cover",
                            width: 350,
                            height: 196
                        }
                    };
                }
            }
        })
        .when('/movies', {
            templateUrl: 'partials/grids.html',
            controller: 'GridController',
            resolve: {
                items: function (itemsService) {
                    return itemsService.getItems("featured");
                },
                gridProperties: function () {
                    return {};
                }
            }
        })
        .when('/kids', {
            templateUrl: 'partials/grids.html',
            controller: 'GridController',
            resolve: {
                items: function (itemsService) {
                    return itemsService.getItems("kids");
                },
                gridProperties: function () {
                    return {};
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}]);

xdk.controller('BodyCtrl', function (focusMouse, focusKeyboard) {
    focusKeyboard.enableArrowKeys();
})
.controller('HeaderCtrl', function ($scope, $location) {
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
})
.controller('GridController', function ($scope, utils, items, gridProperties) {
    var itemAttr    = gridProperties.itemAttr || {},
        itemWidth   = itemAttr.width || 300,
        itemHeight  = itemAttr.height || 450,
        itemType    = itemAttr.type || "poster",
        itemPadding = gridProperties.padding || 10,
        rawItems    = items.entries || [],
        startIndex  = 0,
        endIndex    = 0,
        batchSize   = rawItems.length,
        frontBoundary = 1,
        endBoundary   = 1;

    $scope.orientation = gridProperties.orientation || "vertical";
    $scope.invertOrientation = $scope.orientation === "vertical" ? "horizontal" : "vertical";
    $scope.rows = gridProperties.rows || 1;
    $scope.items = [];

    var loadItems = function (start, batchSize) {
        $scope.items = [];
        start     = start || 0;
        batchSize = batchSize * $scope.rows;

        startIndex = start;
        for (var i=start; i<rawItems.length && i<start+batchSize; i++) {
            var item = rawItems[i];
            for (var j=0; j<item.images.length; j++) {
                var image = item.images[j];
                if (image.type === itemType) {
                    if (!image._processed) {
                        image.width = itemWidth;
                        image.height = itemHeight;
                        image.url = "http://cdn.static.intigral.net/imagizer/"+itemWidth+"x"+itemHeight+"/"+image.url;
                    }
                    image._processed = true;
                    $scope.items.push(image);
                }
            }
            endIndex = Math.floor(i/$scope.rows);
        }

        $scope.gridStyle = {
            'width': (($scope.items.length / $scope.rows) + 1) * (itemWidth + itemPadding * 2) + 'px',
            'left': itemPadding * 2 + 'px'
        };
    };

    $scope.gridItemStyle = {
        'float': 'left',
        'padding': itemPadding + 'px',
        'width': itemWidth + itemPadding * 2 + 'px'
    };

    $scope.scrollInView = function (evt, index) {
        /*if (endIndex - index <= endBoundary) {
            loadItems(endIndex - endBoundary - frontBoundary, batchSize);
        }

        if (startIndex - index <= frontBoundary) {
            loadItems(startIndex - frontBoundary, batchSize);
        }*/

        var selItem = evt.target,
            gridEl  = selItem.parentElement.parentElement;

        if (utils.elementInViewport(selItem)) {
            return;
        }

        gridEl.style.left = itemPadding * 2 + selItem.offsetLeft * -1 + "px";
    };

    loadItems(startIndex, batchSize);
});