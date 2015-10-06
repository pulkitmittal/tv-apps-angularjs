angular
.module('xdk')
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/carousels.html',
            controller: 'XDKCarouselController',
            resolve: {
                items: function (itemsService) {
                    return itemsService.getItems("movies");
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