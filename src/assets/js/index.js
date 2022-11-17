import base58 from 'bs58';
import {sha256} from 'js-sha256';
export function XchainAddrToEvm(addr) {
    var result = ''
    try {
        // 判断是否是合约账号;判断合约账户地址仅支持 XC11111111111@xuper, xuper后缀，go-sdk有相同问题。
        if  (determineContractAccount(addr)){
            result = contractAccountToEVMAddress(addr)
        } else if (determineContractName(addr)) {
            result = contractNameToEVMAddress(addr)
        } else {
            result =  xchainAKToEVMAddress(addr)
        }
        return result
    }catch (err) {
        console.log(err)
    }
    
}
// 判断合约账户地址仅支持 XC11111111111@xuper, xuper后缀，go-sdk有相同问题。
function determineContractAccount(xchainAddr) {
    if (isAccount(xchainAddr) != 1) {
        return false;
    }
    return xchainAddr.indexOf("@xuper") != -1;
}

const accountPrefix = "XC"
function isAccount(name) {
    if (name == '') {
        return -1;
    }
    if (name.indexOf(accountPrefix) != 0) {
        return 0;
    }
    var prefix = name.split("@")[0]
    prefix = prefix.substr(accountPrefix.length)
    if (!validRawAccount(prefix)) {
        return 0;
    }
    return 1;
}

const accountSize = 16
function validRawAccount(accountName) {
    if (accountName == "") {
        return false
    }
    if (accountName.length != accountSize) {
        return false
    }
    for (var i = 0 ; i < accountSize; i++) {
        if (accountName[i] >= '0' && accountName[i] <= '9') {
            continue
        } else {
            return false
        }
    } 
    return true
}
const contractAccountPrefixs = "1112"
const Word160Length = 20
function contractAccountToEVMAddress(contractAccount) {
    var contractAccountValid = contractAccount.slice(2,18);
    var str = contractAccountPrefixs.concat(contractAccountValid)
    if (str.length != Word160Length) {
        throw new Error("slice passed as address shou have 20 byte length");
    }
    return Buffer.from(str).toString("hex").toUpperCase()
}

const contractNameMaxSize = 16
const contractNameMinSize = 4
const contractNameRegex = /^[a-zA-Z_]{1}[0-9a-zA-Z_.]+[0-9a-zA-Z_]$/

function determineContractName(xchainAddr) {
    var contractSize = xchainAddr.length
	if (contractSize > contractNameMaxSize || contractSize < contractNameMinSize) {
        return false
	}
	if (!contractNameRegex.test(xchainAddr)) {
        return false
	}
	return true
}

const evmAddressFiller = "-"
const contractNamePrefixs = "1111"
function contractNameToEVMAddress(contractName) {
    var contractNameLength = contractName.length
	var prefixStr = ''
	for (var i = 0; i < Word160Length-contractNameLength-4; i++) {
		prefixStr += evmAddressFiller
	}
	contractName = prefixStr + contractName
	contractName = contractNamePrefixs + contractName

    if (contractName.length != Word160Length) {
        throw new Error("slice passed as address shou have 20 byte length");
    }
    return Buffer.from(contractName).toString("hex").toUpperCase()
}

function xchainAKToEVMAddress(xchainAddr) {
    var rawAddr =  base58.decode(xchainAddr)
    if (rawAddr.length < 21){
		throw new Error("bad address")
	}
    rawAddr = rawAddr.slice(1, 21)
    return Buffer.from(rawAddr, "").toString("hex").toUpperCase()
}

export function EvmToXchainAddr(addr) {
	// return addr, addrType, nil
    var result = ''
    try {
        var bs = Buffer.from(addr,"hex").toString("ascii")
        if (bs.length != Word160Length) {
            throw new Error("slice passed as address shou have 20 byte length");
        }
        var evmAddrStrWithPrefix = bs
        // 合约账号
        if (evmAddrStrWithPrefix.slice(0,4) == contractAccountPrefixs) {
            result = evmAddressToContractAccount(bs)
        } else if  (evmAddrStrWithPrefix.slice(0,4) == contractNamePrefixs) {
            result = evmAddressToContractName(bs)
        }else {
            var buffer = Buffer.from(addr,"hex")
            result = evmAddressToXchain(buffer)
        }
        return result
    }catch (err) {
        console.log(err)
    }
    
}
function evmAddressToContractAccount (addr) {
    return accountPrefix + addr.slice(4) + "@xuper"
}
function evmAddressToContractName(addr) {
    var index = addr.lastIndexOf(evmAddressFiller)
    return addr.slice(index+1)
}

function evmAddressToXchain(addr){
    var addTyepe = []
    var addrArray = new Uint8Array(addr)
    addTyepe.push(1)
    for (var i = 0; i < addrArray.length; i++ ){
        addTyepe.push(addrArray[i])
    }
    var checkCode = DoubleSha256(addTyepe)
    var simpleCheckCode = checkCode.slice(0,4)
    for (var l = 0; l < simpleCheckCode.length; l++ ){
        addTyepe.push(simpleCheckCode[l])
    }
    return base58.encode(addTyepe)
}

// DoubleSha256 执行2次SHA256，这是为了防止SHA256算法被攻破。
function DoubleSha256(data)  {
	return UsingSha256(UsingSha256(data))
}

// UsingSha256 get the hash result of data using SHA256
function UsingSha256(data) {
    return sha256.array(data)
}


export function plusXing (str,frontLen,endLen) {
    var xing = '';
    for (var i=0;i<5;i++) {
        xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
}   