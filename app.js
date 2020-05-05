

var budgetController = (function(){

    var Income = function(id, description, value){                              // function constructor
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function(id, description, value){                             // function Constructor
        this.id = id;
        this.description = description;
        this.value = value;
    }

    calculateTotal = function(type) {

        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });

        data.totals[type] = sum;
    }

    var data = {
        allItems : {
            inc : [],
            exp : []
        },
        totals: {
            inc : 0,
            exp : 0
        },
        budget : 0,
        percentage : -1

    }



    return {
        addItem : function (type, desc, value){          // addition function to the code as from controller we will get the data.
            var id, newItem;

            if(data.allItems[type].length > 0){

                //create new id for new items to be added
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                id = 0;
            }

            if(type === 'exp'){
                newItem = new Expense(id, desc, value); // instansiation
            }
            else if(type === 'inc'){
                newItem = new Income(id, desc, value);
            }

        // push the item in data structure
        data.allItems[type].push(newItem);

        //return the new items
        return newItem;
        },

        calculateBudget : function() {

            //calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');


            //calcualte the budget 
            data.budget = data.totals.inc - data.totals.exp;


            //calculate the percentage
            if(data.totals.inc > 0)
            data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100) ;
            else {
                data.percentage = -1;
            }
        },

        getBudget : function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },

        testing : function(){
            console.log(data);
        }
    }



})();



var UIController = (function(){


    var domStrings = {
        type : '.add__type',
        description : '.add__description',
        value : '.add__value',
        btn : '.add__btn',
        incomeList : '.income__list',
        expenseslist: '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expensesLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage'
    }

    return{                                                 // making it public to share data
        getInput : function() {
            return {
                type : document.querySelector(domStrings.type).value,
                description : document.querySelector(domStrings.description).value,
                value : parseFloat(document.querySelector(domStrings.value).value)
            }

        },

        addListItem : function(obj, type){
            var html, newHtml,element;

            //create html with placeholder

            if(type === 'inc'){
                element = domStrings.incomeList;
                html =  '<div class="item clearfix" id="income-%id%"><div class="item__description">%desciption%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp'){
                element = domStrings.expenseslist;
                html =  '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desciption%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
                      
            //replace the placeholder with actual values
            newHtml = html.replace('%id',obj.id);
            newHtml = newHtml.replace('%desciption%',obj.description);
            newHtml =  newHtml.replace('%value',obj.value);

            //insert the html into DOM
           
            document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
            
        },

        // clearing the input field 
        clearField : function() {
            var fields , fieldArr;

            fields = document.querySelectorAll(domStrings.value + ',' + domStrings.description); // will give you list

            fieldArr = Array.prototype.slice.call(fields); // convert list to array

            // console.log(fields);
            // console.log(fieldArr);

            fieldArr.forEach(function(current , index , array){
                current.value = '';
            });

            fieldArr[0].focus();



        },

        displayBudget : function(obj) {

            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(domStrings.percentageLabel).textContent = '--';

            }
        },

        getDomStrings : function() {
            return domStrings;
        }
    }

  

})();


var controller = (function(budgetController,UIctrl){

    
    var setupEventListeners = function(){
        var DOM = UIctrl.getDomStrings();
        document.querySelector(DOM.btn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13)
            {
                ctrlAddItem();
            }
        });

    }

    var updateBudget = function(){

        //calculate the budget
        budgetController.calculateBudget();

        //return the budget
        var budget = budgetController.getBudget();

        // console.log(budget);

        //display the budget
        UIctrl.displayBudget(budget);

    }


    var ctrlAddItem = function (){

        // get the field input data
        var input = UIctrl.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0){

            //add the item to the budget controller
        var dataItem = budgetController.addItem(input.type, input.description , input.value);

        // console.log(dataItem);

        //add the item to the UI
            UIctrl. addListItem(dataItem,input.type);

        // clear the fields
        UIctrl.clearField();

        updateBudget();
        }

    }

    return {
        init: function(){
            setupEventListeners();
            UIctrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : 0
            });
        }
    }  

})(budgetController,UIController);

controller.init();  