import { contractAddress } from "./config.js";

const abi = [
  "function deposit() public payable",
  "function withdraw() public",
  "function getBalance() public view returns (uint)"
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    showLoader(true);
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);

      const address = await signer.getAddress();
      document.getElementById("walletAddress").innerText = formatAddress(address);
      document.getElementById("connectButton").innerText = "Connected";

      await getBalance();
    } catch (err) {
      console.error(err);
    }
    showLoader(false);
  } else {
    alert("Please install MetaMask");
  }
}

function formatAddress(address) {
  if (!address) return '';
  return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

// ...โค้ดของคุณข้างบน

// ฟังก์ชันทำให้รูปภาพเด้งดึ๋ง
function bounceImage() {
  const image = document.querySelector('.image-container img');
  if (!image) return;
  image.classList.add('bounce');

  // เอา class ออกหลัง animation จบ เพื่อให้กดเด้งได้อีก
  setTimeout(() => {
    image.classList.remove('bounce');
  }, 500); // ต้องตรงกับเวลาใน CSS
}

// ฟังก์ชัน Deposit
async function deposit() {
  const amount = document.getElementById("amountInput").value;
  if (!amount) return;

  showLoader(true);
  try {
    const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    document.getElementById("result").innerText = "✅ Deposit successful";
    document.getElementById("amountInput").value = "";
    await getBalance();
    
    bounceImage(); // เพิ่มให้เด้งดึ๋ง
  } catch (err) {
    console.error(err);
    document.getElementById("result").innerText = "❌ Deposit failed";
  }
  showLoader(false);
}

// ฟังก์ชัน Withdraw
async function withdraw() {
  showLoader(true);
  try {
    const tx = await contract.withdraw();
    await tx.wait();
    document.getElementById("result").innerText = "✅ Withdraw successful";
    await getBalance();
    
    bounceImage(); // เพิ่มให้เด้งดึ๋ง
  } catch (err) {
    console.error(err);
    document.getElementById("result").innerText = "❌ Withdraw failed";
  }
  showLoader(false);
}

// ...โค้ดต่อ


async function getBalance() {
  try {
    const balance = await contract.getBalance();
    document.getElementById("walletBalance").innerText = ethers.utils.formatEther(balance) + " ETH";
  } catch (err) {
    console.error(err);
  }
}

// ฟังก์ชันเปิด Modal
function openModal() {
  document.getElementById("teamModal").classList.add("show");
}

// ฟังก์ชันปิด Modal
function closeModal() {
  document.getElementById("teamModal").classList.remove("show");
}

// ฟังก์ชันแสดง loader
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "flex" : "none";
}

// ปิด Modal เมื่อคลิกที่พื้นหลัง
document.getElementById("teamModal").addEventListener("click", function(e) {
  if (e.target === this) {
    closeModal();
  }
});

document.querySelector('#teamBtn').addEventListener('click', openModal);
document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("depositButton").addEventListener("click", deposit);
document.getElementById("withdrawButton").addEventListener("click", withdraw);
console.log(ethers);  // ดูว่า ethers ถูกโหลดหรือไม่
