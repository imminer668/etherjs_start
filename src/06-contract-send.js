/**
 * ethers.js 怎么读取智能合约里的数据
 * DeFi 很火，天天有人炒土狗币。
 */

const { ethers } = require('ethers');

async function main() {
    console.log('--- 开始读取 USDT 合约 ---');

    // 1. 连上以太坊主网
    const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');

    // 2. USDT 在主网的合约地址（以太坊浏览器上抄来的）
    const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

    // 3. 什么是 ABI？
    // ABI 就像是合约的 API 文档说明书，告诉 ethers 这个合约里有哪些函数可以调。
    // 我们不需要把几千行的完整 ABI 都抄过来，用哪个抄哪个就行，这叫 Human-Readable ABI，太人性化了！
    const erc20Abi = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
        'function totalSupply() view returns (uint256)',
        'function balanceOf(address) view returns (uint256)'
    ];

    // 4. 创建一个“只读”的合约对象（因为没传钱包进去，只能读不能写）
    const usdtContract = new ethers.Contract(usdtAddress, erc20Abi, provider);

    try {
        console.log('\n正在疯狂向主网节点发请求...');
        
        // 读合约里的变量，全都是异步的
        const name = await usdtContract.name();
        const symbol = await usdtContract.symbol();
        const decimals = await usdtContract.decimals();
        
        console.log(`代币名称: ${name}`);
        console.log(`代币代号: ${symbol}`);
        console.log(`小数位数 (精度): ${decimals}`); // USDT 的精度是 6，不是常见的 18！踩坑了！

        // 查一下总发行量
        const totalSupply = await usdtContract.totalSupply();
        // 因为精度是 6，所以用 formatUnits 格式化
        console.log(`总发行量: ${ethers.utils.formatUnits(totalSupply, decimals)} 块钱`);

        // 偷窥 V 神余额
        const vShenAddress = 'vitalik.eth';
        const balance = await usdtContract.balanceOf(vShenAddress);
        console.log(`\n震惊！V 神的钱包里居然有 ${ethers.utils.formatUnits(balance, decimals)} 个 USDT！`);

    } catch (e) {
        console.log('读取失败了，是不是节点抽风了？', e.message);
    }
}

main();