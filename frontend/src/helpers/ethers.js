import { ethers } from "ethers";
import BridgeGetters from "../../build/contracts/BridgeGetters.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const bridgeGettersAddress = "0xYourContractAddress";
const bridgeGettersContract = new ethers.Contract(bridgeGettersAddress, BridgeGetters.abi, signer);

export default bridgeGettersContract;
