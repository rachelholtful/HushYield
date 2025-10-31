// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract HashYieldToken {
    string public constant name = "Confidential Ether";
    string public constant symbol = "cETH";
    uint8 public constant decimals = 18;

    address public immutable minter;

    uint256 public totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    error InvalidMinter();
    error ZeroAddress();
    error InsufficientBalance();
    error InsufficientAllowance();
    error Unauthorized();

    constructor(address minter_) {
        if (minter_ == address(0)) {
            revert InvalidMinter();
        }
        minter = minter_;
    }

    modifier onlyMinter() {
        if (msg.sender != minter) {
            revert Unauthorized();
        }
        _;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        if (currentAllowance != type(uint256).max) {
            if (currentAllowance < amount) {
                revert InsufficientAllowance();
            }
            unchecked {
                _allowances[from][msg.sender] = currentAllowance - amount;
            }
            emit Approval(from, msg.sender, _allowances[from][msg.sender]);
        }
        _transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    function _transfer(address from, address to, uint256 amount) private {
        if (from == address(0) || to == address(0)) {
            revert ZeroAddress();
        }
        uint256 fromBalance = _balances[from];
        if (fromBalance < amount) {
            revert InsufficientBalance();
        }
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _approve(address owner, address spender, uint256 amount) private {
        if (owner == address(0) || spender == address(0)) {
            revert ZeroAddress();
        }
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _mint(address to, uint256 amount) private {
        if (to == address(0)) {
            revert ZeroAddress();
        }
        totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}

contract HashYield {
    struct StakeInfo {
        uint256 amount;
        uint256 unclaimedInterest;
        uint256 lastAccrued;
    }

    uint256 public constant SECONDS_PER_DAY = 1 days;

    HashYieldToken public immutable rewardToken;
    uint256 public totalStaked;

    mapping(address => StakeInfo) private _stakes;

    bool private _entered;

    event Staked(address indexed account, uint256 amount, uint256 newBalance);
    event Withdrawn(address indexed account, uint256 amount, uint256 remainingBalance);
    event InterestClaimed(address indexed account, uint256 amount);

    error StakeAmountZero();
    error WithdrawAmountZero();
    error WithdrawAmountExceedsBalance();
    error NoInterestAccrued();
    error ReentrancyDetected();

    constructor() {
        rewardToken = new HashYieldToken(address(this));
    }

    modifier nonReentrant() {
        if (_entered) {
            revert ReentrancyDetected();
        }
        _entered = true;
        _;
        _entered = false;
    }

    function stake() external payable nonReentrant {
        if (msg.value == 0) {
            revert StakeAmountZero();
        }

        StakeInfo storage info = _stakes[msg.sender];
        _accrueInterest(info);

        info.amount += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value, info.amount);
    }

    function withdraw(uint256 amount) public nonReentrant {
        if (amount == 0) {
            revert WithdrawAmountZero();
        }

        StakeInfo storage info = _stakes[msg.sender];
        _accrueInterest(info);

        if (amount > info.amount) {
            revert WithdrawAmountExceedsBalance();
        }

        info.amount -= amount;
        totalStaked -= amount;

        (bool success, ) = msg.sender.call{value: amount}('');
        require(success, "ETH_TRANSFER_FAILED");

        emit Withdrawn(msg.sender, amount, info.amount);
    }

    function withdrawAll() external {
        uint256 balance = _stakes[msg.sender].amount;
        withdraw(balance);
    }

    function claimInterest() external nonReentrant {
        StakeInfo storage info = _stakes[msg.sender];
        _accrueInterest(info);

        uint256 interest = info.unclaimedInterest;
        if (interest == 0) {
            revert NoInterestAccrued();
        }

        info.unclaimedInterest = 0;
        rewardToken.mint(msg.sender, interest);

        emit InterestClaimed(msg.sender, interest);
    }

    function claimableInterest(address account) public view returns (uint256) {
        StakeInfo memory info = _stakes[account];
        if (info.lastAccrued == 0) {
            return 0;
        }

        uint256 pending = info.unclaimedInterest;
        if (info.amount == 0) {
            return pending;
        }

        uint256 elapsed = block.timestamp - info.lastAccrued;
        if (elapsed > 0) {
            pending += (info.amount * elapsed) / SECONDS_PER_DAY;
        }

        return pending;
    }

    function getStake(address account)
        external
        view
        returns (uint256 amount, uint256 unclaimedInterest, uint256 lastAccrued)
    {
        StakeInfo memory info = _stakes[account];
        return (info.amount, claimableInterest(account), info.lastAccrued);
    }

    function getRewardToken() external view returns (address) {
        return address(rewardToken);
    }

    function _accrueInterest(StakeInfo storage info) private {
        uint256 lastAccrued = info.lastAccrued;
        if (lastAccrued == 0) {
            info.lastAccrued = block.timestamp;
            return;
        }

        if (info.amount == 0) {
            info.lastAccrued = block.timestamp;
            return;
        }

        if (block.timestamp > lastAccrued) {
            uint256 elapsed = block.timestamp - lastAccrued;
            uint256 accrued = (info.amount * elapsed) / SECONDS_PER_DAY;
            if (accrued > 0) {
                info.unclaimedInterest += accrued;
            }
            info.lastAccrued = block.timestamp;
        }
    }
}
