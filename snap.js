//client (ie user) Object
var client = {
    senior: 0,
    disabled: 0,
    householdSize: 1,
    earnedIncome: 0,
    benefitIncome: 0, 
    grossIncome: 0, 
    netIncome: 0,
    resources: 0,
}; 

                                /*RESOURCE ELIGIBILITY*/
var resourceEligibilityMessage = document.getElementById("resourceEligibilityMessage");
var resourceEligibilityEval = document.getElementById("resourceEligibilityEval");
var seniorOrDisabledMessage = document.getElementById("seniorOrDisabledMessage"); 
var resourceLimitMessage = document.getElementById("resourceLimitMessage"); 
var resourceEligibilityMessage_disqualifyingResources = document.getElementById("resourceEligibilityMessage_disqualifyingResources"); 

document.getElementById("resourcesButton").addEventListener("click", function() { 
    resourceValueGenerate(); 
    resourceEligibilityCheck();
    resourceEligibilityDisplayMessage();
});
function resourceValueGenerate(){
    client.senior = parseInt(document.querySelector('input[name="senior"]:checked').value);
    client.disabled = parseInt(document.querySelector('input[name="disabled"]:checked').value);
    client.resources = parseInt(document.querySelector('input[name="resourcesAmount"]:checked').value); 
}
//Refactor, look at Jonathan's code as shared in Slack channel message 
function resourceEligibilityCheck(){
    if(client.resources == 3251){
        resourceEligible = false;
    } else if (client.resources == 3250 && client.senior == 1 || client.disabled == 1){  
        resourceEligible = true; 
    } else if (client.resources == 2250){
        resourceEligible = true; 
    } else {
        resourceEligible = false; 
    }
}
function resourceEligibilityDisplayMessage(){
    if(client.resources == 3251){
        resourceEligibilityMessage_disqualifyingResources.style.display = "initial";
        resourceEligibilityMessage.style.display = "none";
    } else { 
        resourceEligibilityMessage_disqualifyingResources.style.display = "none";
        resourceEligibilityMessage.style.display = "initial"; 
        resourceEligibilityEval.innerHTML = (resourceEligible == true) ? "":" not";
        seniorOrDisabledMessage.innerHTML = (client.senior==1 || client.disabled==1) ? "":" do not";
        resourceLimitMessage.innerHTML =  (client.senior || client.disabled) ? "3,250":"2,250";
    }
}

                                /*GROSS INCOME ELIGIBILITY*/
//Note: Household Poverty Levels may change over time, so one can modify the Object, while leaving the array and rest of code as is. 
//Object, values reflect 100% of federal poverty level relative to household size. 
var householdPovertyLevel = {
    One: 990, 
    Two: 1335, 
    Three: 1680, 
    Four: 2025, 
    Five: 2370, 
    Six: 2715,
    Seven: 3061, 
    Eight: 3408, 
}
//Array of householdPovertyLevel object.  
var povertyLevelArray = [0, 
                         householdPovertyLevel.One, 
                         householdPovertyLevel.Two, 
                         householdPovertyLevel.Three, 
                         householdPovertyLevel.Four, 
                         householdPovertyLevel.Five, 
                         householdPovertyLevel.Six, 
                         householdPovertyLevel.Seven, 
                         householdPovertyLevel.Eight,
                        ];

var maximumMonthlyAllotment = {
    One: 194, 
    Two: 357, 
    Three: 511, 
    Four: 649, 
    Five: 771, 
    Six: 925,
    Seven: 1022, 
    Eight: 1169,  
}

var maximumMonthlyAllotmentArray = [0, 
                         maximumMonthlyAllotment.One, 
                         maximumMonthlyAllotment.Two, 
                         maximumMonthlyAllotment.Three, 
                         maximumMonthlyAllotment.Four, 
                         maximumMonthlyAllotment.Five, 
                         maximumMonthlyAllotment.Six, 
                         maximumMonthlyAllotment.Seven, 
                         maximumMonthlyAllotment.Eight,
                        ];

//For all questions that ask for a dollar amount, set default value to $0
var questionWithIntegerAnswer = document.getElementsByClassName("questionWithIntegerAnswer"); 
for(i=0; i<questionWithIntegerAnswer.length; i++){
    questionWithIntegerAnswer[i].defaultValue= 0; 
}


var grossIncomeEligibilityMessage = document.getElementById("grossIncomeEligibilityMessage");
var grossIncomeEligibilityEval = document.getElementById("grossIncomeEligibilityEval");
var householdNumberMessage = document.getElementById("householdNumberMessage"); 
var grossIncomeLimitMessage = document.getElementById("grossIncomeLimitMessage");  
var grossIncome = document.getElementById("grossIncome"); 

document.getElementById("grossIncomeButton").addEventListener("click", function() { 
    grossIncomeValueGenerate(); 
    grossIncomeEligibilityCheck();
    grossIncomeEligibilityDisplayMessage();
});

function grossIncomeValueGenerate(){
    client.householdSize = parseInt(document.getElementById("householdSize").value);
    client.earnedIncome = parseInt(document.getElementById("earnedIncome").value);
    client.benefitIncome = parseInt(document.getElementById("benefitIncome").value);
    client.grossIncome = client.earnedIncome + client.benefitIncome;
} 
function grossIncomeEligibilityCheck(){ 
    grossIncomeLimitValue = Math.ceil(povertyLevelArray[client.householdSize]*1.3);
    if (client.grossIncome <= grossIncomeLimitValue){
        grossIncomeEligible = true;
    }
    else {
        grossIncomeEligible = false;
    }
}
function grossIncomeEligibilityDisplayMessage(){
    grossIncomeEligibilityMessage.style.display = "initial"; 
    grossIncomeEligibilityEval.innerHTML = (grossIncomeEligible == true) ? "":" not";
    grossIncomeLimitMessage.innerHTML = grossIncomeLimitValue; 
    householdNumberMessage.innerHTML = client.householdSize;
    grossIncome.innerHTML = client.grossIncome;
}

                                /*NET INCOME ELIGIBILITY*/ 
var netIncomeEligibilityMessage = document.getElementById("netIncomeEligibilityMessage");
var netIncomeEligibilityEval = document.getElementById("netIncomeEligibilityEval");
var netIncomeHouseholdNumberMessage = document.getElementById("netIncomeHouseholdNumberMessage");
var netIncomeLimitMessage = document.getElementById("netIncomeLimitMessage");
var netIncome = document.getElementById("netIncome");
var deductionFamilySizeArray = [0, 157, 157, 157, 168, 197, 226];

document.getElementById("netIncomeButton").addEventListener("click",function() { 
    grossIncomeValueGenerate(); //Generate client Object values for gross income since net income references those values 
    netIncomeDeductionSumGenerate();
    shelterDeductionSumGenerate(); 
    shelterDeductionLimitGenerate(); 
    netIncomeValueGenerate(); //Calculate the sum of deductions that can be applied to net income
    netIncomeEligibilityCheck();
    allotmentValueGenerate(); 
    netIncomeEligibilityDisplayMessage();
});
function netIncomeDeductionSumGenerate(){
    var deductionTwentyPercent = parseInt(document.getElementById("earnedIncome").value*0.2); 
    var deductionFamilySize = parseInt(deductionFamilySizeArray[client.householdSize]); 
    var deductionDependentCare= parseInt(document.getElementById("deductionDependentCareValue").value);
    var deductionChildSupport = parseInt(document.getElementById("deductionChildSupportValue").value);
    var deductionMedExpense = parseInt(document.getElementById("deductionMedExpenseValue").value);
    if(deductionMedExpense > 35){
        deductionMedExpense -= 35;  
    } else {
        deductionMedExpense = 0; 
    }
    netIncomeDeductionSum = deductionTwentyPercent + deductionFamilySize + deductionDependentCare + deductionMedExpense + deductionChildSupport; 
}
                    /*Shelter Deduction*/
function shelterDeductionSumGenerate(){
    client.netIncome = client.grossIncome - netIncomeDeductionSum;
    shelterCostDeductionSum = 0; //global variable used in netIncomeValueGenerate() function 
    var shelterCostSum = 0; //local variable used to determine global shelterCostDeductionSum
    var shelterInput = document.getElementsByClassName("shelterInput"); 
    for(var i=0; i<shelterInput.length; i++){
        shelterCostSum += parseInt(shelterInput[i].value);
    }
    if(shelterCostSum < client.netIncome * 0.5){
        shelterCostDeductionSum = 0; 
    } else {
        shelterCostDeductionSum += shelterCostSum - (client.netIncome * 0.5)  
    } 
}
function shelterDeductionLimitGenerate(){
    if(document.getElementById("seniorTrue").checked === true || document.getElementById("disabledTrue").checked === true ){
        return shelterCostDeductionSum; 
    } else if(shelterCostDeductionSum > 517) {
        shelterCostDeductionSum = 517; 
    } else {
        return shelterCostDeductionSum
    }
}
function netIncomeValueGenerate(){ 
    client.netIncome = client.grossIncome - netIncomeDeductionSum - shelterCostDeductionSum;
}
function netIncomeEligibilityCheck(){
    netIncomeLimitValue = povertyLevelArray[client.householdSize];
    if (client.netIncome <= netIncomeLimitValue){
        netIncomeEligible = true;
    } else {
        netIncomeEligible = false;
    }
}
function allotmentValueGenerate(){
    var allotmentValue = maximumMonthlyAllotmentArray[client.householdSize] - Math.ceil((client.netIncome * 0.3));
    document.getElementById("allotmentValueMessage").innerHTML = allotmentValue;
}

function netIncomeEligibilityDisplayMessage(){
    netIncomeEligibilityMessage.style.display = "initial"; 
    netIncomeEligibilityEval.innerHTML = (netIncomeEligible == true) ? "":" not";
    netIncomeLimitMessage.innerHTML = netIncomeLimitValue; 
    netIncomeHouseholdNumberMessage.innerHTML = client.householdSize;
    netIncome.innerHTML = client.netIncome;
}

                                /*Display Functions for Net Income Deduction Questions*/
//Dependent Care Deduction Display
document.getElementById("deductionDependentCareQuestion").addEventListener("click", displayDependentCareFollowUp);
function displayDependentCareFollowUp(){
    var deductionDependentCareFollowUp = document.getElementById("deductionDependentCareFollowUp");
    if(document.getElementById("workTrainingClassesYes").checked){
        deductionDependentCareFollowUp.style.display = "initial";
    } else {
        deductionDependentCareFollowUp.style.display = "none"
    }
}
//Child Support Deduction Display  
document.getElementById("deductionChildSupportQuestion").addEventListener("click", displayChildSupportFollowUp);
function displayChildSupportFollowUp(){
    var deductionChildSupportFollowUp = document.getElementById("deductionChildSupportFollowUp");
    if(document.getElementById("childSupportYes").checked){
        deductionChildSupportFollowUp.style.display = "initial";
    } else {
        deductionChildSupportFollowUp.style.display = "none";
    }
}
//Medical Expense Deduction Display   
document.getElementById("questionDisabledStatus").addEventListener("click", displayMedExpenseFollowUp);
document.getElementById("questionSeniorStatus").addEventListener("click", displayMedExpenseFollowUp);
function displayMedExpenseFollowUp(){
    var deductionMedExpenseFollowUp = document.getElementById("deductionMedExpenseFollowUp");
    if (document.getElementById("seniorTrue").checked == true || document.getElementById("disabledTrue").checked == true){   
        deductionMedExpenseFollowUp.style.display = "initial"; 
    } else {
        deductionMedExpenseFollowUp.style.display = "none"
    }
};
//Shelter Cost Deduction Display   
document.getElementById("shelterRentOrOwnQuestion").addEventListener("click", rentOrOwnDisplayFollowUp )
function rentOrOwnDisplayFollowUp(){
    if(document.getElementById("rentResponse").checked){
        document.getElementById("rentFollowUp").style.display = "initial";
        document.getElementById("ownFollowUp").style.display = "none";
        document.getElementById("shelterMortgageCost").value = 0; 
        document.getElementById("shelterHomeTaxesCost").value = 0; 
    } else if (document.getElementById("ownResponse").checked){
        document.getElementById("ownFollowUp").style.display = "initial";
        document.getElementById("rentFollowUp").style.display = "none";
        document.getElementById("shelterRentCost").value = 0;       
    } else {
        document.getElementById("rentFollowUp").style.display = "none";
        document.getElementById("ownFollowUp").style.display = "none";
        document.getElementById("shelterRentCost").value = 0;
        document.getElementById("shelterMortgageCost").value = 0; 
        document.getElementById("shelterHomeTaxesCost").value = 0;
    }
}












