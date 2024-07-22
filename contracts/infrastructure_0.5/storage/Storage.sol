

pragma solidity ^0.5.4;

import "../../wallet/IWallet.sol";

/**
 * @title Storage
 * @notice Base contract for the storage of a wallet.
 * @author Julien Niset - <julien@argent.xyz>
 */
contract Storage {

    /**
     * @notice Throws if the caller is not an authorised module.
     */
    modifier onlyModule(address _wallet) {
        // solhint-disable-next-line reason-string
        require(IWallet(_wallet).authorised(msg.sender), "TS: must be an authorized module to call this method");
        _;
    }
}