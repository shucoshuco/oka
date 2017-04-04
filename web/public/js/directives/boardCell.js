(function(app) {
	app.directive('boardCell', ['$mdDialog', 'cellImageFilter', 'GameApi',
	function($mdDialog, cellImageFilter, GameApi) {
		return {
			templateUrl: 'partials/directives/cell-template.html',
			restrict: 'E',
			replace: true,
			scope: {
				cell: '=',
				completed: '&',
			},
			link: function($scope, element, attrs, controller) {
				if ($scope.cell.corner) {
					element.html('<canvas></canvas>'
									+ '<span class="number rotation-'
									+ $scope.cell.rotation
									+ '" ng-click="showAdvanced($event)">'
									+ $scope.cell.position
									+ '</span>');

					let c = element.children()[0];
					let image = document.createElement('img');
					image.src = cellImageFilter($scope.cell);

					let draw = function() {
						let size = Math.max($scope.cell.width, $scope.cell.height);
						c.width = size;
						c.height = size;
						let context = c.getContext('2d');
						context.clearRect(0, 0, size, size);
						let radius = size / 2;
						let cPoints = [
							{x: -radius, y: -radius},
							{x: -radius, y: radius},
							{x: radius, y: radius},
							{x: -radius + 2, y: -radius + 9},
							{x: -radius + 2, y: radius - 9},
							{x: -radius + 2, y: radius - 2},
							{x: -radius + 9, y: radius - 2},
							{x: radius - 9, y: radius - 2},
							{x: radius - 4, y: radius - 2},
							{x: radius - 9, y: radius - 5},
							{x: -radius + 5, y: -radius + 9},
							{x: -radius + 2, y: -radius + 4},
						];

						for (i = 0; i < $scope.cell.rotation; i++) {
							for (j = 0; j < cPoints.length; j++) {
								cPoints[j] = {x: cPoints[j].y, y: -cPoints[j].x};
							}
						}

						for (i = 0; i < cPoints.length; i++) {
							cPoints[i] = {
								x: cPoints[i].x + radius,
								y: cPoints[i].y + radius,
							};
						}

						let levels = [
							'#000000', '#FFFFFF', '#FFDAD9',
							'#FF6D69', '#CC5754', '#AC1D1E',
						];

						context.beginPath();
						context.moveTo(cPoints[0].x, cPoints[0].y);
						context.lineTo(cPoints[1].x, cPoints[1].y);
						context.lineTo(cPoints[2].x, cPoints[2].y);
						context.closePath();

						context.save();
						context.beginPath();
						context.moveTo(cPoints[3].x, cPoints[3].y);
						context.lineTo(cPoints[4].x, cPoints[4].y);
						context.quadraticCurveTo(cPoints[5].x, cPoints[5].y,
												cPoints[6].x, cPoints[6].y);
						context.lineTo(cPoints[7].x, cPoints[7].y);
						context.quadraticCurveTo(cPoints[8].x, cPoints[8].y,
												cPoints[9].x, cPoints[9].y);
						context.lineTo(cPoints[10].x, cPoints[10].y);
						context.quadraticCurveTo(cPoints[11].x, cPoints[11].y,
												cPoints[3].x, cPoints[3].y);
						context.closePath();
						context.fillStyle = levels[$scope.cell.level];
						context.fill();
						context.clip();

						context.drawImage(image, 0, 0, size, size);
					};

					image.onload = draw;

					$scope.$watch('cell.width', function() {
						draw();
					});

					$scope.$watch('cell.height', function() {
						draw();
					});
				};

				$scope.$watch('cell.selected', function(value) {
					console.log('Watch cell.selected: ' + value);
					if (value) {
						let event = new CustomEvent('tap', {
													'view': window,
													'bubbles': true,
													'cancelable': true,
						});
						element.bind('tap', function(ev) {
							console.log('Inside click listener...');
							let id = $scope.cell.oka ? 'oka' : $scope.cell.id;
							let cellDetails = GameApi.cell({id: id}, function() {
								$scope.showAdvanced(ev, cellDetails, $scope.cell.position);
							});
						});
						console.log('Dispatching event on element ' + element);
						element[0].dispatchEvent(event);
						element.unbind('tap');
						$scope.cell.selected = false;
					}
				});

				$scope.showAdvanced = function(ev, cell, position) {
					console.log('In showAdvanced');
					$mdDialog.show({
						controller: DialogController,
						templateUrl: 'partials/action-partial.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						// Only for -xs, -sm breakpoints.
						fullscreen: $scope.customFullscreen,
						locals: {
							cell: cell,
							position: position,
						},
					})
					.then(function() {
						$scope.completed({});
					});
				};

				/**
				 * Controller used to manage dialgos.
				 * @param {Object} $scope Scope of the controler
				 * @param {Object} $mdDialog Injection of $mdDialog object
				 * @param {Object} cell Cell selected
				 * @param {Object} position Cell position
				 */
				function DialogController($scope, $mdDialog, cell, position) {
					console.log('In DialogController');
					$scope.cell = cell;
					$scope.position = position;

					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.done = function() {
						$mdDialog.hide();
					};
				}
			},
		};
	}]);
})(web);
