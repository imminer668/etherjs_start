/**
 * 跟着教程学 ethers.js 第一天
 * 听说现在写智能合约和脚本都用 ethers.js 了，web3.js 已经 out 了？
 * 
 */

const { ethers } = require('ethers');

async function main() {
	//先试试怎么连上以太坊网络读取数据。
    console.log('--- 刚开始学 ethers，先连个主网试试 ---');
    
    // 教程上说要用 Infura，去注册了一个免费账号，结果发现主网节点也能随便找公共的
    // 先用一个公共 RPC 凑合一下，Infura 的 key 以后再说（太麻烦了）
    const rpcUrl = 'https://rpc.ankr.com/eth'; 
    console.log('节点地址:', rpcUrl);

    // 注意是 providers，不是 provider！我一开始少写了个 s 报错半天
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    try {
        // 看看当前以太坊出到第几个区块了
        const blockNumber = await provider.getBlockNumber();
        console.log('卧槽连上了！当前区块高度是:', blockNumber);
        
        // 查一下 V 神的钱包余额 (vitalik.eth)
        // 查 ENS 域名好像自带支持？牛逼
        const vShenAddress = 'vitalik.eth';
        console.log(`\n正在查 ${vShenAddress} 的余额...`);
        
        const balance = await provider.getBalance(vShenAddress);
        // 返回的居然是个叫 BigNumber 的东西，直接打印出来看不懂，是一大串数字
        // console.log('原始返回值:', balance); 
        
        // 必须用 utils.formatEther 转成咱们人类能看懂的 ETH 单位
        const ethBalance = ethers.utils.formatEther(balance);
        console.log(`V神有: ${ethBalance} 个 ETH，财富自由了兄弟们`);

    } catch (error) {
        console.error('翻车了，报错信息：', error.message);
    }
}

main();