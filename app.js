'use strict';

let num1 = 0;
let num2 = 0;
let oper = '';
let prevOper = '';
let stackArray = [];
let operator = false;
let operatorIndex = 0;
let keyPressed = '';

const display = document.querySelector('.display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('#equals');
const clear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');
const decimalPoint = document.querySelector('#dec');

clear.addEventListener('click', resetCalc);
backspace.addEventListener('click', handleBackspace);
equals.addEventListener('click', checkEquals);

decimalPoint.addEventListener('click', (e) => {
    let decimal = e.target.innerText;
    if (display.innerText === '0') {
        stackArray.push(0);
        stackArray.push(decimal);
        display.innerText += decimal
    } else {
        if (stackArray.indexOf(decimal) === -1) {
            display.innerText = decimal;
            stackArray.push(decimal);
        }
    }
});

numbers.forEach((number) => {
    number.addEventListener('click', handleNumber);
});

operators.forEach((operator) => {
    operator.addEventListener('click', checkOperator);
});

function resetCalc(e) {
    num1 = 0;
    num2 = 0;
    oper = '';
    prevOper = '';
    stackArray = [];
    operatorIndex = 0;
    display.classList.remove('error');
    display.innerText = '0';
    keyPressed = '0';
    updateDisplay(keyPressed);
}

function checkEquals(e) {
    if (!(stackArray.length === 0)) {
        operator = true;
        num2 = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
        console.log({num1}, {num2});
        getResult(num1, num2, oper);
    }
}

function handleNumber(e) {
    console.log('in handleNumber');
    operator = false;
    keyPressed = e.target.innerText;
    storeKey(keyPressed);      
    updateDisplay(keyPressed);
}

function handleBackspace(e) {
    display.innerText = '';
    stackArray.pop();
    console.table(stackArray);
    stackArray.forEach(el => {
         display.innerText += el;
    });
    if (stackArray.length === 0) {
        display.innerText = '0';
    }
    return;
}

function checkOperator(e) {
    console.log('in checkOperator');
    console.table(stackArray);
    if (!(stackArray.length === 0)) {
        let keyPressed = e.target.innerText;
        operator = true;
        if (e.target.id === 'divide') {
            oper = '/';
        } else {
            // oper = e.target.innerText;
            oper = keyPressed;
        }
        console.log('operatorInd:', operatorIndex);
        if (operatorIndex > 0) {// Operator pressed a 2nd time - already exist in stackArray
            prevOper = stackArray[operatorIndex]; 
            num2 = parseFloat(stackArray.slice(operatorIndex + 1).join('')); 
            // console.log({prevOper}, {num1}, {num2});
            getResult(num1, num2, prevOper);
            // console.log('after getResult - ', {oper});
            storeKey(oper);
            operatorIndex = stackArray.indexOf(oper);
            num1 = parseFloat(stackArray.slice(0, operatorIndex).join(''));
        } else {  // Store the operator in the stackArray

            // console.log('storeKey(oper)');
            // console.log({operatorIndex});
            storeKey(oper);
            // Store digits in variable
            operatorIndex = stackArray.indexOf(oper);
            num1 = parseInt(stackArray.slice(0, operatorIndex).join(''));
            console.log({num1});
        }
        updateDisplay(keyPressed);
    }
}

// function clearDisplay() {
//     display.innerText = '0';
// }
        
// Update the display with the contents of the stackArray
function updateDisplay(keyPressed) {
    console.log('disp-innerT:', display.innerText);
    console.log('in updateDisplay');
    if (display.innerText === '0') {
         display.innerText = keyPressed;
    } else {
        display.innerText += keyPressed;
    }
    console.log('disp-innerT:', display.innerText);
}
            
function storeKey(keyPressed) {
    console.log(' in storeKey');
    if (operator)  {
        stackArray.push(keyPressed); 
    } else {
        stackArray.push(parseInt(keyPressed)); 
    }
    // Check that the result is =< 8 digits(call function)
    console.table({stackArray});
}

function getResult(n1, n2, oper) {
    let result = operate(n1, n2, oper);
    stackArray = [];
    operatorIndex = 0;
    stackArray.push(result);
    // Check that the result is =< 8 digits(call function)
    display.innerText = '0'; 
    updateDisplay(result);
}

// console.log(operate(5, 4, '/'));
function operate(num1, num2, operator) {
    console.log('in "Operate"');
    console.log({operator});
    let result = 0;
    switch (operator) {
        case  ('+') :
             result = add(num1, num2);
        break;
        case  ('-') :
                result = subtract(num1, num2);
                break;
        case  ('x') :
            result = multiply(num1, num2);
            break;
            case  ('/') :
                if (num2 === 0) {
                   result = 'What!! Are you serious??!';
                //    result = 'Division by zero is not allowed';
                   display.classList.add('error');
                } else {
                    result = divide(num1, num2);
                    result = result.toFixed(4);
                }
            break;
    }
    console.log({result});
    return result;
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}