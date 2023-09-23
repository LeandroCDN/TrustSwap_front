import React, { useEffect } from "react";
// import Image from 'next/image';
import { Web3Button } from "@web3modal/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { getNetwork } from "@wagmi/core";
import { switchNetwork } from "@wagmi/core";
import "./Header.css";

const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain, chains } = getNetwork();

  useEffect(() => {
    // Ejecutar tu función cuando address o isConnected cambien
    if (address !== undefined) {
      change();
    }
  }, [address]);

  const change = async () => {
    //bsc testnet = 97
    if (chain.id != 97) {
      await switchNetwork({
        chainId: 97,
      });
    }
    await getNetwork();
  };

  return (
      <header   className="header-style" >
        <h1> Trust Swap</h1>
        <Web3Button />
      </header>
  );
};
export default Header;