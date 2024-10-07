"use client";

import { useAccount, useConnect } from "@starknet-react/core";
import { disconnect, useStarknetkitConnectModal } from "starknetkit";
import Button from "./Button";

const ConnectButton = () => {
  const { connectAsync, status, isSuccess, isPending } = useConnect();
  console.log(`status: ${status}`);
  const { starknetkitConnectModal } = useStarknetkitConnectModal();
  const { address } = useAccount();

  return (
    <div>
      <Button onClick={async () => {
          const { connector } = await starknetkitConnectModal()
          if (!connector) return // or throw error
          await connectAsync({ connector })
        }}>
          { isSuccess && address ? <div onClick={() => disconnect()}>{`${address.slice(0, 6)}...${address.slice(-4)}`}</div> : isPending ? `Connecting` : `Connect Wallet` }
        </Button>

    </div>
  );
}

export default ConnectButton;