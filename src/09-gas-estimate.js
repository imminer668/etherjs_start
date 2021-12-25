/**
 * ethers.js 以太坊的 Gas 费太贵了，转账前先算算账
 * 发交易要花 Gas 费。
 * Gas 费 = 用掉的油(Gas Used) * 油价(Gas Price)。
 * 就像开车，跑了多少公里 * 每升汽油多少钱。
 */

const { ethers } = require('ethers');

async function main() {
	//开始
    console.log('--- 开始算账：Gas 费刺客 ---');

    const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');
    
    try {
        console.log('\n[第一步：去加油站看看今天的油价]');
        
        // EIP-1559，油价变得复杂了，有基础费和小费
        const feeData = await provider.getFeeData();
        
        // 我们习惯用 gwei 来看油价，这里转下单位
        const gasPriceGwei = ethers.utils.formatUnits(feeData.gasPrice, 'gwei');
        console.log(`当前网络平均油价 (Gas Price): ${parseFloat(gasPriceGwei).toFixed(2)} gwei`);

        console.log('\n[第二步：算算这趟车要跑多少公里 (Gas Limit)]');
        console.log('比如我想调用 USDT 的 transfer 函数转账。');
        
        // 因为我们没有私钥，所以没法真用 contract.estimateGas 去算
        // 正常应该这么写：const gasEstimate = await contract.estimateGas.transfer(to, amount);
        
        // 凭经验，一次 ERC20 转账大概消耗 65000 的 Gas
        const gasEstimate = 65000; 
        console.log(`一次 USDT 转账大概需要耗费: ${gasEstimate} 单位的 Gas`);

        console.log('\n[第三步：结账！]');
        // 总费用 = Gas消耗量 * 油价
        // feeData.gasPrice 是 BigNumber 格式的 wei
        const totalFeeWei = feeData.gasPrice.mul(gasEstimate);
        
        // 把 wei 转换成 ETH 给人看
        const totalFeeEth = ethers.utils.formatEther(totalFeeWei);
        
        console.log(`如果我现在去转一笔 USDT，矿工大概要收我: ${totalFeeEth} ETH 的手续费。`);
        
        // 算算折合多少美元，假设ETH 3000。额，其实现在接近4000
        const usdCost = parseFloat(totalFeeEth) * 3000;
        console.log(`折合美元大概是: $${usdCost.toFixed(2)}`);

        console.log('\n心得：在以太坊主网上，随便动一下手指就是一顿外卖钱，肉疼！');

    } catch (e) {
        console.log('算账失败：', e.message);
    }
}

main();