// fetching the slider
const inputSlider = document.querySelector('[data-lengthSlider]');

// fetching the number which will get update on moving the slider
const lengthDisplay = document.querySelector('[data-lengthNumber]');

// fetching the password attribute to display
const passwordDisplay = document.querySelector('[data-passwordDisplay]');

// fetching the copy button to copy
const copyBtn = document.querySelector('[data-copy]');

// fetching the copy message 
const copyMsg = document.querySelector('[data-copyMsg]')

// fetching the uppercase
const upperCaseCheck = document.querySelector("#uppercase");

// fetching the lowercase
const lowerCaseCheck = document.querySelector("#lowercase");

// fetching the numbers
const numbersCheck = document.querySelector('#numbers');

// fetching the symbols
const symbolsCheck = document.querySelector('#symbols');

// fetching the indicator
const indicator = document.querySelector('[data-indicator]');

// fetching the generate button
const generateBtn = document.querySelector('.generateButton');

// fetching all the checkboxes
const allCheckBox = document.querySelectorAll('input[type=checkbox]');

// writing symbols to select from them randomly
const symbols = '~!@#$`%^&*()_+-={}|[]:;<>?/';


// on start 
let password = "";
let passwordLength = 10;
let checkCount = 0;  //only one check was enabled by default

//set strength circle to grey
setIndicator('#ccc');

handleSlider();

//set strength circle to grey

// sets password length according to password's length (handles the slider)
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min,max){
    return Math.floor(Math.random() *  (max - min)) + min;
}

function generateRandomNumber(){
    // if you want 1 random integer
    return getRandInteger(0,9); 
}

function generateLowerCase(){

    // if you want a-z alphabets
    return String.fromCharCode(getRandInteger(97,123)); // returns numbers - to convert them to strings => String.fromCharCode
}
 
function generateUpperCase(){

    // if you want A-Z alphabets
    return String.fromCharCode(getRandInteger(65,91)); // returns numbers - to convert them to strings => String.fromCharCode
}

function generateSymbol(){
    const randNum = getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked) hasUpper = true;   // if uppercasecheck is checked then mark hasupper to True
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);         //this method returns promise and helps to copy text to clipboard
        copyMsg.innerText = "Copied!";
    }
    catch(e){
        copyMsg.innerText = "Failed!";
    }


    // to make copied text visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);

}


// adding event listeners 

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        {
            copyContent();
        }
})

function shufflePassword(array){
    // algorithm for shuffling - Fisher Yates method

    for(let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            {
                checkCount++;
            }
    });

    //special condition
    if(passwordLength < checkCount)
        {
            passwordLength = checkCount;
            handleSlider();
        }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange)
})
 

generateBtn.addEventListener('click',() => {

    //none of the checkboxes are selected
    if(checkCount == 0)
        {
            return;
        }
    
    if(passwordLength < checkCount)
        {
            passwordLength = checkCount;
            handleSlider();
        }

    // let's start the journey to find the new password

    // remove old password

    password = "";

    // putting the stuff mentioned by checkboxes
    
    // if(upperCaseCheck.checked)
    //     {
    //         password += generateUpperCase();
    //     }

    // if(lowerCaseCheck.checked)
    //     {
    //         password += generateLowerCase();
    //     }

    // if(numbersCheck.checked)
    //     {
    //         password += generateRandomNumber();
    //     }
         
    // if(symbolsCheck.checked)
    //     {
    //         password += generateSymbol();
    //     }


    let functionArray = [];
    if(upperCaseCheck.checked)
        {
            functionArray.push(generateUpperCase);
        }
    
    if(lowerCaseCheck.checked)
        {
            functionArray.push(generateLowerCase);
        }
            
    if(symbolsCheck.checked)
        {
            functionArray.push(generateSymbol);
        }
                
    if(numbersCheck.checked)
        {
            functionArray.push(generateRandomNumber);
        }

    // compulsory addition

    for(let i = 0; i < functionArray.length; i++)
        {
            password += functionArray[i]();
        }

    // remaining addition

    for(let i = 0; i < passwordLength - functionArray.length; i++)
        {
            let randIndex = getRandInteger(0,functionArray.length);         
            password += functionArray[randIndex]();
        }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI 
    passwordDisplay.value = password;
    //calculate strength
    calcStrength();

});