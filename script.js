document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitForSecondOperand = false;
    let expression = '';
    let previousAnswer = null;

    function updateDisplay() {
        display.textContent = expression || currentInput;
    }

    buttons.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.classList.contains('btn')) {
            return;
        }

        const buttonText = target.textContent;

        if (target.classList.contains('no')) {
            handleNumber(buttonText);
        } else if (target.classList.contains('clear')) {
            handleClear();
        } else if (target.classList.contains('delete')) {
            handleDelete();
        } else if (target.classList.contains('ans')) {
            handleAns();
        } else if (target.classList.contains('equals')) {
            handleEquals();
        } else if (target.classList.contains('operator')) {
            if (['√', '%', 'log', '2^x'].includes(buttonText)) {
                handleAdvancedOperator(buttonText);
            } else {
                handleOperator(buttonText);
            }
        }
        
        updateDisplay();
    });

    function handleNumber(number) {
        if (waitForSecondOperand === true) {
            currentInput = number;
            waitForSecondOperand = false;
        } else {
            if (number === '.' && currentInput.includes('.')) {
                return;
            }
            currentInput = currentInput === '0' && number !== '00' ? number : currentInput + number;
        }
        
        // This is the core fix. The expression is now built by combining the first operand and the current input.
        if (firstOperand !== null && operator !== null) {
            expression = `${firstOperand} ${operator} ${currentInput}`;
        } else {
            expression = currentInput;
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        // If an operator is already set, perform the calculation
        if (operator && !waitForSecondOperand) {
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = `${parseFloat(result.toFixed(7))}`;
            firstOperand = parseFloat(currentInput);
            expression = currentInput;
        } else {
            firstOperand = inputValue;
        }

        operator = nextOperator;
        waitForSecondOperand = true;
        expression = `${firstOperand} ${operator}`;
    }

    function handleAdvancedOperator(op) {
        const inputValue = parseFloat(currentInput);
        let result = 0;
        
        if (op === '√') {
            result = Math.sqrt(inputValue);
            expression = `√(${currentInput}) = ${parseFloat(result.toFixed(7))}`;
        } else if (op === '%') {
            result = inputValue / 100;
            expression = `${currentInput}% = ${parseFloat(result.toFixed(7))}`;
        } else if (op === 'log') {
            result = Math.log10(inputValue);
            expression = `log(${currentInput}) = ${parseFloat(result.toFixed(7))}`;
        } else if (op === '2^x') {
            result = Math.pow(2, inputValue);
            expression = `2^(${currentInput}) = ${parseFloat(result.toFixed(7))}`;
        }

        currentInput = `${parseFloat(result.toFixed(7))}`;
        previousAnswer = currentInput;
        firstOperand = null;
        operator = null;
        waitForSecondOperand = true;
    }

    function handleEquals() {
        if (operator === null || waitForSecondOperand) {
            return;
        }

        const secondOperand = parseFloat(currentInput);
        const result = performCalculation[operator](firstOperand, secondOperand);

        currentInput = `${parseFloat(result.toFixed(7))}`;
        previousAnswer = currentInput;
        firstOperand = null;
        operator = null;
        waitForSecondOperand = true;
        expression = `${expression} = ${currentInput}`;
    }

    function handleClear() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitForSecondOperand = false;
        expression = '';
    }

    function handleDelete() {
        if (waitForSecondOperand === true) {
            return; // Don't delete a completed expression
        }
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        
        // This will update the expression to reflect the deletion
        if (firstOperand !== null && operator !== null) {
            expression = `${firstOperand} ${operator} ${currentInput}`;
        } else {
            expression = currentInput;
        }
    }

    function handleAns() {
        if (previousAnswer !== null) {
            currentInput = previousAnswer;
            expression = previousAnswer;
            waitForSecondOperand = false;
        }
    }

    const performCalculation = {
        '÷': (firstOperand, secondOperand) => firstOperand / secondOperand,
        'x': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '^': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand)
    };

    updateDisplay();
});