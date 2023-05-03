'use strict';

let num1 = 0;
let num2 = 0;
let oper = '';
let prevOper = '';
let stackArray = [];
let operator = false;
let operatorIndex = 0;
let keyPressed = '';
let opKeyPressed = '';

// arrays for use with keyboard events
const numberArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operatorArray = ['+', '-', '*', '/']

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

document.addEventListener('keydown', handleKeypress);

clear.addEventListener('click', resetCalc);
backspace.addEventListener('click', handleBackspace);
equals.addEventListener('click', checkEquals);
percentage.addEventListener('click', calcPercentage);
negative.addEventListener('click', toggleNegative);
decimalPoint.addEventListener('click', handleDecimalPoint);

// ------------------------------------------------------------------------------------------------

numbers.forEach((number) => {
    number.addEventListener('click', handleNumber);
});

operators.forEach((operator) => {
    operator.addEventListener('click', checkOperator);
});

// Handle keyboard events
function handleKeypress(e) {
    if (numberArray.includes(e.key)) {
        handleNumber(e);
    } else if (operatorArray.includes(e.key)) {
        checkOperator(e);
    } else {
        switch(e.key) {
            case '=':
            case 'Enter':
                checkEquals(e); break;
            case 'Backspace':
                handleBackspace(e); break;
            case '%':
                calcPercentage(e); break;
            case 'Delete':
                resetCalc(e); break;
            case '.':
                handleDecimalPoint(e); break;
        }
    }
}

function calcPercentage(e) {
    if (e.type === 'keydown') {
        keyPressed = e.key;
    } else {
        keyPressed = e.target.innerText;
    }
    if (display.innerText === '0') {
        return;
    }

    if ((num1 === 0) || (num2 !== 0)) {
        return;
    }

    if (operatorIndex > 0) {
        upperDisplay.innerText += display.innerText + keyPressed;
        let firstNumber = num1;
        if (oper === '×') { // % of a number
            let percResult = getPercentage(num1, num2);
            return;
        }
        
        if ((oper === '+') || (oper === '-')) { // add a % to a number
            let percResult = getPercentage(num1, num2);
            getResult(firstNumber, percResult, oper);
            return;
        }
            
        if (oper === '/') { // divide a number by a %
            let firstOper = oper;
            num2 = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
            oper = '×';
            if (num2 > 0) {
                let firstResult = getResult(firstNumber, 100, oper);
                let result = getResult(firstResult, num2, firstOper);
            }
        }
    }
}

function getPercentage(num1, num2) {
    let result = 0;
    num2 = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
    let op = '×';
    // 1st part of % calculation
    if (num2 > 0) {
        result = getResult(num1, num2, op);
    }

    // 2nd part of % calculation
    if (result) {
            stackArray.push('/', 100);
            num2 = 100;
            let op = '/';
            operatorIndex = stackArray.indexOf(op);
            num1 = parseFloat(stackArray.slice(0, operatorIndex).join(''));
            return getResult(num1, num2, op);
    }
}

function toggleNegative(e) {
    if (display.innerText === '0') {
        return;
    }

    let negNum = parseFloat(display.innerText) * -1;
    if (operatorIndex === 0) {
        stackArray = [];
        storeKeyPressed(negNum);
    } else {
        stackArray.splice(operatorIndex + 1, Infinity, negNum);
    }
    display.innerText = negNum;
}

function handleDecimalPoint(e) {
    let decimal = '';
    if (e.type === 'keydown') {
        decimal = e.key;
    } else {
        decimal = e.target.innerText;
    }

    let lastCharIndex = upperDisplay.innerText.length - 1;
    if (upperDisplay.innerText[lastCharIndex] === opKeyPressed) {
        if (display.innerText === upperDisplay.innerText.substring(0, lastCharIndex)) {
    // To allow for a zero to be inserted before the decimal for the 2nd number in the calculation if not explicitly entered
            display.innerText = '0';
        }
    }

    // Display is empty
    if (display.innerText === '0')  { 
        stackArray.push(0, decimal);
        display.innerText += decimal;
        return;
    } 
    
    // There already exist a number in display - no decimal point
    if (display.innerText.indexOf(decimal) === -1) {
        display.innerText += decimal;
        stackArray.push(decimal);
    }
}

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
}

function handleBackspace(e) {
    display.classList.remove('error');
    display.innerText = '';
    upperDisplay.innerText = '';

    let el = stackArray.pop();
    if (typeof el !== 'number') {
        operatorIndex = 0;
    }

    stackArray.forEach(el => {
        el = el === '/' ? '÷' : el;
        display.innerText += el;
        upperDisplay.innerText += el;
    });

    if (stackArray.length === 0) {
        display.innerText = '0';
    }
}

function handleNumber(e) {
    operator = false;
    if (e.type === 'keydown') {
        keyPressed = e.key;
    } else {
        keyPressed = e.target.innerText;
    }

    if ((operatorIndex > 0) && (stackArray.slice(operatorIndex + 1).length === 0)) {
        display.innerText = '0';
    }
    storeKeyPressed(keyPressed); 
    updateDisplay(keyPressed);
}

function checkEquals(e) {
    if (e.type === 'keydown') { // Keyboard event
        opKeyPressed = e.key;
        opKeyPressed = e.key === 'Enter' ? '=' : e.key;
    } else {
        opKeyPressed = e.target.innerText;
    }

    if (stackArray.length === 0) {
        return;
    }

    if (upperDisplay.innerText.includes(opKeyPressed)) {
        return;
    }

    operator = true;
    updateUpperDisplay(); // with main display contents and operator

    if (operatorIndex > 0) {
        oper = getOperator();
        storeSecondValue();
    }
    
    let result =  getResult(num1, num2, oper);
    if ((!result) || (typeof result !== 'number')) {
        upperDisplay.innerText = '';
    }
}

function checkOperator(e) {
    if ((stackArray.length === 0)) {
        return;
    }
  
    if (e.type === 'keydown') {
        opKeyPressed = e.key;
        opKeyPressed = 
        opKeyPressed === '*' ? '×' : opKeyPressed;
    } else {
        opKeyPressed = e.target.innerText;
    }
    operator = true;
    oper = e.target.id === 'divide' ? '/' : opKeyPressed;

    // Operator pressed a 2nd time - already exist in stackArray
    if (operatorIndex > 0) {
        prevOper = getOperator();
        storeSecondValue();
        let result = getResult(num1, num2, prevOper);
        if (typeof result === 'number') {
            updateUpperDisplay();
            storeFirstValue();    // in this case, result of prev calc / 1st value of next calculation
        }
        return;   
    } 
    
    // 1st operation in calculation
    storeFirstValue();
    updateUpperDisplay();
}  

// ---------------------------------------------------------------------------------------------

// Update the main display with the contents of the key pressed/clicked or result calculated
function updateDisplay(value) {
    if (display.innerText === '0') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
}

// Update upper part of the display
function updateUpperDisplay() {
    opKeyPressed = opKeyPressed === '/' ? '÷' : opKeyPressed;
    if (opKeyPressed === '=') {
        upperDisplay.innerText += display.innerText + opKeyPressed;
    } else {
        upperDisplay.innerText = display.innerText + opKeyPressed;
    }
}

// ----------------------------------------------------------------------------------------------

function storeKeyPressed(keyPressed) {
    if (operator)  {
        stackArray.push(keyPressed); 
    } else {
        stackArray.push(parseFloat(keyPressed)); 
    }
}

// Store operator as well as digits before operator in array, in variable to be used in calculation
function storeFirstValue() {
    storeKeyPressed(oper);
    operatorIndex = stackArray.indexOf(oper);
    num1 = parseFloat(stackArray.slice(0, operatorIndex).join(''));
}

function storeSecondValue() {
    num2 = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
}

function getOperator() {
    return stackArray[operatorIndex];
}

function storeResult(result) {
    stackArray = [];
    stackArray.push(result);
    operatorIndex = 0;
}

function getResult(n1, n2, operator) {
    if ( ((n1 < 0) || (n1 >= 0)) &&
    ((n2 < 0) || (n2 >= 0)) ) {

        let result = operate(n1, n2, operator);
        display.innerText = '0'; 
        updateDisplay(result);
        if (!(display.classList.contains('error'))) {
            storeResult(result);
        }
        return result;

    }
}

function operate(a, b, op) {
   let result = 0; 
   switch(op) {
        case '+': result = add(a, b); break;
        case '-': result = subtract(a, b); break;
        case '/': result = divide(a, b); break;
        case '×': result = multiply(a, b); break;
    };
    let numSize = result.toString().split('').length;
    if (numSize > 12) {
        display.classList.add('error');
        return 'OVERFLOW ERROR';
    }
    return result;
}

function add(a, b) {
    let result = (a + b);
    if (Math.round(result) !== result) {
        result = parseFloat((result).toPrecision(10));
    }
    return result;
}

function subtract(a, b) {
    let result =  a - b;
    if (Math.round(result) !== result) {
        result = parseFloat((result).toPrecision(10));
    }
    return result;
}

function multiply(a, b) {
    let result =  ((a * 1000) * b) / 1000;
    if (Math.round(result) !== result) {
        result = parseFloat((result).toPrecision(10));
    }
    return result;
}

function divide(a, b) {
    if (b === 0) {
        display.classList.add('error');
        return 'DIVISION BY ZERO ERROR';
    } else {
        return parseFloat((a / b).toPrecision(10));
    }
}