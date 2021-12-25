/**
 * ethers.js 
 * 前几天都是只读操作（白嫖节点），今天终于要往链上写数据了，测试网没钱就用本地ganache的。
 * 写数据就意味着要消耗 Gas 费，也就是说——要花钱了！
 */

const { ethers } = require('ethers');

async function main() {
    console.log('--- 准备给 V 神打钱（假装） ---');
	//测试网没钱就使用ganache吧，但也得提前部署erc20和转账给V神
    const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');
    
    // 发交易必须要有私钥！
    // 随便瞎编一个私钥，反正里面也没钱
    const myPrivateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    
    // 把私钥和 provider 绑在一起，这个钱包就能发交易了
    const myWallet = new ethers.Wallet(myPrivateKey, provider);
    console.log('我的钱包地址:', myWallet.address);

    // 1. 发送最简单的 ETH 转账
    console.log('\n[场景一：转账 ETH]');
    const txConfig = {
        to: 'vitalik.eth', // ethers.js 甚至支持直接填 ENS 域名，会自动解析
        value: ethers.utils.parseEther('0.01') // 转 0.01 个 ETH
    };

    console.log('构造的转账参数:', txConfig);
    console.log('如果我有钱，我就会执行: const tx = await myWallet.sendTransaction(txConfig);');
    
    // 2. 调用智能合约发交易（比如转 USDT）
    console.log('\n[场景二：调用合约（转 USDT）]');
    const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    
    // 这次 ABI 里面要写能改变状态的函数（不带 view）
    const abi = [
        'function transfer(address to, uint256 amount) returns (bool)'
    ];

    // 重点：注意这里传的是 myWallet，而不是 provider！传 provider 只能读，传 wallet 才能写！
    const usdtContract = new ethers.Contract(usdtAddress, abi, myWallet);

    const amount = ethers.utils.parseUnits('100', 6); // 转 100 个 USDT
    
    console.log('如果我有钱，我就会执行: const tx = await usdtContract.transfer("vitalik.eth", amount);');

    console.log('\n总结：发交易其实很简单，就是用私钥签名一段数据然后发给节点。');
    console.log('但是！因为这个测试私钥里连一毛钱 Gas 费都没有，所以一跑就会报错。可以在本地ganache 测试账户中测试，但要提前部署erc20代币合约，然后给相关账户转账，比如v神的');
    console.log('贫穷限制了我在 Web3 的发挥。');
}

main();