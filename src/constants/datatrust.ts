// the only candidate kind known by the datatrust
export const REGISTRATION = 4

export const DATATRUST_ABI = [{"name": "Registered", "inputs": [{"type": "bytes32", "name": "hash", "indexed": true}, {"type": "address", "name": "registrant", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "RegistrationSucceeded", "inputs": [{"type": "bytes32", "name": "hash", "indexed": true}, {"type": "address", "name": "registrant", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "RegistrationFailed", "inputs": [{"type": "bytes32", "name": "hash", "indexed": true}, {"type": "address", "name": "registrant", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "DeliveryRequested", "inputs": [{"type": "bytes32", "name": "hash", "indexed": true}, {"type": "address", "name": "requester", "indexed": true}, {"type": "uint256", "name": "amount", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Delivered", "inputs": [{"type": "bytes32", "name": "hash", "indexed": true}, {"type": "address", "name": "owner", "indexed": true}, {"type": "bytes32", "name": "url", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "ListingAccessed", "inputs": [{"type": "bytes32", "name": "hash", "indexed": true}, {"type": "bytes32", "name": "delivery", "indexed": true}, {"type": "uint256", "name": "amount", "indexed": false}], "anonymous": false, "type": "event"}, {"outputs": [], "inputs": [{"type": "address", "name": "ether_token_addr"}, {"type": "address", "name": "voting_addr"}, {"type": "address", "name": "p11r_addr"}, {"type": "address", "name": "res_addr"}], "constant": false, "payable": false, "type": "constructor"}, {"name": "getPrivileged", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 551}, {"name": "getReserve", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 581}, {"name": "setPrivileged", "outputs": [], "inputs": [{"type": "address", "name": "listing"}], "constant": false, "payable": false, "type": "function", "gas": 35998}, {"name": "getHash", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [{"type": "string", "name": "url"}], "constant": true, "payable": false, "type": "function", "gas": 665}, {"name": "getBackendAddress", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 671}, {"name": "getBackendUrl", "outputs": [{"type": "string", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 22831}, {"name": "setBackendUrl", "outputs": [], "inputs": [{"type": "string", "name": "url"}], "constant": false, "payable": false, "type": "function", "gas": 176987}, {"name": "getDataHash", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [{"type": "bytes32", "name": "hash"}], "constant": true, "payable": false, "type": "function", "gas": 876}, {"name": "setDataHash", "outputs": [], "inputs": [{"type": "bytes32", "name": "listing"}, {"type": "bytes32", "name": "data"}], "constant": false, "payable": false, "type": "function", "gas": 35963}, {"name": "removeDataHash", "outputs": [], "inputs": [{"type": "bytes32", "name": "hash"}], "constant": false, "payable": false, "type": "function", "gas": 20990}, {"name": "register", "outputs": [], "inputs": [{"type": "string", "name": "url"}], "constant": false, "payable": false, "type": "function", "gas": 10292}, {"name": "resolveRegistration", "outputs": [], "inputs": [{"type": "bytes32", "name": "hash"}], "constant": false, "payable": false, "type": "function", "gas": 68704}, {"name": "requestDelivery", "outputs": [], "inputs": [{"type": "bytes32", "name": "hash"}, {"type": "uint256", "name": "amount"}], "constant": false, "payable": false, "type": "function", "gas": 225422}, {"name": "getBytesPurchased", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "addr"}], "constant": true, "payable": false, "type": "function", "gas": 1095}, {"name": "getDelivery", "outputs": [{"type": "address", "name": "out"}, {"type": "uint256", "name": "out"}, {"type": "uint256", "name": "out"}], "inputs": [{"type": "bytes32", "name": "hash"}], "constant": true, "payable": false, "type": "function", "gas": 2037}, {"name": "listingAccessed", "outputs": [], "inputs": [{"type": "bytes32", "name": "listing"}, {"type": "bytes32", "name": "delivery"}, {"type": "uint256", "name": "amount"}], "constant": false, "payable": false, "type": "function", "gas": 120067}, {"name": "getAccessRewardEarned", "outputs": [{"type": "uint256", "unit": "wei", "name": "out"}], "inputs": [{"type": "bytes32", "name": "hash"}], "constant": true, "payable": false, "type": "function", "gas": 1146}, {"name": "accessRewardClaimed", "outputs": [], "inputs": [{"type": "bytes32", "name": "hash"}], "constant": false, "payable": false, "type": "function", "gas": 24131}, {"name": "delivered", "outputs": [], "inputs": [{"type": "bytes32", "name": "delivery"}, {"type": "bytes32", "name": "url"}], "constant": false, "payable": false, "type": "function", "gas": 136010}]
