var budgetController = ( function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.persentage = -1;
    };
    Expense.prototype.calcPerentage = function(totalIncome){
        if(totalIncome > 0){
           this.persentage = Math.round((this.value/totalIncome)*100);
        }else{
            this.persentage = -1
        }   
    };
    Expense.prototype.getPersentage = function(){
        return this.persentage; 
    };
    var Income = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
    };
        calculateTotal = function(type) {
             var sum = 0;
             data.allitem[type].forEach(function(cur) {
             sum += cur.value;
        });
             data.totals[type] = sum;
    };
        var data = {
              allitem: {
                     exp: [],
                     inc: []
         },
               totals: {
                    exp: 0,
                    inc: 0
         },
                    budget: 0,
                    persentage: -1
         };
        return {
            addItem: function(type, des, val) {
                var newItem,ID;
                updateBudget();
                if(data.allitem[type].length>0) {
                        ID = data.allitem[type][data.allitem[type].length-1].id+1;
                }
                else {
                         ID = 0;
                }
                //create new item based on "inc" or "exp"
                if(type === 'exp'){
                        newItem = new Expense(ID,des,val);
                }
                if(type === 'inc') {
                     newItem = new Income(ID,des,val);
                }
                //push in it into our dataStructure
                    data.allitem[type].push(newItem);

                //return the new element
                    return newItem;
            },
            deleteItem: function(type, id){
                var ids,index;

                ids = data.allitem[type].map(current =>{
                    return current.id;
                });
                index = ids.indexOf(id);
                    if(index !== -1){
                         data.allitem[type].splice(index, 1);
                }
            },
            calculateBudget: function() {
                // calculate total income and expanse
                    calculateTotal('exp');
                    calculateTotal('inc');
                //calculate budget i.e. income - expanses/
                     data.budget = data.totals.inc - data.totals.exp;
                //calculate % of expense of incom that was expent
                if (data.totals.inc > 0){
                    data.persentage = Math.round((data.totals.exp / data.totals.inc )*100);
                }else{
                    data.persentage = -1;
                }
            },
            calculatePersentage: function() {
                 data.allitem.exp.forEach(function(current){
                    current.calcPerentage(data.totals.inc);
                });

            },
            getPersentages: function(current){
                   var allPer = data.allitem.exp.map(current => {
                        return current.getPersentage();
                    });
                    return allPer;    
            },
            getBudget: function() {
                    return {
                        budget: data.budget,
                        totalInc:data.totals.inc,
                        totalExp: data.totals.exp,
                        persentage: data.persentage
                    }

                },
                testing: function(){
                    console.log(data);
                }
            };
        })();

            var UIController = ( function() {

                var DomString = {
                    inputType: ".add__type",
                    inputDescription: ".add__description",
                    inputValue: ".add__value",
                    inputBtton:".add__btn",
                    incomeContainer: ".income__list",
                    expensesContainer:".expenses__list",
                    budgetLable: ".budget__value",
                    incomeLable: ".budget__income--value",
                    expensesLable: ".budget__expenses--value",
                    persentageLable: ".budget__expenses--percentage",
                    container: ".container",
                    expensesPerLable: ".item__percentage",
                    dateLable: ".budget__title--month"

                }
                var numberFormate= function(num, type) {

                    var numSplit, dec, int, type;
                    num = Math.abs(num);
                    num = num.toFixed(2);
                    numSplit = num.split('.');
                    int = numSplit[0]
                if(int.length > 3){
                    int = int.substr(0, int.length - 3) +","+ int.substr(int.length - 3, 3);
                    //1000 => 1,000 or 100000 =>100,000
                }      
                    dec = numSplit[1];
                    return (type === 'exp' ? '-' : '+') + " "+ int + '.' + dec;
            };
            var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };

            return {
                getInput: function() {
                    return {
                        type: document.querySelector(DomString.inputType).value,
                        description: document.querySelector(DomString.inputDescription).value,
                        value: parseFloat( document.querySelector(DomString.inputValue).value)
                        };
                    },
                    addListItem: function(obj, type) {
                var html, newHtml, element;
                // Create HTML string with placeholder text
                
                if (type === 'inc') { 
                    element = DomString.incomeContainer;
                    
                    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp') {
                    element = DomString.expensesContainer;
                    
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                
                // Replace the placeholder text with some actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', numberFormate(obj.value, type));
                
                // Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            },
            deleteListitem: function(selecterId){
                var el= document.getElementById(selecterId);
                el.parentNode.removeChild(el);
                
            },

            clearFlield: function(){
                var fields ,fieldsArr;
                    fields = document.querySelectorAll(DomString.inputDescription +','+DomString.inputValue);
                    fieldsArr = Array.prototype.slice.call(fields);
                    fieldsArr.forEach(function(current, index, arrays){
                    current.value = ""
               });
               fieldsArr[0].focus();
            },
                displayBudget: function(obj){
                    var type;
                    obj.budget > 0 ? type = 'inc' : type = 'exp';
                     document.querySelector(DomString.budgetLable).textContent = numberFormate(obj.budget, type);
                     document.querySelector(DomString.incomeLable).textContent = numberFormate(obj.totalInc, 'inc');
                     document.querySelector(DomString.expensesLable).textContent = numberFormate(obj.totalExp, 'exp');

                  if(obj.persentage > 0){
                     document.querySelector(DomString.persentageLable).textContent=obj.persentage+'%' ;
                 }else{
                     document.querySelector(DomString.persentageLable).textContent="---";
                }
            },

            displayPersentage: function(percentages){
                var fields = document.querySelectorAll(DomString.expensesPerLable);
                nodeListForEach(fields, function(current,index){
                    if(percentages[index] >0){
                        current.textContent = percentages[index] + '%';
                    }else{
                        current.textContent = '---';
                    }
                });
            },
            displayMonth: function(){

                var now, months, month, year;
                now = new Date();
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'july',
                            'August', 'September', 'November', 'December'];

                month = now.getMonth();
                year = now.getFullYear();

                document.querySelector(DomString.dateLable).textContent = months[month-1] + ' ' + year;
            }, 
            changedType: function(){
                var fields = document.querySelectorAll(
                    DomString.inputType + ',' +
                    DomString.inputDescription + ',' +
                    DomString.inputValue );
                    nodeListForEach(fields, function(cur){
                        cur.classList.toggle('red-focus');
                    });
                    document.querySelector(DomString.inputBtton).classList.toggle('red');
            },
            getDomString: function(){
                return DomString;
            } 
        }
    })();
         var controller = (  function ( budetCtrl,UIctrl) {

            var setupEventListners = function() {
            var Dom = UIctrl.getDomString();

                document.querySelector(Dom.inputBtton).addEventListener('click', ctrlAddItem);
                document.addEventListener('keypress', function(event) {
                if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
                }
            });
                 document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem);

                 document.querySelector(Dom.inputType).addEventListener('change', UIctrl.changedType);
        };

            updateBudget = function(){
                //1.calculate the budget
                budetCtrl.calculateBudget();

                //2.return (get)budget
                var budget = budetCtrl.getBudget();
                //3.display budget on ui
                UIctrl.displayBudget(budget);
                


            }
            var updatePersentage = function(){
                 //1- update percentage
                 budetCtrl.calculatePersentage();

                 //read percentage from the budget controller
                  var persentages  = budetCtrl.getPersentages();
                // update with ui to new percentage
                 UIctrl.displayPersentage(persentages);
                    
              }

            var ctrlAddItem = function() {

                var input,newItem;
                    //1.get the field of input data
                    var input = UIctrl.getInput();
                    
                    if(input.description !="" && !isNaN(input.value) && input.value >0){
                            //2.and item to the budgetController
                    var newItem = budetCtrl.addItem(input.type, input.description, input.value)

                    //3.add the UI
                    UIctrl.addListItem(newItem, input.type)

                    //4.clear the input field
                    UIctrl.clearFlield();
                    //5-update budget        
                    updateBudget();
                    //6-update expenses percentage
                    updatePersentage();
                 }
            };
             var ctrlDeleteItem =function(event) {
                var itemId , splitId, type, id;
                    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;    
                        if(itemId){
                            splitId = itemId.split('-');
                            type = splitId[0];
                            id = parseInt( splitId[1]);

                            //delete Item form data sturcture
                            budetCtrl.deleteItem(type, id);

                            //delete item from ui
                            UIctrl.deleteListitem(itemId);

                            //update and show the item
                            updateBudget();
                    }
        };

            return {
                    init: function(){
                        console.log("Application has been started");
                        UIctrl.displayMonth();

                        UIctrl.displayBudget( {
                            budget: 0,
                            totalInc:0,
                            totalExp: 0,
                            persentage: -1+"%"
                        });
                        setupEventListners();
                        
                    }
                }
        })(budgetController,UIController);


         controller.init();