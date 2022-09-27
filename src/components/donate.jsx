import { useState } from "react";
import "./css/register.css";
import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";
import { buildTx, signedTx, donateGrants } from "../api/awsInstance";
import { toast, ToastContainer } from "react-toastify";
import { Buffer } from "buffer";

const Donate = ({ walletApi }) => {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const clearField = () => {
    setAmount("");
    setWalletAddress("");
  };

  const handleSubmit = async () => {
    try {
      if (!walletApi) {
        toast("Please connect your wallet first");
        return;
      }
      setLoading(true);
      const pubKeyHash = Cardano.BaseAddress.from_address(
        Cardano.Address.from_bech32(walletAddress)
      )
        .payment_cred()
        .to_keyhash();
      const pubKeyHashString = Buffer.from(pubKeyHash.to_bytes()).toString(
        "hex"
      );
      const rawUtxos = await walletApi.getUtxos();
      const changeAddress = await walletApi.getChangeAddress();
      const transaction = await buildTx(rawUtxos, changeAddress, 10);
      const vKeyWitnesses = await walletApi.signTx(
        transaction.data.transaction,
        true
      );
      const serializedSignedTx = await signedTx(
        vKeyWitnesses,
        transaction.data.transaction
      );
      await walletApi.submitTx(serializedSignedTx.data.signedTransaction);

      toast("Please wait while we register your project to the blockchain");
      const donateList = `${pubKeyHashString} ${amount * 1000000}`;
      const grant = await donateGrants(
        donateList,
        transaction.data.generatedWalletId,
        changeAddress
      );

      if (grant.status === 200) {
        toast("Grant registered successfully");
      }
      setLoading(false);
      clearField();
      return grant;
    } catch (error) {
      toast("Donation Failed");
      clearField();
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="input-container">
        <label htmlFor="name">Project Wallet Address</label>
        <input
          id="name"
          type="text"
          className="input-field"
          placeholder="Snapbrillia"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="email">Donate ADA Amount</label>
        <input
          id="email"
          type="number"
          placeholder="1500000"
          className="input-field"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {loading === true ? (
        <p className="loading-text">Loading ...</p>
      ) : (
        <button
          type="button"
          className="register-button"
          onClick={() => handleSubmit()}
        >
          Donate Funds{" "}
        </button>
      )}
    </form>
  );
};

export default Donate;
