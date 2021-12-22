/**
 * ethers.js 监听区块链上的大额转账（土狗预警）
 * 合约里除了函数，还有个东西叫 Event（事件）。
 * 就像是合约里的 console.log，每次有人转账，合约就会大喊一声：“A 给 B 转了 100 块！”
 * 写个监听器，蹲点看看主网上的转账。
 */

const { ethers } = require('ethers');

async function main() {
	//额
    console.log('--- 变身链上监控机器人 ---');

    const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');
    const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

    // 只需要写出 Transfer 事件的格式
    const abi = [
        'event Transfer(address indexed from, address indexed to, uint256 value)'
    ];

    const usdtContract = new ethers.Contract(usdtAddress, abi, provider);

    console.log('\n其实实时监听需要 WebSocket (wss://...)');
    console.log('但是我们现在用的是普通 HTTP RPC，它在底层其实是偷偷每隔几秒去轮询（拉取）一次。');
    console.log('为了不把公共节点刷挂被封 IP，我们试一下怎么查“历史记录”吧。\n');

    try {
        // 先获取当前最新区块
        const currentBlock = await provider.getBlockNumber();
        console.log(`当前区块高度: ${currentBlock}`);

        // 查过去 10 个区块里发生的 Transfer 事件
        // 注意：公共节点通常限制只能查很小的范围，查多了会报错！
        const startBlock = currentBlock - 10;
        console.log(`正在查询从 ${startBlock} 到 ${currentBlock} 区块的 USDT 转账记录...`);

        // 创建一个过滤器：我们要看所有的 Transfer 事件
        const filter = usdtContract.filters.Transfer();

        // 开始查！
        const logs = await usdtContract.queryFilter(filter, startBlock, currentBlock);

        console.log(`\n卧槽，短短十几秒内，主网上发生了 ${logs.length} 笔 USDT 转账！`);

        if (logs.length > 0) {
            console.log('随便抽查最新的一笔看看：');
            const latestLog = logs[logs.length - 1];
            
            // logs 里的 args 包含了事件的参数
            const from = latestLog.args.from;
            const to = latestLog.args.to;
            const value = ethers.utils.formatUnits(latestLog.args.value, 6); // USDT 精度是 6

            console.log(`从: ${from}`);
            console.log(`到: ${to}`);
            console.log(`金额: ${value} USDT`);
            console.log(`交易哈希: ${latestLog.transactionHash}`);
        }

        console.log('\n学废了，这就去写个监听大户砸盘的机器人！');

    } catch (e) {
        console.log('查询历史事件翻车了，可能节点不让查这么深：', e.message);
    }
}

main();