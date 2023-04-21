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
const negative = document.querySelector('#neg');
// const percentage = document.querySelector('#perc');


clear.addEventListener('click', resetCalc);
backspace.addEventListener('click', handleBackspace);
equals.addEventListener('click', checkEquals);

// percentage.addEventListener('click', () => {
//     if (display.innerText !== '0') {
//         let x = parseFloat(display.innerText) / 100;
//         display.innerText = x;
//         stackArray.push(x);
//     }
// })

negative.addEventListener('click', () => {
    if (display.innerText !== '0') {
        let x = parseFloat(display.innerText) * -1;//????
        display.innerText = x;
    }
});

decimalPoint.addEventListener('click', (e) => {
    console.log('in decimalPoint', display.innerText);
    let decimal = e.target.innerText;
    if (display.innerText === '0') {// Display empty
        stackArray.push(0);
        stackArray.push(decimal);
        // decimal = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
        display.innerText += decimal
    } else { // There already exist a number in display - no decimal point
        if (stackArray.indexOf(decimal) === -1) {
            if (display.innerText !== '0') {
                display.innerText += decimal;
            } else {//????
                display.innerText = decimal;
            }
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
    let el = stackArray.pop();
    if (typeof el !== 'number') {
        operatorIndex = 0;
    }
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
            num1 = parseFloat(stackArray.slice(0, operatorIndex).join(''));
            console.log({num1});
        }
        updateDisplay(keyPressed);
    }
}

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
    console.log({result});
    stackArray = [];
    operatorIndex = 0;
    stackArray.push(result);
    // Check that the result is =< 8 digits(call function)
    display.innerText = '0'; 
    updateDisplay(result);
}

function operate(a, b, op) {
    // let calcObj = {
    return {
        '+': add(a, b),
        '-': subtract(a, b),
        'x': multiply(a, b),
        '/': divide(a, b)
        }[op];
    // return calcObj[op];
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
    if (b === 0) {
        display.classList.add('error');
        return 'Division by zero error';
    } else {
        // let result = a / b;
        return parseFloat((a / b).toFixed(4));
        // return result;
    }
    // return a / b;
}