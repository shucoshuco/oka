(function(app) {
	app.controller('BoardController', 
		['$scope', '$compile', '$timeout', '$window', function($scope, $compile, $timeout, $window) {

		var availableWidth = $window.innerWidth - $window.innerWidth * 0.05, /* Math.min(window.innerWidth, window.innerHeight);*/
			ncells = 69,
			n1stCell = Math.floor(ncells / 15),
			timeoutId;

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

			var top = finalWidth - cellHeight;
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
							vertical: true
						},
						{
							movement: {x: 0, y: -1},
							size: {width: cellHeight, height: cellWidth},
							fix: {x: -1, y: 1},
							gap: 0,
							vertical: false
						},
						{
							movement: {x: -1, y: 0},
							size: {width: cellWidth, height: cellHeight},
							fix: {x: 1, y: 2},
							gap: 2,
							vertical: true
						},
						{
							movement: {x: 0, y: 1},
							size: {width: cellHeight, height: cellWidth},
							fix: {x: 2, y: -2},
							gap: 0,
							vertical: false
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
			})(cellWidth, cellHeight);

			var step = state.next();

			var cells = [];
			cells.push({number: 0, level: 1, top: top, left: left, width: cellWidth * n1stCell - 4, height: cellHeight - 4, vertical: false});

			var perSide = nside;
			var offset = n1stCell;
			left += offset * cellWidth;

			for (i = 0; i < ncells; i) {
				while (offset++ < perSide && i < ncells) {
					cells.push({number: i + 1, level: Math.floor(i / 15) + 1, top: top, left: left, width: step.size.width - 4, height: step.size.height - 4, vertical: step.vertical});
					top += step.movement.y * cellWidth;
					left += step.movement.x * cellWidth;
					i++;
				}
				perSide -= step.gap;
				offset = 0;
				top += step.fix.y * cellWidth;
				left += step.fix.x * cellWidth;
				step = state.next();
			}

			return {
				width: finalWidth,
				ncells: ncells,
				nside: nside,
				fontSize: finalWidth * 0.7 / 600,
				cellWidth: cellWidth,
				cellHeight: cellHeight,
				cells: cells
			};
		})(availableWidth, ncells, n1stCell);

		$scope.players = [
			{
				name: 'p1',
				gender: 'male',
				nitems: 5,
				position: 0
			},
			{
				name: 'p2',
				gender: 'female',
				nitems: 5,
				position: 0
			}
		];

		$scope.offset = 1;

		$scope.movement = (function(board, players) {

			var moving = false,
				speed = 'fast',
				speeds = {'slow': 800, 'medium': 570, 'fast': 350};

			var halfCell = function(vertical, rect) {
				return [
					{
						top: rect.top,
						left: rect.left,
						width: vertical ? rect.width : rect.width / 2,
						height: vertical ? rect.height / 2 : rect.height
					},
					{
						top: vertical ? rect.top + rect.height / 2 : rect.top,
						left: vertical ? rect.left : rect.left + rect.width / 2,
						width: vertical ? rect.width : rect.width / 2,
						height : vertical ? rect.height / 2 : rect.height
					}
				]
			}

			var calculateCenter = function(rect) {
				return {top: (2 * rect.top + rect.height) / 2, left: (2 * rect.left + rect.width) / 2};
			}

			var innerCellOffset = function(nplayers, cell) {
				if (nplayers === 1) {
					return [ calculateCenter(cell) ];
				}
				var rects = halfCell(cell.vertical, cell);
				if (nplayers === 2) {
					return [
						calculateCenter(rects[0]),
						calculateCenter(rects[1])
					];
				}
				var rects2 = halfCell(!cell.vertical, rects[1]);
				if (nplayers === 3) {
					return [
						calculateCenter(rects[0]),
						calculateCenter(rects2[0]),
						calculateCenter(rects2[1])
					];
				}
				var rects4 = halfCell(cell.vertical, rects[0]);
				return [
					calculateCenter(rects4[0]),
					calculateCenter(rects4[1]),
					calculateCenter(rects2[0]),
					calculateCenter(rects2[1])
				];
			};

			var updateCellPositions = function(cell) {
				var positions = innerCellOffset(cell.players.length, cell);
				for (i = 0; i < cell.players.length; i++) {
					cell.players[i].position = cell.number;
					cell.players[i].top = positions[i].top;
					cell.players[i].left = positions[i].left;
				}
			}

			var moveToPosition = function(player, position) {

				moving = true;

				if (position === 0) {
					$timeout.cancel(timeoutId);
					moving = false;
					board.cells[player.position].selected = true;
					return;
				}

				var currentCell = player.position;
				var nextCell = currentCell + 1;
				if (nextCell >= board.cells.length) {
					$timeout.cancel(timeoutId);
					moving = false;
					return;
				}

				var cell = board.cells[nextCell];
				cell.players = cell.players || new Array();
				cell.players.push(player);
				updateCellPositions(cell);

				cell = board.cells[currentCell];
				var index = cell.players.indexOf(player);
				if (index > -1) {
					cell.players.splice(index, 1);
					updateCellPositions(cell);
				}

				timeoutId = $timeout(function() {
					moveToPosition(player, position - 1);
				}, speeds[speed]);
			}

			board.cells[0].players = new Array();
			players.forEach(function(p) {
				board.cells[0].players.push(p);
			});

			updateCellPositions(board.cells[0]);

			var turn = 0;

			return {
				speed: speed,
				moveToPosition: moveToPosition,
				advance: function() {
					if (!moving) {
						moveToPosition($scope.players[turn], $scope.offset);
						turn = turn === 0 ? 1 : 0;
					}
				}
			}
		})($scope.board, $scope.players);
	}]);
})(web);


