import "./css/card.css";
import { useState } from "react";
import Donate from "./donate";
import Register from "./register";

const Card = ({ connectWallet, walletApi }) => {
  const [page, setPage] = useState(1);

  return (
    <div className="card">
      <h1 className="title">Quadratic Voting and Funding</h1>
      <p>
        'Quadratic Voting and Funding is the mathematically optimal way to fund
        public goods in a democratic community'
      </p>
      <br />
      <div className="tab-selection">
        <button
          onClick={() => setPage(1)}
          className="tab-title"
          style={{ borderBottom: page === 1 ? "solid" : "" }}
        >
          Register
        </button>
        <button
          onClick={() => setPage(2)}
          className="tab-title"
          style={{ borderBottom: page === 2 ? "solid" : "" }}
        >
          Donate
        </button>
      </div>
      <br />
      {page === 1 ? (
        <Register connectWallet={connectWallet} walletApi={walletApi} />
      ) : page === 2 ? (
        <Donate connectWallet={connectWallet} walletApi={walletApi} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Card;
