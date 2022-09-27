import axios from "axios";
const awsUrl = "http://54.208.236.146:8000";

export async function buildTx(rawUtxos, changeAddress, amount) {
  try {
    console.log(amount);
    const transaction = await axios.post(
      `${awsUrl}/api/transaction/cardano-build-tx`,
      {
        rawUtxos: rawUtxos,
        changeAddress: changeAddress,
        amount: amount,
      }
    );
    return transaction;
  } catch (err) {
    throw err.response.data;
  }
}

export async function signedTx(vKeyWitness, transaction) {
  try {
    const signedTx = await axios.post(
      `${awsUrl}/api/transaction/cardano-sign-tx`,
      {
        vKeyWitness: vKeyWitness,
        transaction: transaction,
      }
    );
    return signedTx;
  } catch (error) {
    throw error.response.data;
  }
}

export async function donateGrants(
  donateList,
  generatedWalletId,
  changeAddress
) {
  try {
    const response = axios.post(
      `${awsUrl}/api/transaction/donate-grant-to-blockchain`,
      {
        donateList: donateList,
        generatedWalletId: generatedWalletId,
        changeAddress: changeAddress,
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
}

export async function registerGrant(
  changeAddress,
  generatedWalletId,
  projectLabel,
  requestedAmount,
  userWalletPKH
) {
  try {
    const response = await axios.post(
      `${awsUrl}/api/transaction/register-grant-to-blockchain`,
      {
        projectLabel: projectLabel,
        requestedAmount: requestedAmount,
        changeAddress: changeAddress,
        generatedWalletId: generatedWalletId,
        userWalletPKH: userWalletPKH,
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
}
