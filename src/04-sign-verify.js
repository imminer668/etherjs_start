/**
 * ethers.js 签名和验证
 * 其实就是用私钥给一段话盖个章，别人拿着我的公钥就能证明是我盖的。
 */

const { ethers } = require('ethers');

async function main() {
    console.log('--- 自己动手盖个章（签名） ---');

    // 随便创个临时钱包用来演示，连不连网都行，签名是纯本地计算的！
    const myWallet = ethers.Wallet.createRandom();
    console.log('我是谁:', myWallet.address);

    // 我想说的话
    const message = 'Hello Web3! 我是韭菜！';
    console.log('\n我想对世界说:', message);

    try {
        // 拿我的私钥给这句话盖章
        // 返回一长串 16 进制字符串，这就是签名结果
        const signature = await myWallet.signMessage(message);
        console.log('\n盖完章长这样 (Signature):');
        console.log(signature);

        console.log('\n--- 接下来假装我是另一个人，我要验证这个章是不是你盖的 ---');

        // 把这段话和这串签名丢进去，ethers 就能神奇地推算出盖章人的地址！
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        
        console.log('推算出来的盖章人:', recoveredAddress);
        
        // 看看推算出来的地址是不是跟刚才那个一样
        if (recoveredAddress === myWallet.address) {
            console.log('卧槽，验证通过！真的是他签的字！');
        } else {
            console.log('假的吧！');
        }

        console.log('\n这就叫密码学！以后登录网站连密码都不用输了，点一下签名就行，太帅了。');

    } catch (e) {
        console.log('翻车了：', e.message);
    }
}

main();