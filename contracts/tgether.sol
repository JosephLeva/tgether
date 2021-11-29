// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract Tgether is ChainlinkClient, ConfirmedOwner {
  using Chainlink for Chainlink.Request;

  uint256 constant private ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;
  uint256 public currentPrice;
  int256 public changeDay;
  bytes32 public lastMarket;
  bytes public request;

  event RequestEthereumPriceFulfilled(
    bytes32 indexed requestId,
    uint256 indexed price
  );

  constructor() ConfirmedOwner(msg.sender){
    setPublicChainlinkToken();
  }

  function TgetherPay(string memory _oracle, string memory _jobId, string memory _userId, string memory _contractId)
    public
    payable
  {
    string memory  amt = uint2str(msg.value);
    address oracle = StrtoAddress(_oracle);
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillEthereumPrice.selector);
    req.add("amountPaid", amt);
    req.add("userId", _userId);
    req.add("contractId", _contractId);

    sendChainlinkRequestTo(oracle, req, ORACLE_PAYMENT);
  }

  function fulfillEthereumPrice(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    emit RequestEthereumPriceFulfilled(_requestId, _price);
    currentPrice = _price;
  }

  function TgetherPayout(uint256 _amount, string memory _address) public  payable onlyOwner{
      address payable adderes = StrToPyableAddress(_address);
      adderes.transfer(_amount);


  }


  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }

   function uint2str(
  uint256 _i
            )
            internal
            pure
            returns (string memory str)
            {
            if (_i == 0)
            {
                return "0";
            }
            uint256 j = _i;
            uint256 length;
            while (j != 0)
            {
                length++;
                j /= 10;
            }
            bytes memory bstr = new bytes(length);
            uint256 k = length;
            j = _i;
            while (j != 0)
            {
                bstr[--k] = bytes1(uint8(48 + j % 10));
                j /= 10;
            }
            str = string(bstr);
            }

    function StrToPyableAddress(string memory data) internal pure returns ( address payable) 
    {
        bytes memory bytesKey = abi.encodePacked(data);
        bytes32 keyHash = keccak256(bytesKey);
        address addr;

        assembly {
            mstore(0, keyHash)
            addr := mload(0)
        }
        // addr: 0xf90433A4F4aE7A2ba5f71ef4Fc85827c884F1b5d
        
        return payable(addr);
    }
        function StrtoAddress(string memory data) internal pure returns ( address ) 
    {
        bytes memory bytesKey = abi.encodePacked(data);
        bytes32 keyHash = keccak256(bytesKey);
        address addr;

        assembly {
            mstore(0, keyHash)
            addr := mload(0)
        }
        // addr: 0xf90433A4F4aE7A2ba5f71ef4Fc85827c884F1b5d
        
        return addr;
    }





}