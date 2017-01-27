(function(app) {
	app.directive('playerInfo', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/player-info.html',
			scope: {
				player: '=',
				advance: '&',
			},
			link: function($scope, element, attrs, controller) {
				$scope.getNumber = function(num) {
					return num >= 0 ? new Array(num) : [];
				};

				$scope.$watch('player.turn', function(value) {
					if (value) {
						element.addClass('turn');
					} else {
						element.removeClass('turn');
					}
				});
			},
		};
	});
})(web);
