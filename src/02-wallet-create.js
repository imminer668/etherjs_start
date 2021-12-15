/**
 * ethers.js 研究怎么建钱包
 * 上一次学会了连节点查余额，今天看看怎么用代码生成以太坊钱包。
 * 
 */

const { ethers } = require('ethers');

function main() {
    console.log('--- 开始研究怎么生成钱包 ---');

    // 1. 随便瞎生成一个
    console.log('\n[方法一：随机生成]');
    const randomWallet = ethers.Wallet.createRandom();
    console.log('新生成的地址:', randomWallet.address);
    console.log('私钥千万不能泄露（这里是测试无所谓）:', randomWallet.privateKey);
    console.log('助记词（记在小本本上）:', randomWallet.mnemonic.phrase);

    // 2. 拿以前用 MetaMask 生成的助记词导进去试试
    console.log('\n[方法二：用助记词恢复]');
    // 这是一串测试用的废弃助记词
    const myMnemonic = 'test test test test test test test test test test test junk';
    try {
        const restoredWallet = ethers.Wallet.fromMnemonic(myMnemonic);
        console.log('恢复出来的地址:', restoredWallet.address);
        // MetaMask 默认的派生路径好像就是 m/44'/60'/0'/0/0
        // 如果想拿第二个账户，最后那个0改成1就行了，这叫 HD 钱包
        const secondAccount = ethers.Wallet.fromMnemonic(myMnemonic, "m/44'/60'/0'/0/1");
        console.log('顺便看看第二个账户地址:', secondAccount.address);
    } catch (e) {
        console.log('助记词好像写错了：', e.message);
    }

    // 3. 用私钥直接弄
    console.log('\n[方法三：直接拿私钥导入]');
    const testPrivateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const pkWallet = new ethers.Wallet(testPrivateKey);
    console.log('用私钥导出的地址是:', pkWallet.address);

    console.log('\n总结：创建钱包不用联网，纯本地算出来的，这就是密码学。');
}

main();