

pragma solidity ^0.5.4;

import "../../wallet/IWallet.sol";


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