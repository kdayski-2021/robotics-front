import Web3 from 'web3';
import Web3Modal from 'web3modal';
import ethProvider from 'eth-provider';
import Authereum from 'authereum';
import { gasPriceApi, stackAbi, stackAddress } from '@/config/default.json';
import farms from '@/config/farms.json';
import axios from 'axios';
class Bia {
  constructor() {
    this.connected = false;
    this.provider = '';
    this.web3 = '';
    this.accountAddress = '';
    this.contract = '';
    this.chainId = '';
  }

  async connect(callback = () => { }) {
    if (!this.connected) {
      const providerOptions = {
        frame: {
          package: ethProvider,
        },
        authereum: {
          package: Authereum,
        },
      };
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        theme: 'dark',
      });
      web3Modal.clearCachedProvider();

      this.provider = await web3Modal.connect();
      this.web3 = new Web3(this.provider);
      this.web3.eth.net
        .isListening()
        .then(() => {
          this.web3.eth.getAccounts().then((e) => {
            this.accountAddress = e[0];
            this.web3.eth.getChainId().then(async (r) => {
              this.chainId = r;
              this.connected = true;
              callback({
                address: this.accountAddress,
                success: true,
              });
            });
          });
        })
        .catch(() => {
          callback({ address: null, success: false });
        });
    } else {
      this.networkName = await this.web3.eth.net.getNetworkType();
      callback({ address: this.accountAddress, success: true });
    }
  }

  spliceAddress(address) {
    return address.substr(0, 5) + '..' + address.substr(address.length - 4, 4);
  }
  gweiToWei(gwei) {
    return String(Number(gwei) * 1000000000);
  }

  async stringToWei(speed = 'average') {
    const availableSpeed = ['slow', 'average', 'fast'];
    if (String(Number(speed)) === 'NaN') {
      const gasPrices = await this.getGasPrices();
      if (availableSpeed.includes(speed)) {
        return gasPrices[speed];
      } else {
        return gasPrices['average'];
      }
    } else {
      return speed;
    }
  }

  async getGasPrices() {
    try {
      const {
        data: {
          result: { SafeGasPrice, ProposeGasPrice, FastGasPrice },
        },
      } = await axios.get(gasPriceApi);
      return {
        slow: this.gweiToWei(SafeGasPrice),
        average: this.gweiToWei(ProposeGasPrice),
        fast: this.gweiToWei(FastGasPrice),
      };
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  async createWallet() {
    try {
      const account = await this.web3.eth.accounts.create(
        this.web3.utils.randomHex(32)
      );
      const wallet = await this.web3.eth.accounts.wallet.add(account);
      return { privateKey: wallet.privateKey, walletAddress: wallet.address };
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  async getBalance(walletAddress) {
    try {
      const balance = await this.web3.eth.getBalance(walletAddress);
      const etherValue = await this.web3.utils.fromWei(balance, 'ether');
      return etherValue;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async transferTokens(to, value, gasPriceString) {
    try {
      const gasPrice = await this.stringToWei(gasPriceString);
      return new Promise((resolve, reject) => {
        this.web3.eth
          .sendTransaction({
            from: this.accountAddress,
            to,
            gasPrice,
            value: this.web3.utils.toWei(value, 'ether'),
          })
          .then((receipt) => {
            resolve(receipt);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async depositTokens(to, value) {
    return new Promise((resolve, reject) => {
      const wei = this.web3.utils.toWei(value, 'ether')
      const contract = new this.web3.eth.Contract(
        stackAbi,
        stackAddress
      )
      contract.methods.deposit(farms[to], wei).send({ from: this.accountAddress }, (err, res) => {
        if (err) reject(err)
        resolve(res)
      });
    });
  }

  async withdrawTokens(to, value) {
    return new Promise((resolve, reject) => {
      const wei = this.web3.utils.toWei(value, 'ether')
      const contract = new this.web3.eth.Contract(
        stackAbi,
        stackAddress
      )
      contract.methods.withdraw(farms[to], wei).send({ from: this.accountAddress }, (err, res) => {
        if (err) reject(err)
        resolve(res)
      });
    });
  }
}
export default Bia;

// app.post('/wallet/transfer/', async (req, res) => {
//   try {
//     const { from, to, privateKey, value } = req.body;
//     const gasPrice = await stringToWei(req.body.gasPrice);

//     const web3 = await connect();

//     const tx = {
//       from,
//       to,
//       gasPrice,
//       gas: '21000',
//       value: web3.utils.toWei(value, 'ether'),
//     };

//     const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
//     const sentTx = web3.eth.sendSignedTransaction(
//       signedTx.raw || signedTx.rawTransaction
//     );
//     sentTx.on('receipt', (receipt) => {
//       res.send(receipt);
//     });
//     sentTx.on('error', (err) => {
//       res.status(500).send(err);
//     });
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });
