(function(app) {
	app.directive('boardCell', ['$mdDialog', function($mdDialog) {
		return {
			templateUrl: 'partials/directives/cell-template.html',
			restrict: 'E',
			replace: true,
			scope: {
				cell: '='
			},
			link: function($scope, element, attrs, controller) {

				$scope.$watch('cell.selected', function(value) {
					if (value) {
						var event = new MouseEvent('click', {
													'view': window,
    												'bubbles': true,
    												'cancelable': true
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
						clickOutsideToClose:true,
						fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
					})
					.then(function(answer) {
						$scope.status = 'You said the information was "' + answer + '".';
					}, function() {
						$scope.status = 'You cancelled the dialog.';
					});
				};

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
			}
		};
	}]);
})(web);
