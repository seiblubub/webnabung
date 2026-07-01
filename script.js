let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let target = Number(localStorage.getItem("target")) || 0;

const saldoEl = document.getElementById("saldo");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const historyList = document.getElementById("historyList");
const fill = document.getElementById("fill");
const percent = document.getElementById("percent");

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("target", target);
}

function totalIncome() {
    return transactions
        .filter(t => t.type === "income")
        .reduce((a, b) => a + b.amount, 0);
}

function totalExpense() {
    return transactions
        .filter(t => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0);
}

function totalSaldo() {
    return totalIncome() - totalExpense();
}

function rupiah(nominal) {
    return "Rp" + nominal.toLocaleString("id-ID");
}

function updateDashboard() {

    const income = totalIncome();
    const expense = totalExpense();
    const saldo = totalSaldo();

    saldoEl.textContent = rupiah(saldo);
    incomeEl.textContent = rupiah(income);
    expenseEl.textContent = rupiah(expense);

    if(target > 0){

        let progress = Math.min((saldo / target) * 100,100);

        fill.style.width = progress + "%";

        percent.innerText = progress.toFixed(0) + "%";

    }else{

        fill.style.width = "0%";

        percent.innerText = "0%";

    }

}

function addTransaction(){

    const type = document.getElementById("type").value;

    const amount = Number(document.getElementById("amount").value);

    const note = document.getElementById("note").value.trim();

    if(amount <= 0){

        alert("Nominal tidak valid");

        return;

    }

    transactions.push({

        id:Date.now(),

        type:type,

        amount:amount,

        note:note,

        date:new Date().toLocaleDateString("id-ID")

    });

    document.getElementById("amount").value = "";

    document.getElementById("note").value = "";

    saveData();

    render();

}

function deleteTransaction(id){

    if(!confirm("Hapus transaksi?")) return;

    transactions = transactions.filter(x=>x.id!==id);

    saveData();

    render();

}

function editTransaction(id){

    const trx = transactions.find(x=>x.id===id);

    if(!trx) return;

    let nominal = prompt("Nominal baru",trx.amount);

    if(nominal===null) return;

    nominal = Number(nominal);

    if(nominal<=0) return;

    let catatan = prompt("Catatan",trx.note);

    if(catatan===null) return;

    trx.amount = nominal;

    trx.note = catatan;

    saveData();

    render();

}

function renderHistory(){

    historyList.innerHTML = "";

    const keyword = document
    .getElementById("search")
    .value
    .toLowerCase();

    let data = [...transactions].reverse();

    data = data.filter(x=>x.note.toLowerCase().includes(keyword));

    if(data.length===0){

        historyList.innerHTML=`

        <div class="empty">

            <h3>Belum ada transaksi</h3>

            <p>Tambah transaksi pertama kamu.</p>

        </div>

        `;

        return;

    }

    data.forEach(trx=>{

        historyList.innerHTML += `

        <div class="transaction-card">

            <div class="left">

                <div class="icon ${trx.type=="income"?"in":"out"}">

                    ${trx.type=="income"?"💰":"💸"}

                </div>

                <div>

                    <div class="name">

                        ${trx.note}

                    </div>

                    <div class="date">

                        ${trx.date}

                    </div>

                </div>

            </div>

            <div class="right">

                <div class="${trx.type=="income"?"amount-in":"amount-out"}">

                    ${trx.type=="income"?"+":"-"} ${rupiah(trx.amount)}

                </div>

                <div class="action">

                    <button onclick="editTransaction(${trx.id})">

                        ✏️

                    </button>

                    <button onclick="deleteTransaction(${trx.id})">

                        🗑️

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

function render(){

    updateDashboard();

    renderHistory();

}

document
.getElementById("addTransaction")
.addEventListener("click",addTransaction);

document
.getElementById("search")
.addEventListener("input",renderHistory);

document
.getElementById("saveTarget")
.addEventListener("click",()=>{

    target = Number(document.getElementById("target").value);

    saveData();

    updateDashboard();

});

document.getElementById("target").value = target;

render();