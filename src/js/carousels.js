angular
.module('xdk')
.controller('XDKCarouselController', function ($scope, items) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;

    var slides = $scope.slides = [];

    $scope.addSlide = function(index) {
        var item = items.entries[index];
        if (!item || !item.images || !item.images.length) {
            return;
        }
        for (var j=0; j<item.images.length; j++) {
            var image = item.images[j];
            if (image.type === "cover") {
                slides.push({
                    image: "http://cdn.static.intigral.net/imagizer/800x450/"+image.url,
                    text : item.title
                });
            }
        }
    };

    for (var i=0; i<4; i++) {
        $scope.addSlide(i);
    }
});

angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/carousel/carousel.html",
    "<div focus-group ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\" ng-swipe-right=\"prev()\" ng-swipe-left=\"next()\">\n" +
    "    <ol class=\"carousel-indicators\" ng-show=\"slides.length > 1\">\n" +
    "        <li focus-index=\"{{$index+1}}\" ng-repeat=\"slide in slides | orderBy:indexOfSlide track by $index\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li>\n" +
    "    </ol>\n" +
    "    <div class=\"carousel-inner\" ng-transclude></div>\n" +
    "    <a focus-index=\"{{slides.length+1}}\" class=\"left carousel-control\" ng-click=\"prev()\" ng-show=\"slides.length > 1\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>\n" +
    "    <a focus-index=\"{{slides.length+2}}\" class=\"right carousel-control\" ng-click=\"next()\" ng-show=\"slides.length > 1\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
    "</div>\n" +
    "");
}]);