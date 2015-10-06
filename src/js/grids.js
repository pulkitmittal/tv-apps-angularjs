angular
.module('xdk')
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