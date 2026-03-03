const correctPIN = "1234";  // CHANGE THIS PIN

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

const tenants = 7;

function login(){
    const entered = document.getElementById("pin").value;
    if(entered === correctPIN){
        document.getElementById("loginBox").style.display="none";
        document.getElementById("mainSystem").style.display="block";
        loadTable();
    } else {
        document.getElementById("loginMsg").innerText="Wrong PIN!";
    }
}

function loadTable(){
    const body = document.getElementById("tableBody");
    body.innerHTML="";
    
    months.forEach((month, mIndex)=>{
        let row = "<tr>";
        row += `<td>${month}</td>`;
        
        for(let t=0; t<tenants; t++){
            row += `<td><input type="number" data-month="${mIndex}" data-tenant="${t}" oninput="calculate()"></td>`;
        }
        row += "</tr>";
        body.innerHTML += row;
    });

    loadData();
    calculate();
}

function calculate(){
    let totalAmt = 0;
    
    for(let t=0; t<tenants; t++){
        let sum = 0;
        
        for(let m=0; m<12; m++){
            let input = document.querySelector(`input[data-month='${m}'][data-tenant='${t}']`);
            let val = parseFloat(input.value) || 0;
            sum += val;
        }
        
        document.getElementById("sum"+t).innerText = sum;
        totalAmt += sum;
    }

    document.getElementById("totalAmt").innerText = totalAmt;

    let withdraw = parseFloat(document.getElementById("withdraw").value) || 0;
    let balance = totalAmt - withdraw;

    document.getElementById("totalBalance").innerText = balance;

    saveData();
}

function saveData(){
    const inputs = document.querySelectorAll("input[data-month]");
    let data = {};
    
    inputs.forEach(input=>{
        data[`m${input.dataset.month}t${input.dataset.tenant}`] = input.value;
    });
    
    data.withdraw = document.getElementById("withdraw").value;
    
    localStorage.setItem("rentData", JSON.stringify(data));
}

function loadData(){
    let data = JSON.parse(localStorage.getItem("rentData")) || {};
    
    const inputs = document.querySelectorAll("input[data-month]");
    
    inputs.forEach(input=>{
        let key = `m${input.dataset.month}t${input.dataset.tenant}`;
        if(data[key]){
            input.value = data[key];
        }
    });
    
    if(data.withdraw){
        document.getElementById("withdraw").value = data.withdraw;
    }
}
