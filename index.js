import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { ABI, CONTRACT_ADDRESS } from './constants.js'
const connectButton = document.getElementById("connectionButton")
const fundButton = document.getElementById("fundingButton")
const balanceButton = document.getElementById("getBalanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.addEventListener("click", () => {
    connect()
})

fundButton.addEventListener("click", () => {
    fund()
})

balanceButton.addEventListener("click", () => {
    getBalance()
})

withdrawButton.addEventListener("click", () => {
    withdraw()
})

const withdraw = async () => {
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
        try {
            const transactionResponse = await contract.Withdraw()
        } catch (err) {
            console.log(err)
        }
    }
}

const connect = async () => {
    if (typeof window.ethereum != undefined) {
        await window.ethereum.request(
            {
                method: "eth_requestAccounts",
            }
        )
        connectButton.innerHTML = "connected"
        connectButton.disabled = "true"
    }
}

const fund = async () => {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding contract with ${ethAmount} ... `)
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signers = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signers)
        try {
            const transactionAmount = await contract.Fund({ value: ethers.parseEther(ethAmount) })
            await listenForTransactionMine(transactionAmount, provider)
        } catch (err) {
            console.log(err)
        }
    }
}

const getBalance = async () => {
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(CONTRACT_ADDRESS)
        console.log(ethers.formatEther(balance))
    }
}

const listenForTransactionMine = async (transactionResponse, provider) => {
    console.log(`mining ${transactionResponse.hash}....`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, async (transactionRecepipt) => {
            console.log(`completed with ${await transactionRecepipt.confirmations()} confirmations`)
            resolve()
        })
    })
}