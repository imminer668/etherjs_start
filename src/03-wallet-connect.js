/**
 * ethers.js 把钱包连上网
 * 前两天的知识结合一下。
 * 钱包只是个私钥，它自己没法查余额，必须连上 provider 才能和以太坊交互。
 */

const { ethers } = require('ethers');

async function main() {
    console.log('--- 钱包要插卡（连节点）才能起飞 ---');
    
    // 1. 先准备个网络节点
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth');
    
    // 2. 准备个钱包，随便写个测试私钥
    // 这个私钥对应的地址是 0x123... 反正没人用它
    const privateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    
    // 把私钥放进去，发现钱包只是离线算出来的
    const offlineWallet = new ethers.Wallet(privateKey);
    console.log('钱包地址是:', offlineWallet.address);

    // 重点来了：怎么连上网？用 connect 方法
    // 或者一开始 new 的时候直接传进去：new ethers.Wallet(privateKey, provider)
    const onlineWallet = offlineWallet.connect(provider);

    try {
        console.log('\n正在用这个连上网的钱包查余额...');
        
        // 以前我们用 provider.getBalance(address) 查别人的余额
        // 现在有了带 provider 的 wallet，可以直接用它自己查自己
        const balance = await onlineWallet.getBalance();
        
        console.log(`余额: ${ethers.utils.formatEther(balance)} ETH`);
        
        // 如果要转账怎么办？
        // 没钱转不了，但可以看看获取 nonce（当前发过多少笔交易）
        const nonce = await onlineWallet.getTransactionCount();
        console.log('这个钱包发过多少笔交易 (Nonce):', nonce);

        console.log('\n要是这里面有钱，就能直接 await onlineWallet.sendTransaction({...}) 转账了，可惜是穷光蛋。');

    } catch (e) {
        console.log('查报错了：', e.message);
    }
}

main();