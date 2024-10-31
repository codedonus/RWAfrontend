"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useStarknetkitConnectModal, StarknetkitConnector } from "starknetkit";
import Button from "./Button";
import { List, Popover } from "antd";

const ConnectButton = () => {
  const { status, isSuccess, isPending, connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });
  const { address, status: accountStatus } = useAccount();

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal()
    if (!connector) return // or throw error
    await connect({ connector })
  }

  const disconnectWallet = async () => {
    await disconnect()
  }

  const listContent = [
    <a className="cursor-pointer hover:text-blue-600 w-[176px] text-center" href="/profile" key="profile">
      Profile
    </a>,
    <div className="cursor-pointer hover:text-blue-600 w-[176px] text-center" onClick={() => disconnectWallet()} key="disconnect">
    Disconnect
  </div>
  ]

  const popoverContent = (
    <List
      dataSource={listContent}
      renderItem={(item) => (
        <List.Item>{item}</List.Item>
      )}
    />
  )

  useEffect(() => {
    console.log(`accountStatus: ${accountStatus} address: ${address}`)
  }, [accountStatus, address])

  return (
    <div>
      {
        accountStatus === "connected" && address ?
        <Popover content={popoverContent} trigger='click'>
          <Button>
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Button>
        </Popover>
        :
        (accountStatus === "connecting" || accountStatus === "reconnecting") ?
        <Button>
          Connecting
        </Button>
        : 
        <Button onClick={connectWallet}>
          Connect Wallet
        </Button>
      }

    </div>
  );
}

export default ConnectButton;