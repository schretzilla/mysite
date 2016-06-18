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

    /*
    * LOAD
    */
    //TODO: THIS ISNT NEEDED
    //TODO: Get choices should return a value
   /* $scope.getChoices = function(questionId) {
        $http.get('/dynoquiz/api/question/'+questionId+'/choice').then(function(response) {
             $scope.choices = response.data;
             focusedQuestion.choices=$scope.choices;
        });
    };*/

    /*
    * Add new question and its choices to the DB
    */
    $scope.addQuestion = function(){
        question = questionObj($scope.quizId, $scope.questionText);

        postQuestion(question)
            .then(function (response) {
                //Append to question list
                question = response.data;
                //TODO: Change this to questionList or change choiceList to choices
                $scope.questions.push(question);

                //Post Choices
                angular.forEach($scope.choiceList, function(choice, key){
                    postNewChoice(question, choice.text);
                });

                //clean form
                $scope.questionText = "";
                $scope.choiceList=[choiceObj(1,"")];
            }, function(error) {
                alert ("Unable to post question" + error.message);
            });

    };

    postNewChoice = function(question, choiceText) {
        //Only post non empty choices
        if (choiceText != ""){
            var choice = {
                'question':question.id,
                'choice_text':choiceText,
                'votes':0,
            };

            postChoice(choice)
                .then(function (response) {
                    //Append choice to questions list
                    choice = response.data;
                    question.choices.push(choice);
                }, function(error) {
                    alert("Unable to post choice " + error.message);
                });
        }
    };

    // Add new choice btn
    $scope.addChoice = function(question, choiceText) {
        postNewChoice(question, choiceText);
        //clear new choice input
        question.newChoice = "";
    };

    //Delete choice and update choice list
    $scope.removeChoice = function(choiceIndex, choice, choices) {
        deleteChoice(choice)
            .then(function (response) {
                //remove choice from choice list
                choices.splice(choiceIndex,1);
            }, function(error) {
                alert("Unable to delete choice " + error.message);
            });
    };


    //Save focused text's value before it changes
    $scope.persistCurText = function(curText) {
        //TODO: rename curText if it doesn't make sense
        $scope.curText = curText;
    };

    /*
    * Update Choice on deselect
    */
    $scope.updateChoice = function(choice) {
        //Check if the choice is new for the question
        /*if(choice.hasOwnProperty('new'))
        {
            alert("This is new");
            postChoice(choice)
                .then(function (response) {

                });
            //Add choice
            //add new choice list


        }*/
        //For existing choices detect if choice has been edited
        if (choice.choice_text != "" && choice.choice_text != $scope.curText)
        {
            updateChoice(choice);
        }
        $scope.formStatus = "Saved"
    };

    /*
    * Update Question on deselect
    */
    //TODO: Can probably consolidate this function with update choice fn
    $scope.updateQuestion = function(question){
        //Detect if question has been edited
        if (question.question_text != "" && question.question_text != $scope.curText)
        {
            updateQuestion(question);
        }
        $scope.formStatus = "Saved"
    };

    /**
    DELETE
    */
    //TODO: can just pass in the question as well with the funciton instead of searching for it
    $scope.removeQuestion = function(questionIndex) {
        //TODO add confirm
        question = $scope.questions[questionIndex];
        deleteQuestion(question.id)
            .then(function (response) {
                //reload question list... might not be needed
                $scope.questions.splice(questionIndex,1);
            }, function(error) {
                alert("Unable to delete question "  + error.message);
            });
    };

    //Update Status Variable on input change
    $scope.updateStatus = function() {
        $scope.formStatus = "Saving";
    };

    //Load Question List
    //TODO this doesnt need to be scope
    $scope.loadQuestions = function() {
        getQuestions($scope.quizId)
            .then(function (response) {
                $scope.questions=response.data;
            }, function(error) {
                alert("Unable to load questions " + error.message);
            });
    };


    /*
    * Service Layer
    */
    // Question Post
    postQuestion = function(question) {
        return ( $http.post('/dynoquiz/api/quiz/'+question.quiz+'/question/', question) );
    };

    // Choice Post
    postChoice = function(choice) {
        return ( $http.post('/dynoquiz/api/question/'+choice.question+'/choice/', choice) );
    };

    // Update Choice
    updateChoice = function(choice) {
        return ( $http.put('/dynoquiz/api/question/'+choice.question+'/choice/'+choice.id+'/', choice) );
    };

    // Delete Choice
    deleteChoice = function(choice) {
        return ( $http.delete('/dynoquiz/api/question/'+choice.question+'/choice/'+choice.id + '/') );
    };

    // Get Questions List
    getQuestions = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/question') );
    };

    // Delete Question
    deleteQuestion = function(questionId) {
        return ( $http.delete('/dynoquiz/api/quiz/'+$scope.quizId+'/question/'+questionId + '/') );
    };

    // Update Question
    updateQuestion = function(question) {
        return ( $http.put('/dynoquiz/api/quiz/'+ question.quiz +'/question/'+question.id+'/', question) );
    };
    /*
    *End Service Layer
    */

    /*
    * Model Layer
    */
    //New Choice for new question
    choiceObj = function(id, text) {
        return{
           'id':id,
           'choice_text':text,
           'new':true,
           'votes':0,
        };
    };

    //New Choice for existing question
    choiceObj = function(text, questionId) {
        return{
           'choice_text':text,
           'question':questionId,
           'new':true,
           'votes':0,
        };
    };

    //New Question Model
     questionObj = function(id, text){
        return {
            'quiz':id,
            'question_text':text,
            'choices':[],
            'date_created':new Date(),
        };
     };

        //TODO: Can we consolidate model functions with diff arg numbers
     //New Question Model
     questionObj = function(id, text, choice){
        return {
            'quiz':id,
            'question_text':text,
            'choices':[],
            'answer':choice,
            'date_created':new Date(),
        };

     };

    /*
    *End Model Layer
    */

    //Set answer to existing question choice
    $scope.setAnswer = function(question, choice) {
        question.answer = choice.id;
        updateQuestion(question);
    };

    //Erase input fields when a question has been canceled
    $scope.cancelQuestion = function() {
        $scope.choiceList=[choiceObj(1,"")];
        $scope.questionText = "";
    };

    $scope.loadPage = function(curQuizId) {
        //save persistant variables
        $scope.quizId = curQuizId;
        $scope.loadQuestions();
        $scope.choiceList=[choiceObj(1,"")];

    };

    //Validates that the question form is complete
    $scope.questionValid = function() {
        return ($scope.choiceList.length > 1 && $scope.questionText != null )
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
                 new:true,
           };
           newObject[attr] = "";
           objectList.push(newObject);
        } else if (objectList[(listLength-2)][attr] == ""){
            //Drop last object if 2nd to last object attr is ""
            objectList.pop();
        }
    };


});