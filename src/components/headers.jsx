import React from "react";
import SnapbrilliaLogo from "../assets/snapbrillia_logo.svg";
import "./css/headers.css";

const Header = ({ connectFlintWallet, address, removeFlintWallet }) => {
  return (
    <div className="header">
      <img src={SnapbrilliaLogo} alt="snapbrillia-logo" />
      {address ? (
        <p className="connect-wallet" onClick={() => removeFlintWallet()}>
          {address.slice(0, 4)}...{address.slice(-6)}
          <span className="x-icon">X</span>
        </p>
      ) : (
        <button className="connect-wallet" onClick={() => connectFlintWallet()}>
          Connect Flint Wallet
        </button>
      )}
    </div>
  );
};

export default Header;
