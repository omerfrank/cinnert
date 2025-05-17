import {formatPrice,formatDate} from './utils.js';

class Transaction
{
    static _lastId = 0;
    constructor(type,description,amount,category,date = new Date())
    {       
        this.id = ++Transaction._lastId;
        this.type = type;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;

    }

    toObject(){
        return {
            id: this.id,
            type: this.type,
            description: this.description,
            amount: this.amount,
            category: this.category,
            date: this.date.toISOString(),
        };
    }
}
class TransactionManager{
    constructor(){
        if(localStorage.getItem("transactions") == null){
            this.transactions = [];
            localStorage.setItem("transactions",JSON.stringify(this.transactions));
        }
        else{
            this.transactions = JSON.parse( localStorage.getItem("transactions"));
            this.transactions.forEach(() => {
                Transaction._lastId++;
            });
        }
    }

    add(tx){
        this.transactions.push(tx);
        localStorage.setItem("transactions",JSON.stringify(this.transactions));
        console.log(tx.toObject());
        
    }
    remove(id){
        this.transactions = this.transactions.filter((tx) => tx.id != id );
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
        console.log(this.transactions);
                
    }
    reload(){
        return this.transactions;
    }
    findIncome(){
        const incomeRows = []
        for (let index = 0; index < this.transactions.length; index++) {
            const transaction = this.transactions[index];
            if (transaction.type === "income") {
                console.log(transaction.description);
                incomeRows.push(`${transaction.id}`);
            }
        }
        return incomeRows;
    }
    findExpanse(){
        const incomeRows = []
        for (let index = 0; index < this.transactions.length; index++) {
            const transaction = this.transactions[index];
            if (transaction.type === "expense") {
                console.log(transaction.description);
                incomeRows.push(`${transaction.id}`);
            }
        }
        return incomeRows;
    }
    findAll(){
        const incomeRows = []
        for (let index = 0; index < this.transactions.length; index++) {
            const transaction = this.transactions[index];
            incomeRows.push(`${transaction.id}`);
        }
        return incomeRows;
    }
    searchDescription(input){
        const incomeRows = []
        for (let index = 0; index < this.transactions.length; index++) {
            const transaction = this.transactions[index];
            if (transaction.description.includes(input)) {
                console.log(transaction.description);
                incomeRows.push(`${transaction.id}`);
            }
        }
        return incomeRows; 
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    const form = document.getElementById('transaction-form');
    const manager = new TransactionManager();
    const transactionBody = document.getElementById('transactions-body')
    const filter = document.getElementById('filter')
    const search = document.getElementById('search')
    form.addEventListener('submit' ,(e) => {
        e.preventDefault();

        const type = form.querySelector('#type').value;
        const description = form.querySelector('#description').value.trim();
        const amountVal = form.querySelector('#amount').value;
        const category = form.querySelector('#category').value;
        
        const amount = parseFloat(amountVal);

        if(!type || !description || isNaN(amount) || !category){
            console.error("provide better");
            return;
        }
        const tx = new Transaction(type,description,amount,category);
        manager.add(tx);
        appendTransactionToTable(tx);
        form.reset();
    });
    transactionBody.addEventListener('click',(e)=>{
        if(e.target.classList.contains('delete-btn')){
            const id = Number(e.target.dataset.index);
            manager.remove(id);
            e.target.closest('tr').remove();
        }
    });
    function appendTransactionToTable(tx){
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${formatDate(new Date(tx.date))} </td>
        <td class="${tx.type}">${tx.type[0].toUpperCase() + tx.type.slice(1)}</td>
        <td>${tx.description}</td>
        <td class="${tx.type}">${formatPrice(tx.amount)}</td>
        <td>${tx.category}</td>
        <td>
            <button class="delete-btn" data-index="${tx.id}">Delete</button>
        </td>
        `;
        console.log(tx.type);
        
        transactionBody.appendChild(tr);
        
    }
    function reload(){
        let array = manager.reload();
        for (let index = 0; index < array.length; index++) {
            appendTransactionToTable(array[index]);
        }
    }
    reload();
    // filter.addEventListener('change',(e)=>{
    //     console.log(e.target.value); // return the current value for the input 
    //     // transactionBody.getElementsByClassName('income')[0].closest('tr').style.display="none"
    //     // transactionBody.getElementsByClassName('income').forEach();
    //     console.log(transactionBody.getElementsByClassName('income')[0].closest('tr'));
    //     const otherType = e.target.value === 'income' ? 'expense' : 'income';
    //     const removeNodes = transactionBody.getElementsByClassName(e.target.value);
    //     const addNodes = transactionBody.getElementsByClassName(otherType);

    //     for (let index = 0; index < removeNodes.length; index++) {
    //         const element = removeNodes[index];
    //         element.closest('tr').style.display="none"          
    //     }


    // })
    function applyFilter() {
        console.log("start");
        const nodes = document.querySelectorAll("[data-index]");
        let filterby_search = manager.searchDescription(search.value);
        let filterby_filter;
        if (filter.value == "all") {
            filterby_filter = manager.findAll();
        } else if (filter.value == "income") {
            filterby_filter = manager.findIncome();
        } else {
            filterby_filter = manager.findExpanse();
        }
        
        let applyied = filterby_search.filter(value => filterby_filter.includes(value));
        nodes.forEach((tr)=>{
            console.log ("data index: ", tr.getAttribute("data-index"));
            if (applyied.includes(tr.getAttribute("data-index"))){
                console.log("tr.closest('tr')");
                tr.closest('tr').style.display = "";
            }
            else{
                tr.closest('tr').style.display = "none";
            }
        })
        
    }
    filter.addEventListener('change',applyFilter);
    search.addEventListener('input',applyFilter);
    // filter.addEventListener('change',(e)=>{
    //     // // console.log(manager.transactions[0].id)
    //     // const nodes = document.querySelectorAll("[data-index]"); // find all of the buttons (for some reason)
    //     // const node = nodes[0].closest('tr').getElementsByClassName(e.target.value);
    //     // console.log(node);
    //     // להוסיף getElementsByClassName  
    //     console.log(filter.value);
        
    //     let filterby;
    //     if (e.target.value == "all") {
    //         filterby = manager.findAll();
    //     } else if (e.target.value == "income") {
    //         filterby = manager.findIncome();
    //     } else if (e.target.value == "expense") {
    //         filterby = manager.findExpanse();
    //     }
    //     const nodes = document.querySelectorAll("[data-index]");
    //     // let tr = nodes[0];
    //     // tr.closest('tr').style.display = 'none';
    //     // tr.closest('tr').style.display = '';
    //     console.log("filter: ",filterby)
    //     nodes.forEach((tr)=>{
    //         console.log ("data index: ", tr.getAttribute("data-index"));
    //         if (filterby.includes(tr.getAttribute("data-index"))){
    //             console.log("tr.closest('tr')");
    //             tr.closest('tr').style.display = "";
    //         }
    //         else{
    //             tr.closest('tr').style.display = "none";
    //         }
    //     })
        
    // });
    // search.addEventListener('input',(e)=>{
    //     let filterby = manager.searchDescription(e.target.value); 
    //     const nodes = document.querySelectorAll("[data-index]");
    //     console.log("filter: ",filterby)
    //     nodes.forEach((tr)=>{
    //         console.log ("data index: ", tr.getAttribute("data-index"));
    //         if (filterby.includes(tr.getAttribute("data-index"))){
    //             console.log("tr.closest('tr')");
    //             tr.closest('tr').style.display = "";
    //         }
    //         else{
    //             tr.closest('tr').style.display = "none";
    //         }
    //     })

    // })


});

