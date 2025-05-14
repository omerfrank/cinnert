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
}

document.addEventListener('DOMContentLoaded',()=>{
    const form = document.getElementById('transaction-form');
    const manager = new TransactionManager();
    const transactionBody = document.getElementById('transactions-body')
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
        <td>${new Date(tx.date).toLocaleDateString()} </td>
        <td class="${tx.type}">${tx.type[0].toUpperCase() + tx.type.slice(1)}</td>
        <td>${tx.description}</td>
        <td class="${tx.type}">${tx.amount}</td>
        <td>${tx.category}</td>
        <td>
            <button class="delete-btn" data-index="${tx.id}">Delete</button>
        </td>
        `;
        transactionBody.appendChild(tr);
        
    }
    function reload(){
        let array = manager.reload();
        for (let index = 0; index < array.length; index++) {
            appendTransactionToTable(array[index]);
        }
    }
    reload();
});
