var quizDetail = angular.module('quizDetail',[]);

quizDetail.config(function($interpolateProvider){
    //allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
quizDetail.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


quizDetail.controller('QuizDetailCtrl', function QuizDetailCtrl($scope, $log, $http){



        $scope.loadPage = function(curQuizId) {
            $scope.quizId = curQuizId;
            $scope.choiceList = [];
            choice = {
                id:$scope.choiceList.length,
                text:""
            };
            $scope.choiceList.push(choice);

        };

        /**
        * dynamicList: Appends to objectList if specified attribute of last element is not null
        * Args:
        *   objectList: list of objects you are building
        *   attr: Attribute used to determine if list should be appended
        */
        $scope.dynamicList = function(objectList, attr) {
            //Add new input if input above has been used
            listLength = objectList.length;
            attribute = objectList[(listLength-1)][attr];
            if ( attribute != ""){
                newObject = {
                    id:objectList.length,
                };
                newObject[attr] = "";
                objectList.push(newObject);
            } else if (objectList[(listLength-2)][attr] == ""){
                //Drop last object if 2nd to last object attr is ""
                objectList.pop();
            }
        };


});