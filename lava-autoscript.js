const fetch = require('node-fetch');
const ethers = require('ethers');
const lodash = require('lodash')
//lava call back
async function main(addresses) {
    const rpcUrls = [
        "https://eth1.lava.build/lava-referer-d8fbfd38-cde3-42da-8c9d-c53fac3d41db/",
        "https://evmos.lava.build/lava-referer-d8fbfd38-cde3-42da-8c9d-c53fac3d41db/",
        "https://evmos-testnet.lava.build/lava-referer-d8fbfd38-cde3-42da-8c9d-c53fac3d41db/"
    ]
    const number = lodash.floor(4.006)
    const add = lodash.add(number, 1)
    console.log(add)

    const shuffledAddresses = addresses
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    for (let i = 0; i < shuffledAddresses.length - 1; i++) {
        const address = shuffledAddresses[i].split(',')[0].trim();
        if (!address) continue;

        const rpcUrl = rpcUrls[Math.floor(Math.random() * rpcUrls.length)];
        try {
            const result = await checkBalanceAndAppend(address, rpcUrl);
            console.log(i, result, '\n');
        } catch (error) {
            console.error(`RPC调用错误，获取钱包余额失败 - ${address}: ${error.message}\n`);
        }
    }
}

async function fetchRPC(url, body) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
    });

    if (!response.ok) {
        throw new Error(`HTTP 错误! 状态: ${response.status}, 信息: ${await response.text()}`);
    }
    return response.json();
}

async function checkBalanceAndAppend(address, rpcUrl) {
    console.log(`使用的RPC: ${rpcUrl}`);
    const jsonRpcPayload = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
    };

    const response = await fetchRPC(rpcUrl, jsonRpcPayload);
    if (response.error) {
        throw new Error(`RPC error: ${response.error.message}`);
    }

    const balance = ethers.utils.formatUnits(response.result, 'ether');
    return `查询成功, 地址: ${address} - 余额: ${balance} ETH`;
}
const addresses = []

main(addresses).catch(console.error);
