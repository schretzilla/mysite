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
        $scope.scoreString = "N/A";
        $scope.curUserId=userId;
        //$scope.availableQuizBtnClass = "active";
        getCurQuiz(quizId);
        buildQuizAndResults(quizId);
        getQuestionList(quizId);
        getQuizScores(quizId, userId);
    };

    getCurQuiz = function(quizId) {
        getQuiz(quizId)
            .then(function(response) {
                $scope.curQuiz= response.data;
            }, function(error) {
                alert("Unable to load quiz " + error.message);
            });
    };

    //TODO: DELETE
    buildQuizAndResults = function(quizId) {
        getQuestionList(quizId);
        getQuizScores(quizId, $scope.curUserId);
    };

    getQuizScores = function(quizId, userId){
        getScores(quizId, userId)
            .then( function(response) {
                $scope.scores=response.data;
                //Store the current results of the quiz currently being viewed
                $scope.setCurResults($scope.scores[$scope.scores.length - 1]);
//                $scope.curQuizGuesses = $scope.curResults.question_attempts;
            }, function(error){
                alert("unable to get user's scores" + error.message);
            });
    };

    /*
    * Set scores of attempt user is currently looking at
    */
    $scope.setCurResults = function(results){
        if(results != null){
            $scope.curResults = results; //TODO MAKE THIS A DICTIONARY
            //listToDictionary(results, 'choice');
            $scope.scoreString = results.correct + '/'+(results.correct+results.incorrect);
            $scope.curQuizGuesses = $scope.curResults.question_attempts;            
        }

    };

    /*listToDictionary = function(list, key){
        angular.forEac(list, function())
    };*/

    //TODO: This can be optomized to by sorting lists
    //TODO: This should be used to decorate each question object with attributes
    //loop through all the users guesses find the quiz and return if answer is correct
    $scope.isCorrect = function(question){
        for(i in $scope.curQuizGuesses){
             guess = $scope.curQuizGuesses[i];
            //question found
            if(guess.question == question.id ){
                if(guess.choice == question.answer){
                    return true;
                }else {
                    question.correct = false;
                    return false;
                }
            }
        }
    };

    //tODO: Super inefficient but since question size is dynamic the answer isnt trivial, Possible use for dictionary
    $scope.questionChosen = function(question, choice) {
        //Handle Async latiency issue
        if($scope.curResults != null){
            for(i in $scope.curResults.question_attempts){
                curAttempt = $scope.curResults.question_attempts[i];
                if(curAttempt.question == question.id){
                    if(curAttempt.choice == choice.id){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            }
        }
    };

    getQuestionList = function(quizId) {
        getQuestions(quizId)
            .then(function(response) {
                $scope.questionList = response.data;
                //Loop through all questions and attach attributes correct and chosen
                for( i in $scope.questionList){
                    var curQuestion = $scope.questionList[i];
                   // isCorrect(curQuestion); //TODO: should no longer be needed,
                }
            }, function(error) {
                alert("Unable to load questions " + error.message);
            });
    };

//TODO: Create Service Layer
    //TODO: not needed
    //Get available quizzes for the user
    availableQuizzes = function(userId){
        return ($http.get('/dynoquiz/api/user/'+userId+'/availablequiz/'));
    };

    getScores = function(quizId, userId){
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/user/'+userId+'/score/'))
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