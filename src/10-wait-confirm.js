/**
 * ethers.js 
 * 还没完，得等矿工打包
 * 如果是Web2，调个后端接口返回 200 就完事了。
 * Web3，发完交易还要等！有时候等几秒，有时候等几小时（如果 Gas 给少了的话，等太久了就要去看下拥堵情况了），等区块确认，确认了才真的上链了。
 */

const { ethers } = require('ethers');

async function main() {
    console.log('--- 交易发出去后，我们在等什么？ ---');

    console.log('\n以太坊的交易生命周期是这样的：');
    console.log('1. Pending (排队中) -> 刚发出去，在矿工的内存池(Mempool)里排队');
    console.log('2. Mined (已出块) -> 被矿工打包进区块了！');
    console.log('3. Confirmed (已确认) -> 后面又跟了几个新区块，基本不可能回滚了');

    console.log('\n在 ethers.js 里，怎么写代码等？');
    console.log('假设你刚才执行了转账：');
	//const tx = await wallet.sendTransaction(txConfig);'
    console.log('  const tx = await wallet.sendTransaction(txConfig);');
    
    console.log('\n这时候 tx 马上就返回了，它里面包含了一个交易哈希(hash)');
    console.log('但这个时候钱还没到账！');

    console.log('\n正确姿势是调用 wait()：');
    console.log('  console.log("交易已发送，去泡杯咖啡...");');
	//const receipt = await tx.wait(); // 默认等 1 个区块确认'
    console.log('  const receipt = await tx.wait(); // 默认等 1 个区块确认');
	//
    
    console.log('\n如果这笔交易涉及几百万美元，1 个确认不保险怎么办？就好像交易所充值要等几十个区块确认才给你入账');
    console.log('你可以让它等 6 个区块：');
	//const receipt = await tx.wait(6);
    console.log('  const receipt = await tx.wait(6);');
    //分析receipt
    console.log('\nreceipt 拿到之后，里面有什么？');
    console.log('  - receipt.status: 如果是 1，说明交易成功；如果是 0，说明交易失败（比如 Gas 不够，或者被合约 revert 了）');
    console.log('  - receipt.gasUsed: 这次交易到底实际烧了多少 Gas');
    
    console.log('\n总结：');
    console.log('前端开发，很大一部分工作就是在处理这种“薛定谔的交易状态”。');
    console.log('要给用户画转圈圈的 loading 动画，要处理被卡住的情况。');
    console.log('太坑了，当然，还有靠谱的RPC很重要，线上一定要用付费的RPC');
}

main();