import { useState } from "react";
import "./css/register.css";
import { toast, ToastContainer } from "react-toastify";
import { buildTx, signedTx, registerGrant } from "../api/awsInstance";
import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";
import "react-toastify/dist/ReactToastify.css";
import { Buffer } from "buffer";

const Register = ({ walletApi }) => {
  const [projectName, setProjectName] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const clearField = () => {
    setProjectName("");
    setRequestedAmount("");
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

      toast("Please wait while we register yout project to the blockchain");

      const grant = await registerGrant(
        changeAddress,
        transaction.data.generatedWalletId,
        projectName,
        requestedAmount,
        pubKeyHashString
      );

      if (grant.status === 200) {
        toast("Grant registered successfully");
      }
      setLoading(false);
      clearField();
      return grant;
    } catch (error) {
      clearField();
      setLoading(false);
      toast("Grant registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="input-container">
        <label htmlFor="name">Project Name</label>
        <input
          id="name"
          type="text"
          className="input-field"
          placeholder="Snapbrillia"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="email">Requested ADA Amount</label>
        <input
          id="email"
          type="number"
          placeholder="1500000"
          className="input-field"
          value={requestedAmount}
          onChange={(e) => setRequestedAmount(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="message">Wallet Address to Recieve Funds</label>
        <input
          id="message"
          type="text"
          placeholder="addr_test1qzfl2tkk0xnrqzvpvygjz7ha3aw6r3hh544ktax3y2yv6ew2eqjtw9u3essdsutahde209jldkh2zzst9zpyr49e0jjq37ls7l"
          value={walletAddress}
          className="input-field"
          onChange={(e) => setWalletAddress(e.target.value)}
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
          Register Project
        </button>
      )}
    </form>
  );
};

export default Register;
