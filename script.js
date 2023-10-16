let blockchain = [];

function Blockchain() {
  this.transactions = [];
  this.blocks = [];
}

function calculateHash(index, previousHash, timestamp, transactions) {
  return CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(transactions)).toString();
}

Blockchain.prototype.createNewBlock = function () {
  const newBlock = {
    index: this.blocks.length + 1,
    previousHash: this.blocks.length > 0 ? this.blocks[this.blocks.length - 1].hash : null,
    timestamp: Date.now(),
    transactions: this.transactions,
    hash: calculateHash(this.blocks.length + 1, this.blocks.length > 0 ? this.blocks[this.blocks.length - 1].hash : null, Date.now(), this.transactions)
  };

  this.transactions = [];
  this.blocks.push(newBlock);
  return newBlock;
};

Blockchain.prototype.createTransaction = function (sender, receiver, amount, signature) {
  const newTransaction = {
    sender,
    receiver,
    amount,
    signature
  };
  this.transactions.push(newTransaction);
};

function signTransaction(sender, receiver, amount, privateKey) {
  const transaction = {
    sender,
    receiver,
    amount
  };
  const transactionString = JSON.stringify(transaction);
  const signature = CryptoJS.SHA256(transactionString + privateKey).toString();
  return signature;
}

const myBlockchain = new Blockchain();

function showBlockchainInfo() {
  const infoOutput = document.getElementById('info-output');
  infoOutput.innerHTML = `
    <h3>Blockchain Information:</h3>
    <p>Blocks: ${myBlockchain.blocks.length}</p>
    <p>Transactions: ${myBlockchain.transactions.length}</p>
  `;
}

function createTransaction() {
  const sender = document.getElementById('sender').value;
  const receiver = document.getElementById('receiver').value;
  const amount = document.getElementById('amount').value;

  const privateKey = prompt('Enter your private key:');

  const signature = signTransaction(sender, receiver, amount, privateKey);

  const transaction = {
    sender,
    receiver,
    amount,
    signature
  };

  myBlockchain.createTransaction(transaction.sender, transaction.receiver, transaction.amount, transaction.signature);

  const transactionOutput = document.getElementById('transaction-output');
  transactionOutput.innerHTML = `
    <h3>Transaction Created:</h3>
    <p>Sender: ${transaction.sender}</p>
    <p>Receiver: ${transaction.receiver}</p>
    <p>Amount: ${transaction.amount}</p>
    <p>Signature: ${transaction.signature}</p>
  `;
}

function mineBlock() {
  const lastBlock = myBlockchain.blocks[myBlockchain.blocks.length - 1];
  const newBlock = myBlockchain.createNewBlock();

  const mineOutput = document.getElementById('mine-output');
  mineOutput.innerHTML = `
    <h3>New Block Mined:</h3>
    <p>Index: ${newBlock.index}</p>
    <p>Transactions: ${newBlock.transactions.length}</p>
    <p>Timestamp: ${new Date(newBlock.timestamp).toLocaleString()}</p>
  `;
}
