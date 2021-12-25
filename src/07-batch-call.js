/**
 * ethers.js r前端太卡了，用用 Promise.all 批量查数据缓解
 * 查代币信息的脚本，使用 await name(), await symbol() 这样一个个查太慢了。
 * 每次查都要跟节点做一次网络请求，这在 Web2 里叫 N+1 查询问题，是要被开除的。
 * 今天学学怎么用批量请求，使用 Promise.all 并发请求。
 */

const { ethers } = require('ethers');

async function main() {
    console.log('--- 开始体验并发查询的速度 ---');

    const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');
    const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    
    const abi = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
        'function totalSupply() view returns (uint256)'
    ];

    const contract = new ethers.Contract(usdtAddress, abi, provider);

    try {
        console.log('开始同时发送 4 个请求...');
        const startTime = Date.now();

        // 把 4 个异步任务装进一个数组里，一起发出去！
        // 这样总耗时只取决于最慢的那个请求，而不是 4 个请求的时间相加。
        const [name, symbol, decimals, totalSupply] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.decimals(),
            contract.totalSupply()
        ]);

        const endTime = Date.now();
        console.log(`\n查完了！总共耗时: ${endTime - startTime} 毫秒`);
        
        console.log(`结果 -> ${name} (${symbol}), 精度: ${decimals}, 总量: ${ethers.utils.formatUnits(totalSupply, decimals)}`);

        console.log('\n进阶思考：');
        console.log('虽然 Promise.all 在前端并发了，但对节点来说还是收到了 4 个请求。');
        console.log('听说有个叫 Multicall 的高级智能合约，可以在链上把几百个查询打包成 1 个请求返回。');
        console.log('太高端了，等以后成了高工再去研究 Multicall 吧，现在 Promise.all 够用了！');

    } catch (e) {
        console.log('并发请求翻车了：', e.message);
    }
}

main();