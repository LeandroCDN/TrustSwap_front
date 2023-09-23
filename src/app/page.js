"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ethers } from "ethers";
import mockABI from "../ABI/tokenAbi.json";
import Header from "../components/Header";
import "./body.css";

const tokenAbi = mockABI;
const addressUsdt = "0x8F3c859d36474D76e479De3170E0DB6E99ceD463";
const addressMetis = "0x8F3c859d36474D76e479De3170E0DB6E99ceD463";
const addressTrustSwap = "0xE4e9e6C6cFdBA65cf0d02F5eDF52F1688Ea0ec39";

const walletFrom = "0xe027625a79C62E2967a4Ac3B5aA11a7a07cca7fd";
const walletTo = "0xf1241515Da1f05A47E487fa95103c0Ed9BF33b67";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("Approve Tokens");
  const [selectedToken, setSelectedToken] = useState("");
  const [ connected, setConnected] = useState("");
  const [approving, setApproving] = useState(false); // Estado para rastrear la aprobación en curso

  console.log(isConnected);


  useEffect(() => {
    if (isConnected) {
      setConnected(true);
    } else {
      setConnected(false);
      setButtonText("Connect Wallet");
    }

    // Lógica para determinar el texto del botón basado en la autenticación del usuario
    if (address) {
      setButtonText(walletFrom === address ? "Approve USDT" : walletTo === address ? "Approve Metis" : "Approve Tokens");
      setSelectedToken(walletFrom === address ? addressUsdt : walletTo === address ? addressMetis : "0x0000000000000000000000000000000000000000");
    }
  }, [address, isConnected]);

  useEffect(() => {
    // Verificar si la billetera ya está conectada al cargar la página
    if (isConnected) {
      setConnected(true);
    } else {
      setConnected(false);
      setButtonText("Connect Wallet");
    }
  }, []);
  

  const viewState = () => {
    if (address === walletFrom) {
      setMessage("Usted es wallet From");
    } else if (address === walletTo) {
      setMessage("Usted es wallet To");
    } else {
      setMessage("Usted no está conectado o no es wallet From ni wallet To");
    }
  };

  const approve = async () =>{
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(selectedToken, tokenAbi, signer);

      const valueToApprove = "99999999999999999999999999999";
      // const gasLimit = 200000; // Establece el límite de gas adecuado para tu transacción
      setButtonText("approving tokens");
      const tx = await contract.approve(addressTrustSwap, valueToApprove, {gasLimit: 3000000});
      const receipt = await tx.wait();
      setButtonText(walletFrom === address ? "Approve USDT" : walletTo === address ? "Approve Metis" : "Approve Tokens");

      
      if (receipt.status === 1) {
        // Transacción exitosa
        window.alert("Los tokens fueron aprobados con éxito");
      } else {
        // Transacción fallida
        // setButtonText("ERROR");
        // window.alert("La aprobación de tokens falló");
      }

    }catch (error){
      console.error(error);
    }
  }

  return (
    <div classNam="body">
      <Header classNam="HeaderPosition" />

      <div className="heroStyles">
        <button className="buttonsBase" onClick={approve} disabled={!connected} >
          {approving ? "Approving..." : buttonText}
        </button>
        <button className="buttonsBase" onClick={viewState} disabled={!connected}>
          {" "}
          View State
        </button>
        <div className="message">
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
