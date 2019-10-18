export const RESERVE_ABI = [{"name": "Withdrawn", "inputs": [{"type": "address", "name": "owner", "indexed": true}, {"type": "uint256", "name": "transferred", "indexed": false, "unit": "wei"}], "anonymous": false, "type": "event"}, {"name": "Supported", "inputs": [{"type": "address", "name": "owner", "indexed": true}, {"type": "uint256", "name": "offered", "indexed": false, "unit": "wei"}, {"type": "uint256", "name": "minted", "indexed": false, "unit": "wei"}], "anonymous": false, "type": "event"}, {"outputs": [], "inputs": [{"type": "address", "name": "ether_token_addr"}, {"type": "address", "name": "market_token_addr"}, {"type": "address", "name": "p11r_addr"}], "constant": false, "payable": false, "type": "constructor"}, {"name": "getSupportPrice", "outputs": [{"type": "uint256", "unit": "wei", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 11142}, {"name": "support", "outputs": [], "inputs": [{"type": "uint256", "unit": "wei", "name": "offer"}], "constant": false, "payable": false, "type": "function", "gas": 21428}, {"name": "getWithdrawalProceeds", "outputs": [{"type": "uint256", "unit": "wei", "name": "out"}], "inputs": [{"type": "address", "name": "addr"}], "constant": true, "payable": false, "type": "function", "gas": 6765}, {"name": "withdraw", "outputs": [], "inputs": [], "constant": false, "payable": false, "type": "function", "gas": 13277}]
