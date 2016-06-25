var quizResults = angular.module('quizResults',[]);

quizResults.config(function($interpolateProvider){
	//allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
quizResults.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


quizResults.controller('QuizResultsCtrl', function QuizResultsCtrl($scope, $log, $http){
    //On page load
    $scope.loadPage = function(userId, quizId) {
        $scope.curUserId=userId;
        $scope.availableQuizBtnClass = "active";
        getQuestionList(quizId);
        getCurQuiz(quizId);
    };

    getQuestionList = function(quizId) {
        getQuestions(quizId)
            .then( function(response) {
                $scope.questionList = response.data;
            }, function(error) {
                alert("Unable to load questions " + error.message);
            });
    };

    getCurQuiz = function(quizId) {
        getQuiz(quizId)
            .then(function(response) {
                $scope.curQuiz= response.data;
            }, function(error) {
                alert("Unable to load quiz " + error.message);
            });

    };

//TODO: Create Service Layer
    //Get available quizzes for the user
    availableQuizzes = function(userId){
        return ($http.get('/dynoquiz/api/user/'+userId+'/availablequiz/'));
    };

    getQuiz = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/'));
    };

    //Get Quiz
    getQuiz = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/'));
    };

    // Get Questions List
    getQuestions = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/question') );
    };



}); //End QuizResults controller