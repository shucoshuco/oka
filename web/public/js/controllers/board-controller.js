(function(app) {
	app.controller('BoardController',
		['$scope', '$compile', '$timeout', '$window', 'GameApi', '$stateParams',
		function($scope, $compile, $timeout, $window, GameApi, $stateParams) {
			$scope.gameId = $stateParams.boardId;
			$scope.loading = true;

			let initialWidth = function() {
				let initialWidth = Math.min(screen.width * 0.7, screen.height * 0.9);
				initialWidth = Math.max(initialWidth, 340);
				return initialWidth - initialWidth * 0.05;
			};

			let timeoutId;

			let calculateBoardParameters = function(initialWidth, ncells) {
				let n1stCell = Math.floor(ncells / 15);
				let virtualCells = ncells + n1stCell + Math.floor(ncells / 10);

				// b^2 = w * h * n
				// h = 2w
				// b^2 = 2w^2 * n
				// w = sqrt(b^2/(2 * n)

				let cellWidth =
					Math.floor(
						Math.sqrt(
							Math.pow(initialWidth, 2) / (2 * virtualCells)));

				let cellHeight = 2 * cellWidth;

				let actualWidth = Math.sqrt(cellWidth * cellHeight * virtualCells);

				let nside = Math.ceil(actualWidth / cellWidth);

				let finalWidth = nside * cellWidth;

				return {
					width: finalWidth,
					n1stCell: n1stCell,
					cellWidth: cellWidth,
					cellHeight: cellHeight,
					nside: nside,
					fontSize: finalWidth * 0.7 / 600,
					left: Math.max(initialWidth - finalWidth, 0) / 2,
				};
			};

			let calculateState = function(cellWidth, cellHeight) {
				return {
					current: -1,
					values: [
						{
							movement: {x: 1, y: 0},
							size: {width: cellWidth, height: cellHeight},
							fixLast: {x: 0, y: 0},
							fixNext: {x: 0, y: -1},
							gap: 2,
							vertical: true,
						},
						{
							movement: {x: 0, y: -1},
							size: {width: cellHeight, height: cellWidth},
							fixLast: {x: 0, y: -1},
							fixNext: {x: -1, y: 0},
							gap: 0,
							vertical: false,
						},
						{
							movement: {x: -1, y: 0},
							size: {width: cellWidth, height: cellHeight},
							fixLast: {x: -1, y: 0},
							fixNext: {x: 0, y: 2},
							gap: 2,
							vertical: true,
						},
						{
							movement: {x: 0, y: 1},
							size: {width: cellHeight, height: cellWidth},
							fixLast: {x: 0, y: 0},
							fixNext: {x: 2, y: 0},
							gap: 0,
							vertical: false,
						},
					],
					next: function() {
						this.current++;
						if (this.current > 3) {
							this.current = 0;
						}
						return this.values[this.current];
					},
				};
			};

			let updateBoard = function(cells, lastCell, boardParameters) {
				let top = boardParameters.width - boardParameters.cellHeight;
				let left = 0;

				cells[0].top = top;
				cells[0].left = left;
				cells[0].vertical = false;
				cells[0].width =
					boardParameters.cellWidth * boardParameters.n1stCell;
				cells[0].height = boardParameters.cellHeight - 4;

				let perSide = boardParameters.nside;
				left += boardParameters.n1stCell * boardParameters.cellWidth;

				let state = calculateState(
						boardParameters.cellWidth,
						boardParameters.cellHeight
				);
				let step = state.next();
				let offset = boardParameters.n1stCell;

				lastCell.width = boardParameters.width;
				lastCell.height = boardParameters.width;

				for (let i = 1; i < cells.length; ) {
					while (offset++ < perSide && i < cells.length) {
						if (offset === perSide - 1) {
							top += step.fixLast.y * boardParameters.cellWidth;
							left += step.fixLast.x * boardParameters.cellWidth;
						}

						cells[i].top = top;
						cells[i].left = left;
						cells[i].vertical = step.vertical;
						cells[i].claz = step.vertical ? 'vertical' : 'horizontal';

						if (offset >= perSide - 1) {
							cells[i].corner = true;
							cells[i].rotation = offset === perSide - 1
								? state.current : state.current + 2;
							cells[i].width = boardParameters.cellHeight;
							cells[i].height = boardParameters.cellHeight;
						} else {
							cells[i].width = step.size.width;
							cells[i].height = step.size.height - 4;
							top += step.movement.y * boardParameters.cellWidth;
							left += step.movement.x * boardParameters.cellWidth;
						}
						i++;
					}
					if (i < cells.length) {
						perSide -= step.gap;
						top += step.fixNext.y * boardParameters.cellWidth;
						left += step.fixNext.x * boardParameters.cellWidth;
						step = state.next();
						offset = 0;
						if (state.current == 0) {
							lastCell.left = left;
							lastCell.width -= boardParameters.cellHeight;
						}
						if (state.current == 1) {
							lastCell.height -= boardParameters.cellHeight;
						}
						if (state.current == 2) {
							lastCell.width -= boardParameters.cellHeight;
						}
						if (state.current == 3) {
							lastCell.top = top;
							lastCell.height -= boardParameters.cellHeight;
						}
					}
				}
			};

			let createBoard = function(initialWidth, cells) {
				let boardParameters =
					calculateBoardParameters(initialWidth, cells.length,
												Math.floor(cells.length / 15));

				cells.forEach(function(cell) {
					cell.players = [];
					cell.level = cell.oka ? 0 : cell.level;
				});

				let lastCell = {};
				updateBoard(cells, lastCell, boardParameters);

				return {
					parameters: boardParameters,
					cells: cells,
					lastCell: lastCell,
				};
			};

			let initializeMovement = function(board, players) {
				let moving = false;
				let speed = 'fast';
				let speeds = {'slow': 800, 'medium': 570, 'fast': 350};

				let halfCell = function(vertical, rect) {
					return [
						{
							top: rect.top,
							left: rect.left,
							width: vertical ? rect.width : rect.width / 2,
							height: vertical ? rect.height / 2 : rect.height,
						},
						{
							top: vertical ? rect.top + rect.height / 2 : rect.top,
							left: vertical ? rect.left : rect.left + rect.width / 2,
							width: vertical ? rect.width : rect.width / 2,
							height: vertical ? rect.height / 2 : rect.height,
						},
					];
				};

				let calculateCenter = function(rect) {
					return {
						top: (2 * rect.top + rect.height) / 2,
						left: (2 * rect.left + rect.width) / 2,
					};
				};

				let halfTriangleCell = function(tr) {
					return [
						{
							p1: {x: tr.left, y: tr.top},
							p2: {x: tr.left + tr.width / 2, y: tr.top + tr.height / 2},
							p3: {x: tr.left, y: tr.top + tr.height},
						},
						{
							p1: {x: tr.left + tr.width / 2, y: tr.top + tr.height / 2},
							p2: {x: tr.left, y: tr.top + tr.height},
							p3: {x: tr.left + tr.width, y: tr.top + tr.height},
						},
					];
				};

				let calculateTriangleCenter = function(tr, cell) {
					let top = (tr.p1.y + tr.p2.y + tr.p3.y) / 3;
					let left = (tr.p1.x + tr.p2.x + tr.p3.x) / 3;

					let xCenter = cell.left + cell.width / 2;
					let yCenter = cell.top + cell.height / 2;
					for (i = 0; i < cell.rotation; i++) {
						let aux = top;
						top = -(left - xCenter) + yCenter;
						left = aux - yCenter + xCenter;
					}
					return {
						top: top,
						left: left,
					};
				};


				let innerCellOffset = function(nplayers, cell) {
					if (nplayers === 1) {
						return [calculateCenter(cell)];
					}
					let rects = halfCell(cell.vertical, cell);
					if (nplayers === 2) {
						return [
							calculateCenter(rects[0]),
							calculateCenter(rects[1]),
						];
					}
					let rects2 = halfCell(!cell.vertical, rects[1]);
					if (nplayers === 3) {
						return [
							calculateCenter(rects[0]),
							calculateCenter(rects2[0]),
							calculateCenter(rects2[1]),
						];
					}
					let rects4 = halfCell(cell.vertical, rects[0]);
					return [
						calculateCenter(rects4[0]),
						calculateCenter(rects4[1]),
						calculateCenter(rects2[0]),
						calculateCenter(rects2[1]),
					];
				};

				let innerCellTriangleOffset = function(nplayers, cell) {
					let tr = {
						p1: {x: cell.left, y: cell.top},
						p2: {x: cell.left + cell.width, y: cell.top + cell.height},
						p3: {x: cell.left, y: cell.top + cell.height},
					};
					if (nplayers === 1) {
						return [calculateTriangleCenter(tr, cell)];
					}
					let trs = halfTriangleCell(cell);
					if (nplayers === 2) {
						return [
							calculateTriangleCenter(trs[0], cell),
							calculateTriangleCenter(trs[1], cell),
						];
					}
					// TODO Add more players to corner cells
				};


				let updateCellPositions = function(cell) {
					if (cell.players) {
						let positions = cell.corner
							? innerCellTriangleOffset(cell.players.length, cell)
							: innerCellOffset(cell.players.length, cell);
						for (i = 0; i < cell.players.length; i++) {
							cell.players[i].boardPosition = cell.position;
							cell.players[i].top = positions[i].top;
							cell.players[i].left = positions[i].left;
						}
					}
				};

				let moveToPosition = function(player, position, callback) {
					moving = true;

					if (position === 0) {
						$timeout.cancel(timeoutId);
						moving = false;
						callback();
						return;
					}

					let currentCell = player.boardPosition;
					let nextCell = currentCell + 1;
					if (nextCell >= board.cells.length) {
						$timeout.cancel(timeoutId);
						moving = false;
						return;
					}

					let cell = board.cells[nextCell];
					cell.players = cell.players || [];
					cell.players.push(player);
					updateCellPositions(cell);

					cell = board.cells[currentCell];
					let index = cell.players.indexOf(player);
					if (index > -1) {
						cell.players.splice(index, 1);
						updateCellPositions(cell);
					}

					timeoutId = $timeout(function() {
						moveToPosition(player, position - 1, callback);
					}, speeds[speed]);
				};

				return {
					speed: speed,
					refresh: function() {
						board.cells.forEach(function(cell) {
							updateCellPositions(cell);
						});
					},
					advance: function(mov) {
						$scope.status.rolling = false;
						if (!moving) {
							let currentPosition = $scope.players[mov.turn].boardPosition;
							let cellsToMove =
								(mov.jump ? mov.jumpInfo.to : mov.to) - currentPosition;
							moveToPosition(
								$scope.players[mov.turn],
								cellsToMove,
								function() {
									$scope.board.cells[mov.player.position].selected = true;
								}
							);
							$scope.lastMovement = mov;
						}
					},
					updateCellPositions: updateCellPositions,
					nextTurn: function() {
						let changeTurn = function() {
							$scope.players.forEach(function(p) {
								p.turn = false;
							});
							$scope.players[$scope.lastMovement.turn].model
								= $scope.lastMovement.player;
							$scope.status = $scope.lastMovement.status;
							let nextTurn = $scope.status.turn;
							$scope.players[nextTurn].turn = true;
							$scope.players[nextTurn].model =
								$scope.status.players[nextTurn];
							$scope.status.rolling = true;
						};
						if ($scope.lastMovement && $scope.lastMovement.jump) {
							moveToPosition(
								$scope.players[$scope.lastMovement.turn],
								$scope.lastMovement.to - $scope.lastMovement.jumpInfo.to,
								changeTurn
							);
						} else {
							changeTurn();
						}
					},
				};
			};

/*			angular.element($window).bind('resize', function() {
				$scope.$apply(function() {
					$scope.board.parameters =
						calculateBoardParameters(initialWidth(), ncells, n1stCell);
					udpateBoard($scope.board.cells, $scope.board.parameters);
					$scope.movement.refresh();
				});
			});*/

			$scope.$on('$viewContentLoaded', function load(event) {
				let game = GameApi.get({id: $scope.gameId}, function success() {
					$scope.players = [];
					$scope.status = game.status;
					game.status.players.forEach(function(p) {
						$scope.players.push({
							boardPosition: p.position,
							model: p,
							visible: false,
						});
					});
					$scope.board = createBoard(initialWidth(), game.board);
					$scope.movement = initializeMovement($scope.board, $scope.players);
					$scope.advance = $scope.movement.advance;
					$scope.nextTurn = $scope.movement.nextTurn;
					$scope.players.forEach(function(player) {
						let cell = $scope.board.cells[player.model.position];
						cell.players.push(player);
						player.visible = true;
						$scope.movement.updateCellPositions(cell);
					});
					$scope.players[$scope.status.turn].turn = true;
					$scope.status.rolling = true;
					$scope.loading = false;
					$scope.minWidth = $scope.board.parameters.width;
					$scope.status.rolling = true;
				}, function error(error) {
					$scope.errorLoading = error;
					console.error('Error: ', error);
					$scope.loading = false;
				});
			});
		}]
	);
})(web);


