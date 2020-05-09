

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
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalIncome) {

        if(totalIncome > 0) {
            this.percentage = Math.round((this.value/totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }
        
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }



    calculateTotal = function(type) {

        var sum = 0;
       var sumFromForEach = data.allItems[type].forEach(function(cur){
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


        deleteItem : function(type, id) {
            var ids, index;
            //ids = [1 2 6 8]

            var ids = data.allItems[type].map(function(current){
                // console.log("current",current);
                return current.id;
            });

            index = ids.indexOf(id);
            // console.log(index);

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }

            // console.log(ids);


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

        calculatePercentage : function() {
            data.allItems.exp.forEach (function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentage : function() {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
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
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        expensesPercLabel : '.item__percentage',
        dateLabel : '.budget__title--month'
    }

    var formatNumber = function (num , type){
        var numSplit ,int ,dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];

        if(int.length > 3) {
            int = int.substr(0,int.length-3) +',' + int.substr(int.length-3,int.length);
        }
        dec = numSplit[1];

        return (type === 'exp'? '-' : '+') + int + '.' + dec;
    };
    var nodeListForEach = function(list , callback) {
        for (var i =0; i < list.length; i++){
            callback(list[i],i);
        }
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
                html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desciption%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp'){
                element = domStrings.expenseslist;
                html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desciption%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
                      
            //replace the placeholder with actual values
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%desciption%',obj.description);
            newHtml =  newHtml.replace('%value%',formatNumber(obj.value,type));

            //insert the html into DOM
           
            document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
            
        },

        deleteListItem(selectorId){

            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

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

                obj.budget > 0 ? type = 'inc' : type = 'exp'; 


            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
            if(obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(domStrings.percentageLabel).textContent = '--';

            }
        },

        getPercentage : function(percentages) {
          
            var fields = document.querySelectorAll(domStrings.expensesPercLabel);


            // var fieldsArr = Array.prototype.slice.call(fields);
            
            // console.log(fields);
            // console.log(fieldsArr);

            // fieldsArr.forEach(function(current , index){
            //     if(percentages[index] > 0)
            //     current.textContent = percentages[index] + '%';
            //     else {
            //         current.textContent = '---';
            //     }
            // });

          

            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth : function (){
            var month,months,year,now;
            now = new Date();

            year = now.getFullYear();
            month = now.getMonth();

            months = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
            document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType : function(){

            var fields = document.querySelectorAll(domStrings.type
                + ',' + domStrings.description + ',' + domStrings.value
                ); 

                nodeListForEach(fields,function(cur){
                    cur.classList.toggle('red-focus');
                });

                document.querySelector(domStrings.btn).classList.toggle('red');
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
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.type).addEventListener('change', UIctrl.changedType);

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

    var updatePercentage = function() {

        budgetController.calculatePercentage();

        var percentages = budgetController.getPercentage();

        //display the percentage

        console.log(percentages);
        UIctrl.getPercentage(percentages);

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

        updatePercentage();
        }

    }

    var ctrlDeleteItem = function (event) {
        var itemID,splitID,type,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // console.log(itemID);

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // console.log(splitID, type,ID);
        }

        //delete the item from data structure
        budgetController.deleteItem(type, ID);

        //delete the item list from ui
        UIctrl.deleteListItem(itemID);   //pasing itemId not only ID bcz we need to delete the whole element

        //update the budget
        updateBudget();

        updatePercentage();

    }

    return {
        init: function(){
            setupEventListeners();
            UIctrl.displayMonth();
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