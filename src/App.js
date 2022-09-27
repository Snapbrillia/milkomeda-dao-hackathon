import "./App.css";
import Header from "./components/headers";
import Card from "./components/card";
import { useState } from "react";
import { Buffer } from "buffer";
import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";

function App() {
  const [walletApi, setWalletApi] = useState(null);
  const [address, setAddress] = useState(null);

  const removeFlintWallet = () => {
    setWalletApi(null);
    setAddress(null);
  };

  const connectFlintWallet = async () => {
    const walletFound = !!window?.cardano?.flint;
    if (walletFound) {
      const walletApi = await window.cardano.flint.enable();
      const raw = await walletApi.getChangeAddress();
      const shelleyChangeAddress = Cardano.Address.from_bytes(
        Buffer.from(raw, "hex")
      ).to_bech32();
      setAddress(shelleyChangeAddress);
      setWalletApi(walletApi);
    } else {
      alert("Please install Flint Wallet");
    }
  };

  return (
    <div className="container">
      <Header
        removeFlintWallet={removeFlintWallet}
        connectFlintWallet={connectFlintWallet}
        address={address}
      />
      <div className="center-card">
        <Card connectFlintWallet={connectFlintWallet} walletApi={walletApi} />
      </div>
    </div>
  );
}

export default App;
