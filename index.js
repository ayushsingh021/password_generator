//creating variables of element  which we will change with js


// syntax -- > custom attribute
{/* <div data-custom-attribute="example">Hello, world!</div>
const element = document.querySelector('[data-custom-attribute="example"]'); */}

// VARIABLES
const inputSlider = document.querySelector("[data-lengthSlider]");  //fetching using custom attribute
const lengthDisplay = document.querySelector("[data-length]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = "!@#$%^&*()_+-={'<>?,./`~";


let password ="";
let passwordLength = 8;
let checkCount =  0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");

//FUNCTIONS ---
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInt(max ,min){
    return Math.floor(Math.random() * (max- min)) + min ;
}

function getRndNum(){
    return getRndInt(0,9);
}

function generateLowerCase(){
    //int achii val for lowercase -- (97-123 ) -- String.fromCharCode gives char of aschii no
    return String.fromCharCode(getRndInt(97,123));
}
function generateUpperCase(){
    //int achii val for lowercase -- (97-123 ) -- String.fromCharCode gives char of aschii no
    return String.fromCharCode(getRndInt(65,91));
}
function generateSymbol(){
    const rndNum = getRndInt(0 ,symbols.length);
    // console.log(symbols.charAt(rndNum));
    return symbols.charAt(rndNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;
    let hasNum = false;

    if(uppercaseCheck.checked) hasUpper =true;
    if(lowercaseCheck.checked) hasLower =true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym =true;

    if(hasUpper && hasLower && (hasSym|| hasNum) && passwordLength >= 8 ){
        setIndicator("#0f0");
    }else if((hasUpper || hasLower) && (hasNum || hasSym)  && passwordLength >=6 ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    //try & catch error handing
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } 
    catch (e) {
        copyMsg.innerText = "Failed!";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function sufflePassword(array){
    //Fisher yates method
    for(let i = array.length-1; i> 0 ;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp =array[i];
        array[i] =array[j] ;
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) =>(str+=el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

//EVENTLISTNERS----
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input' , (eventval) => {
    passwordLength = eventval.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', ()=> {
    if(passwordDisplay.value)
        copyContent();
    
})

generateBtn.addEventListener('click' , ()=>{
    //if none of cheakbox is selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){ 
        passwordLength =checkCount ;
        handleSlider();
    };

    //new password finding logic

    //remove old password
    console.log('starting the journey');
    password = "";

    //lets put the mentioned by checkboxes
    //Le-man
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += getRndNum();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];
    if(uppercaseCheck.checked)
         funArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
         funArr.push(generateLowerCase);
    if(numbersCheck.checked)
         funArr.push(getRndNum);
    if(symbolsCheck.checked)
         funArr.push(generateSymbol);

    //compulsory addition
    for(let i = 0 ; i<funArr.length;i++){
        password += funArr[i]();
    }
console.log("comp running");
    //remaining addition
    for(let i = 0 ; i < passwordLength - funArr.length ; i++){
        let randIdx = getRndInt(0,funArr.length);
        console.log(randIdx);
        password += funArr[randIdx]();
console.log("fun running");

    }

    //suffle the password
    // Array.from() method converts each character of the string "hello" into separate elements in a new array charArray.
    password = sufflePassword(Array.from(password));
    console.log("suff running");

    //showed  in Ui
    passwordDisplay.value = password;

    //calculate strenth
    calcStrength();
})