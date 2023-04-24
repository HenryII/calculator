'use strict';

let num1 = 0;
let num2 = 0;
let oper = '';
let prevOper = '';
let stackArray = [];
let operator = false;
let operatorIndex = 0;
let keyPressed = '';

const display = document.querySelector('.main-display');
const upperDisplay = document.querySelector('.upper-display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('#equals');
const clear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');
const decimalPoint = document.querySelector('#dec');
const negative = document.querySelector('#neg');
const percentage = document.querySelector('#perc');


clear.addEventListener('click', resetCalc);
backspace.addEventListener('click', handleBackspace);
equals.addEventListener('click', checkEquals);

percentage.addEventListener('click', (e) => {
    keyPressed = e.target.innerText;
    if (display.innerText !== '0') {
        console.log('in percentage:', display.innerText, {num1}, {num2});
        if ((num1 > 0) && (num2 === 0)) {
            if (operatorIndex > 0) {
                console.log({oper});
                let firstNumber = num1;
                console.log({oper});
                if (oper === 'x') {
                  let percResult = getPercentage(num1, num2, oper);
                } else if ((oper === '+') || (oper === '-')) {
                    let firstOper = oper;
                    let percResult = getPercentage(num1, num2, oper);
                    getResult(firstNumber, percResult, firstOper);
                } else if (oper === '/') {
                    let firstOper = oper;
                    oper = 'x'
                    num2 = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
                    if (num2 > 0) {
                        let firstResult = getResult(firstNumber, 100, oper);
                        let result = getResult(firstResult, num2, firstOper);
                    }
                }
            }
            console.table(stackArray);
            
        }
    }
});

function getPercentage(num1, num2) {
    console.log('in getPercentage');
    oper = 'x';
    num2 = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
    if (num2 > 0) {
        let result = getResult(num1, num2, oper);
    }
    // 2nd part of % calculation
    stackArray.push('/', 100);
    num2 = 100;
    oper = '/';
    operatorIndex = stackArray.indexOf(oper);
    num1 = parseFloat(stackArray.slice(0, operatorIndex).join(''));
    console.log({num1});
    let result = getResult(num1, num2, oper);
    return result;
}

negative.addEventListener('click', () => {
    if (display.innerText !== '0') {
        let negNum = parseFloat(display.innerText) * -1;
        if (operatorIndex === 0) {
            stackArray = [];
            storeKey(negNum);
        } else {
            stackArray.splice(operatorIndex + 1, 1, negNum);
        }
        display.innerText = negNum;
        console.log(stackArray);
    }
});

decimalPoint.addEventListener('click', (e) => {
    console.log('in decimalPoint', display.innerText);
    let decimal = e.target.innerText;
    if (display.innerText === '0') {// Display empty
        stackArray.push(0, decimal);
        // stackArray.push(decimal);
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
    upperDisplay.innerText = '';
    keyPressed = '0';
    updateDisplay(keyPressed);
}

function handleBackspace(e) {
    display.innerText = '';
    let el = stackArray.pop();
    if (typeof el !== 'number') {
        console.log({el});
        operatorIndex = 0;
        upperDisplay.innerText = '';
    }
    console.table(stackArray);
    stackArray.forEach(el => {
        // if (typeof el !== 'number') {
        //     upperDisplay.innerText = el;
        // } else {
         display.innerText += el;
        //  upperDisplay.innerText += el;
        // }
    });
    if (stackArray.length === 0) {
        display.innerText = '0';
    }
    return;
}

function checkEquals(e) {
    if (stackArray.length !== 0) {
        operator = true;
        if (operatorIndex > 0) {
             num2 = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
        console.log({num1}, {num2});
            if ((num2 < 0) || (num2 > 0)) {
                getResult(num1, num2, oper);
            }
        }
    }
}

function handleNumber(e) {
    if ((operatorIndex > 0) && (stackArray.slice(operatorIndex + 1).length === 0)) {
        display.innerText = '0';
    }
    console.log('in handleNumber');
    operator = false;
    keyPressed = e.target.innerText;
    storeKey(keyPressed); 
    updateDisplay(keyPressed);
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
        upperDisplay.innerText = keyPressed;    
        // upperDisplay.innerText += keyPressed;    
        // updateDisplay(keyPressed);
    }
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

// Update the display with the contents of the stackArray
function updateDisplay(keyPressed) {
    console.log('in updateDisplay');
    console.log('disp-innerText: before', display.innerText);
    if (display.innerText === '0') {
        //  upperDisplay.innerText = keyPressed;
         display.innerText = keyPressed;
        } else {
        // upperDisplay.innerText += keyPressed;
        display.innerText += keyPressed;
    }
    console.log('disp-innerText: after', display.innerText);
}
            

function getResult(n1, n2, oper) {
console.log('in getResult:',{n1}, {n2}, {oper});
    let result = operate(n1, n2, oper);
    console.log({result});
    stackArray = [];
    operatorIndex = 0;
    stackArray.push(result);
    // Check that the result is =< 8 digits(call function)
    display.innerText = '0'; 
    upperDisplay.innerText = ''; 
    updateDisplay(result);
    return result;
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