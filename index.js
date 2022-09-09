"use strict";
const bankTab = new Bank();
const workTab = new Work();

//Event listeners

//Bank
const loanButton = document.getElementById("loanBtn");

loanButton.addEventListener("click", () => {
  bankTab.takeALoan();
});

//Work
const bankButton = document.getElementById("bankBtn");

bankButton.addEventListener("click", () => {
  workTab.bankSalary(bankTab);
});

const workButton = document.getElementById("workBtn");

workButton.addEventListener("click", () => {
  workTab.work();
});

const repayLoanButton = document.getElementById("repayLoanBtn");

repayLoanButton.addEventListener("click", () => {
  workTab.repayLoan(bankTab);
});

//Bank
//Balance id = balance
//Loan button id = loanButton
//TODO: Tidy up the code
function Bank() {
  this.balance = parseInt(document.getElementById("balance").innerText);
  this.loan = 0;
  this.numberOfLoans = 0;

  //TODO: Legg til number formater
  //Update the current balance
  this.updateBalance = (amount) => {
    this.balance += amount;
    document.getElementById("balance").innerText = this.balance;
  };

  this.updateLoan = (amount) => {
    if (this.loan - amount <= 0) {
      this.loan = 0;
      this.numberOfLoans = 0;
      document.getElementById("loan").innerText = this.loan;
      this.loanVisibility();
    } else {
      this.loan -= amount;
      document.getElementById("loan").innerText = this.loan;
    }
  };

  //Take a loan
  this.takeALoan = () => {
    let loan = prompt(
      "You can take a maximum loan of: " +
        this.balance * 2 +
        ". Please enter how much you want to loan."
    );

    let parsedLoan = parseInt(loan);

    if (parsedLoan <= this.balance * 2 && this.numberOfLoans < 1) {
      this.updateBalance(parsedLoan);
      this.numberOfLoans++;
      this.loan = parsedLoan;
      document.getElementById("loan").innerText = parsedLoan;
      this.loanVisibility();
    } else {
      alert("You are not eligable for that loan");
    }
  };

  //Toggles the visibility of outstaing loans
  this.loanVisibility = () => {
    let loanTxt = document.getElementById("loanTxt");
    let outstaingLoan = document.getElementById("loan");
    let repayLoanBtn = document.getElementById("repayLoanBtn");

    if (this.loan == 0) {
      loanTxt.style.display = "none";
      outstaingLoan.style.display = "none";
      repayLoanBtn.style.display = "none";
    } else {
      loanTxt.style.display = "block";
      outstaingLoan.style.display = "block";
      repayLoanBtn.style.display = "block";
    }
  };
}

//Work
function Work() {
  this.salary = parseInt(document.getElementById("salary").innerText);

  this.bankSalary = (bank) => {
    if (bank.numberOfLoans != 0) {
      if (bank.loan < this.salary * 0.1) {
        let actualSalary = this.salary - bank.loan;
        let downPayment = bank.loan;
        bank.updateBalance(actualSalary);
        bank.updateLoan(downPayment);
        this.updateSalary();
      } else {
        let actualSalary = this.salary * 0.9;
        let downPayment = this.salary * 0.1;
        bank.updateBalance(actualSalary);
        bank.updateLoan(downPayment);
        this.updateSalary(0);
      }
    } else {
      bank.updateBalance(this.salary);
      this.updateSalary(0);
    }
  };

  this.work = () => {
    this.salary += 100;
    document.getElementById("salary").innerText = this.salary;
  };

  this.repayLoan = (bank) => {
    if (this.salary >= bank.loan) {
      let newSalary = this.salary - bank.loan;
      bank.updateLoan(bank.loan);
      this.updateSalary(newSalary);
    } else {
      alert("Your salary is not high enough to pay of the loan");
    }
  };

  this.updateSalary = (newSalary) => {
    console.log("New salary: " + newSalary);
    this.salary = newSalary;
    document.getElementById("salary").innerText = newSalary;
  };
}
//Pay balance id = pay

//Bank button id = bankButton

//Work button id = workButton
