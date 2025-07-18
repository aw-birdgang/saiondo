// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

import "hardhat/console.sol";

contract SAIONDO is ERC20, ERC20Burnable, ERC20Snapshot, Ownable, Pausable, ERC20Permit, ERC20Votes, ERC20FlashMint {

    uint256 public totalMintAmount = 0;
    uint256 public totalBurnAmount = 0;

    constructor() ERC20("SAIONDO", "ONDO") ERC20Permit("SAIONDO") {
        _mint(msg.sender, 10000000000 * 10 ** decimals());
    }

    function snapshot() public onlyOwner {
        _snapshot();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function maxTotalMintAmount() public onlyOwner view returns (uint256) {
        return totalMintAmount;
    }

    function maxTotalBurnAmount() public onlyOwner view returns (uint256) {
        return totalBurnAmount;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal whenNotPaused
    override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount) internal
    override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal
    override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
        totalMintAmount = totalMintAmount + amount;
    }

    function _burn(address account, uint256 amount) internal
    override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
        totalBurnAmount = totalBurnAmount + amount;
    }

}
