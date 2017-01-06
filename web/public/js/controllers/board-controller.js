(function(app) {
	app.controller('BoardController', ['$scope', '$compile', function($scope, $compile) {

		var availableWidth = window.innerWidth - window.innerWidth * 0.05, /*Math.min(window.innerWidth, window.innerHeight);*/
			ncells = 69,
			n1stCell = Math.floor(ncells / 10);

		$scope.board = (function(initialWidth, ncells, n1stCell) {

			var virtualCells = ncells + n1stCell + Math.floor(ncells / 10);

			// b^2 = w * h * n
			// h = 2w
			// b^2 = 2w^2 * n
			// w = sqrt(b^2/(2 * n)

			var cellWidth = Math.floor(Math.sqrt(Math.pow(initialWidth, 2) / (2 * virtualCells)));
			var cellHeight = 2 * cellWidth;

			var actualWidth = Math.sqrt(cellWidth * cellHeight * virtualCells);

			var nside = Math.ceil(actualWidth / cellWidth);

			var finalWidth = nside * cellWidth;

			return {
				width: finalWidth,
				ncells: ncells,
				nside: nside,
				fontSize: finalWidth * 0.7 / 600,
				cellWidth: cellWidth,
				cellHeight: cellHeight
			};

		})(availableWidth, ncells, n1stCell);

		var top = 360 + $scope.board.width - $scope.board.cellHeight;
		var left = 0;

		var state = (function(cellWidth, cellHeight) {
			return {
				current: -1,
				values: [
					{
						movement: {x: 1, y: 0},
						size: {width: cellWidth, height: cellHeight},
						fix: {x: -2, y: -1},
						gap: 2,
						claz: 'vertical'
					},
					{
						movement: {x: 0, y: -1},
						size: {width: cellHeight, height: cellWidth},
						fix: {x: -1, y: 1},
						gap: 0,
						claz: 'horizontal'
					},
					{
						movement: {x: -1, y: 0},
						size: {width: cellWidth, height: cellHeight},
						fix: {x: 1, y: 2},
						gap: 2,
						claz: 'vertical'
					},
					{
						movement: {x: 0, y: 1},
						size: {width: cellHeight, height: cellWidth},
						fix: {x: 2, y: -2},
						gap: 0,
						claz: 'horizontal'
					}
				],
				next: function() {
					this.current++;
					if (this.current > 3) {
						this.current = 0;
					}
					return this.values[this.current];
				}
			}
		})($scope.board.cellWidth, $scope.board.cellHeight);

		var step = state.next();

		$scope.cells = [];
		$scope.cells.push({number: 0, level: 1, top: top, left: left, width: $scope.board.cellWidth * n1stCell - 4, height: $scope.board.cellHeight - 4, claz: 'vertical'});

		var perSide = $scope.board.nside;
		var offset = n1stCell;
		left += offset * $scope.board.cellWidth;

		for (i = 0; i < ncells; i) {
			while (offset++ < perSide && i < ncells) {
				$scope.cells.push({number: i + 1, level: Math.floor(i / 15) + 1, top: top, left: left, width: step.size.width - 4, height: step.size.height - 4, claz: step.claz});
				top += step.movement.y * $scope.board.cellWidth;
				left += step.movement.x * $scope.board.cellWidth;
				i++;
			}
			//$scope.cells.push({top: top, left: left, width: 0, height: 0, claz: step.limits.last})
			perSide -= step.gap;
			offset = 0;
			top += step.fix.y * $scope.board.cellWidth;
			left += step.fix.x * $scope.board.cellWidth;
			step = state.next();
		}

	}]);
})(web);


