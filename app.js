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
    if (display.innerText !== '0') {
        if ((num1 > 0) && (num2 === 0)) {
            if (operatorIndex > 0) {
                upperDisplay.innerText += display.innerText;
                upperDisplay.innerText += keyPressed;
                let firstNumber = num1;
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
        }
    }
}

function getPercentage(num1, num2) {
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
    let result = getResult(num1, num2, oper);
    return result;
}

function toggleNegative(e) {
    if (display.innerText !== '0') {
        let negNum = parseFloat(display.innerText) * -1;
        if (operatorIndex === 0) {
            stackArray = [];
            storeKey(negNum);
        } else {
            stackArray.splice(operatorIndex + 1, Infinity, negNum);
        }
        display.innerText = negNum;
    }
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
    // To allow for a zero to be inserted before the dec for the 2nd number in the calculation if not explicitly entered
            display.innerText = '0';
        }
    }
    if (display.innerText === '0')  { // Display is empty
        stackArray.push(0, decimal);
        display.innerText += decimal;
    } else {   // There already exist a number in display - no      decimal point
        if (display.innerText.indexOf(decimal) === -1) {
            display.innerText += decimal;
            stackArray.push(decimal);
        }
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
    console.log('in backspace - enter - opIndx:', operatorIndex);
    console.log('stackArray:', stackArray);
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
    console.log('in backspace - before exit - opIndx:', operatorIndex);
    console.log('stackArray:', stackArray);
    // return;
}

function checkEquals(e) {
    if (e.type === 'keydown') { // Keyboard event
        keyPressed = e.key;
        keyPressed = e.key === 'Enter' ? '=' : e.key;
    } else {
        keyPressed = e.target.innerText;
    }
    if (stackArray.length !== 0) {
        operator = true;
        upperDisplay.innerText += display.innerText;
        upperDisplay.innerText += keyPressed;
        if (operatorIndex > 0) {
            num2 = parseFloat(stackArray.slice(operatorIndex + 1).join(''));
            oper = stackArray[operatorIndex];
        }
        // let bool = num2 ? true : false;
        console.log({num1}, {num2}, {oper});
        
        if ( ((num1 < 0) || (num1 >= 0)) &&
             ((num2 < 0) || (num2 >= 0)) ) {
            getResult(num1, num2, oper);
        } else {
            upperDisplay.innerText = '';
        }
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
    storeKey(keyPressed); 
    updateDisplay(keyPressed);
}

function checkOperator(e) {
    if ((stackArray.length !== 0)) {
        console.log('in checkOp - before', stackArray);  
        if (e.type === 'keydown') {
            opKeyPressed = e.key;
            opKeyPressed = 
            opKeyPressed === '*' ? 'x' : opKeyPressed;
        } else {
            opKeyPressed = e.target.innerText;
        }
        operator = true;
        oper = e.target.id === 'divide' ? '/' : opKeyPressed;
        // Operator pressed a 2nd time - already exist in stackArray
        if (operatorIndex > 0) {
            prevOper = stackArray[operatorIndex]; 
            num2 = parseFloat(stackArray.slice(operatorIndex + 1).join('')); 
            if ( ((num1 < 0) || (num1 >= 0)) &&
                 ((num2 < 0) || (num2 >= 0)) ) {
                let result = getResult(num1, num2, prevOper);
                if (typeof result === 'number') {
                    upperDisplay.innerText = result;

                    opKeyPressed = opKeyPressed === '/' ? '÷' : opKeyPressed;
                    upperDisplay.innerText += opKeyPressed; 

                    storeKey(oper);
                    operatorIndex = stackArray.indexOf(oper);
                    num1 = parseFloat(stackArray.slice(0, operatorIndex).join(''));
                }

            }    
        } else {  // Store the operator in the stackArray
            upperDisplay.innerText = display.innerText;
            storeKey(oper);
            // Store digits from array before operator in variable
            operatorIndex = stackArray.indexOf(oper);
            num1 = parseFloat(stackArray.slice(0, operatorIndex).join(''));

            opKeyPressed = opKeyPressed === '/' ? '÷' : opKeyPressed;
            upperDisplay.innerText += opKeyPressed; 
        }
        console.log('in checkOp - after', stackArray);  
    }
}

function storeKey(keyPressed) {
    if (operator)  {
        stackArray.push(keyPressed); 
    } else {
        stackArray.push(parseFloat(keyPressed)); 
    }
}

// Update the display with the contents of the key pressed/clicked
function updateDisplay(keyPressed) {
    if (display.innerText === '0') {
         display.innerText = keyPressed;
        } else {
            display.innerText += keyPressed;
        }
}
            

function getResult(n1, n2, oper) {
    let result = operate(n1, n2, oper);
    display.innerText = '0'; 
    display.innerText = result;
    if (!(display.classList.contains('error'))) {
        stackArray = [];
        operatorIndex = 0;
        stackArray.push(result);
    }
    return result;
}

function operate(a, b, op) {
   let result = 0; 
   switch(op) {
        case '+': result = add(a, b); break;
        case '-': result = subtract(a, b); break;
        case 'x': result = multiply(a, b); break;
        case '/': result = divide(a, b); break;
    };
    let numSize = result.toString().split('').length;
    console.log('numSize:', numSize);
    if (numSize > 12) {
        display.classList.add('error');
        return 'OVERFLOW ERROR';
    }
    return result;
}

function add(a, b) {
    console.log('+', {a}, {b});
    let result = (a + b);
    console.log('result - before:', result);
    console.log('result - before - rounded:', Math.round(result));
    if (Math.round(result) !== result) {
        result = parseFloat((result).toPrecision(12));
        console.log('result - after:', result);
    }
    return result;
}

function subtract(a, b) {
    console.log('-', {a}, {b});
    let result =  a - b;
    console.log('result - before:', result);
    console.log('result - before - rounded:', Math.round(result));
    if (Math.round(result) !== result) {
        result = parseFloat((result).toPrecision(12));
        console.log('result - after:', result);
    }
    return result;
}

function multiply(a, b) {
    console.log('*', {a}, {b});
    let result =  ((a * 1000) * b) / 1000;
    if (Math.round(result) !== result) {
        result = parseFloat((result).toPrecision(12));
    }
    return result;

}

function divide(a, b) {
    console.log('divide', typeof a,  typeof b);
    if (b === 0) {
        display.classList.add('error');
        return 'DIVISION BY ZERO ERROR';
    } else {
        return parseFloat((a / b).toPrecision(12));
    }
}