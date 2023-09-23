"use client";
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ethers } from "ethers";
import mockABI from "../ABI/tokenAbi.json"
import paymentABI from "../ABI/paymentAbi.json"
import Header from "../components/Header";
import "./body.css";


const tokenAbi = mockABI;
// saved mock address to make tests
// const tokenAddress = "0x24C05E5EF15e550c8CEC411985E2E7AA931f703D"
// const tokenAddress2 = "0x8F3c859d36474D76e479De3170E0DB6E99ceD463"

const paymentAbi = paymentABI;
const paymentAddress = "0x60375E866Bf74F0cfdCC228B066a8784864817e7"

export default function Home() {
  const { address, isConnected } = useAccount();
  const [tokenList, setTokenList] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");

  useEffect(() => {
    if (address !== undefined) {
      getList();
    }
  }, [address]);

  const getList = async () =>{
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(paymentAddress, paymentAbi, signer);
      const tokens = await contract.VTokens();
      setTokenList(tokens);
      console.log(tokenList.toString());
    }catch (error){
      console.error(error);
    }
  }

  const approve = async () =>{
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(selectedToken, tokenAbi, signer);
      const valueToApprove = "99999999999999999999999999999";
      const tx = await contract.approve(paymentAddress, valueToApprove);
    }catch (error){
      console.error(error);
    }
  }
  const payment = async () =>{
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(paymentAddress, paymentAbi, signer);
      const tx = await contract.payment(selectedToken);
    }catch (error){
      console.error(error);
    }
  }

  const example = async () =>{}

  return (
    <div classNam="body">
      <Header classNam="HeaderPosition"/>
      
      <div className='heroStyles'>
        <button className='buttonsBase' onClick={example}> approve tokens</button>
        <button className='buttonsBase' onClick={example}> View State</button>
      </div>
      
    </div>
    )
  }
  









