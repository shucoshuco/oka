(function(app) {
	app.directive('dice', ['$timeout', 'GameApi', function($timeout, GameApi) {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/dice.html',
			replace: true,
			scope: {
				gameId: '=',
				status: '=',
				advance: '&',
			},
			link: function($scope, element, attrs, controller) {
				$scope.roll = function() {
					element.removeClass('rolling');
					element.addClass('drop');
					element.unbind('click');
					$timeout(function() {
						let mov = GameApi.rollDice({id: $scope.gameId}, function() {
							element.removeClass('drop');
							switch(mov.dice) {
								case 1: element.addClass('one'); break;
								case 2: element.addClass('two'); break;
								case 3: element.addClass('three'); break;
								case 4: element.addClass('four'); break;
								case 5: element.addClass('five'); break;
								case 6: element.addClass('six'); break;
							}
							$timeout(function() {
								$scope.advance({mov: mov});
								element.addClass('hidden');
								element.removeClass('one');
								element.removeClass('two');
								element.removeClass('three');
								element.removeClass('four');
								element.removeClass('five');
								element.removeClass('six');
							}, 2000);
						});
					}, 2000);
				};

				$scope.$watch('status.rolling', function(value) {
					if (value) {
						$scope.drop = false;
						element.removeClass('hidden');
						element.addClass('rolling');
						element.bind('click', $scope.roll);
						$scope.status.rolling = false;
					}
				});
			},
		};
	}]);
})(web);
