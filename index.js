"use strict";
//Utils
const bankTab = new Bank();
const workTab = new Work();
const laptopTab = new Laptops();
const utils = new Utils ();

bankTab.updateBalance(200);
document.getElementById('salary').innerText = utils.formatNumber(0);

laptopTab.renderLaptops();


//Loan button event listener
const loanButton = document.getElementById("loanBtn");

loanButton.addEventListener("click", () => {
  bankTab.takeALoan();
});

//Bank button event listener
const bankButton = document.getElementById("bankBtn");

bankButton.addEventListener("click", () => {
  workTab.bankSalary(bankTab);
});

//Work button event listener
const workButton = document.getElementById("workBtn");

workButton.addEventListener("click", () => {
  workTab.work();
});

//Reoay loan button event listener
const repayLoanButton = document.getElementById("repayLoanBtn");

repayLoanButton.addEventListener("click", () => {
  workTab.repayLoan(bankTab);
});

//Buy laptop now button event listener
const buyNowBtn = document.getElementById('buyNowBtn');

buyNowBtn.addEventListener('click', () => {
  laptopTab.buyLaptop(bankTab);
})


//Laptop dropdown event listener
const laptopDropdown = document.getElementById('dropdownSelector');

laptopDropdown.addEventListener('change', (event) => {
  laptopTab.selectLaptop(event);
});


//Bank object
function Bank() {
  this.balance = 0;
  this.loan = 0;
  this.numberOfLoans = 0;
  let utils = new Utils();


  //Update the current balance
  this.updateBalance = (amount) => {
    this.balance += (amount);
    console.log(this.balance);
    document.getElementById("balance").innerText = utils.formatNumber(this.balance);
  };

  //Update the loan
  this.updateLoan = (amount) => {
    if (this.loan - amount <= 0) {
      this.loan = 0;
      this.numberOfLoans = 0;
      document.getElementById("loan").innerText = utils.formatNumber(this.loan);
      this.loanVisibility();
    } else {
      this.loan -= amount;
      document.getElementById("loan").innerText = utils.formatNumber(this.loan);
    }
  };

  //Take a loan
  this.takeALoan = () => {
    if (this.numberOfLoans > 0) {
      alert('You are not eligable for a loan. Please pay of your existing loan.');
      return false;
    }

    let loan = prompt(
      "You can take a maximum loan of: " +
        this.balance * 2 +
        " kr. Please enter how much you want to loan."
    );

    let parsedLoan = parseInt(loan);
    if (parsedLoan <= this.balance * 2 && this.numberOfLoans < 1) {
      this.updateBalance(parsedLoan);
      this.numberOfLoans++;
      this.loan = parsedLoan;
      document.getElementById("loan").innerText = utils.formatNumber(parsedLoan);
      this.loanVisibility();
    } else {
      alert("You are not eligable for that loan");
    }
  };

  //Toggles the visibility of loans and repay loan button
  this.loanVisibility = () => {
    let loanTxt = document.getElementById("loanTxt");
    let outstandingLoan = document.getElementById("loan");
    let repayLoanBtn = document.getElementById("repayLoanBtn");

    if (this.loan == 0) {
      loanTxt.style.display = "none";
      outstandingLoan.style.display = "none";
      repayLoanBtn.style.display = "none";
    } else {
      loanTxt.style.display = "block";
      outstandingLoan.style.display = "block";
      repayLoanBtn.style.display = "block";
    }
  };
}


//Work object
function Work() {
  this.salary = 0;
  let utils = new Utils();

  //Update the salary
  this.updateSalary = (newSalary) => {
    console.log("New salary: " + newSalary);
    this.salary = newSalary;
    document.getElementById("salary").innerText = utils.formatNumber(newSalary);
  };

  //Add the salary to the bank, repay a part of the loan if there is an outstanding loan
  this.bankSalary = (bank) => {
    if (bank.numberOfLoans != 0) {
      if (bank.loan < this.salary * 0.1) {
        bank.updateBalance(this.salary - bank.loan);
        bank.updateLoan(bank.loan);
      } else {
        bank.updateBalance(this.salary * 0.9);
        bank.updateLoan(this.salary * 0.1);
      }
    } else {
      bank.updateBalance(this.salary);
    }
    this.updateSalary(0);
  };

  //Add money to the salary
  this.work = () => {
    this.salary += 100;
    document.getElementById("salary").innerText = utils.formatNumber(this.salary);
  };

  //Repay the full loan if the salary is equal or higher than the loan
  this.repayLoan = (bank) => {
    if (this.salary >= bank.loan) {
      let newSalary = this.salary - bank.loan;
      bank.updateLoan(bank.loan);
      this.updateSalary(newSalary);
    } else {
      alert("Your salary is not high enough to pay of the loan");
    }
  };
}


//Laptops object
function Laptops () {
  this.allLaptops = {};
  this.laptop = {};
  const utils = new Utils();

  //Fetch laptops from Heroku
  this.fetchLaptops =  async function getLaptops () {
    try {
      let res = await fetch("https://noroff-komputer-store-api.herokuapp.com/computers");
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  //Render the laptops to the dropdown menu
  this.renderLaptops = async function renderLaptops () {
    this.allLaptops = await this.fetchLaptops();
    let select = document.getElementById("dropdownSelector");

    for (let i = 0; i < this.allLaptops.length; i++) {
      let option = document.createElement('option');
      option.value = this.allLaptops[i].id;
      option.text = this.allLaptops[i].title;
      select.appendChild(option);
    }
    this.laptop = this.allLaptops[0];
    this.printLaptopInfo(this.laptop);
  }

  //Select a specific laptop and display its information
  this.selectLaptop = (event) => {
    this.laptop = this.allLaptops[event.target.value-1];
    this.printLaptopInfo(this.laptop);
  }

  //Display a laptops information
  this.printLaptopInfo = (laptop) => {
    let specList = document.getElementById("specs");
    specList.innerText = '';
    let laptopSpecs = this.laptop.specs;
    for(let spec of laptopSpecs) {
      console.log(spec);
      let li = document.createElement('li');
      li.innerText = spec;
      li.style.fontSize = 'small';
      li.className = "boxSpecs";
      specList.appendChild(li);
    }
    document.getElementById('descriptionTitle').innerText = (laptop.title);
    document.getElementById('descriptionText').innerText = (laptop.description);
    document.getElementById('price').innerText = (utils.formatNumber(laptop.price));
    document.getElementById('laptopImage').src = ('https://noroff-komputer-store-api.herokuapp.com/' + laptop.image);
  }

  //Buy a selected laptop if the bank balance is equal to or higher than the laptop price
  this.buyLaptop = (bank) => {
    if (this.laptop.price <= bank.balance) {
      bank.updateBalance(parseInt('-' + this.laptop.price));
      alert('Congratulations! You are now the proud owner of a ' + this.laptop.title + " laptop!");
    } else {
      alert('You dont have the balance to purcahse this laptop');
    }
  }
}

//Utils object
function Utils () {
  //Format a number to norwegian currency
  this.formatNumber = (number) => {
    let formatter = new Intl.NumberFormat('nb-NB',{ style:'currency', currency:'NOK', currencyDisplay:'narrowSymbol', maximumFractionDigits: 0});
    return formatter.format(number);
  }
}

