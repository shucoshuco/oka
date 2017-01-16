(function(app) {
	app.directive('boardCell', ['$mdDialog', function($mdDialog) {
		return {
			templateUrl: 'partials/directives/cell-template.html',
			restrict: 'E',
			replace: true,
			scope: {
				cell: '=',
			},
			link: function($scope, element, attrs, controller) {
				if ($scope.cell.corner) {
					element.html('<canvas></canvas>'
									+ '<span class="number rotation-'
									+ $scope.cell.rotation
									+ '" ng-click="showAdvanced($event)">'
									+ $scope.cell.number
									+ '</span>');

					let c = element.children()[0];
					let image = document.createElement('img');
					image.src = '/public/images/cell.jpeg';

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
							'#FFFFFF', '#86E25E', '#6DDB3E',
							'#56D51F', '#0A6400',
						];

						context.beginPath();
						context.moveTo(cPoints[0].x, cPoints[0].y);
						context.lineTo(cPoints[1].x, cPoints[1].y);
						context.lineTo(cPoints[2].x, cPoints[2].y);
						context.closePath();
						context.fillStyle = levels[$scope.cell.level - 1];
						context.fill();

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
						context.clip();

						context.drawImage(image, -size / 2, 0, size * 300 / 168, size);
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
					if (value) {
						let event = new MouseEvent('click', {
													'view': window,
													'bubbles': true,
													'cancelable': true,
						});
						element.bind('click', function(ev) {
							$scope.showAdvanced(ev);
						});
						element[0].dispatchEvent(event);
						element.unbind('click');
						$scope.cell.selected = false;
					}
				});

				$scope.showAdvanced = function(ev) {
					$mdDialog.show({
						controller: DialogController,
						templateUrl: 'partials/action-partial.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						// Only for -xs, -sm breakpoints.
						fullscreen: $scope.customFullscreen,
					})
					.then(function(answer) {
						$scope.status =
							'You said the information was "' + answer + '".';
					}, function() {
						$scope.status = 'You cancelled the dialog.';
					});
				};

				/**
				 * Controller used to manage dialgos.
				 * @param {Object} $scope Scope of the controler
				 * @param {Object} $mdDialog Injection of $mdDialog object
				 */
				function DialogController($scope, $mdDialog) {
					$scope.hide = function() {
						$mdDialog.hide();
						$scope.cell.selected = false;
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
						$scope.cell.selected = false;
					};

					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
						$scope.cell.selected = false;
					};
				}
			},
		};
	}]);
})(web);
