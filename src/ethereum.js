import { ethers, Contract } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

import { stakingContract } from "./contracts/staking";
import { tokenContract } from "./contracts/token";
import { pancakeRouterContract } from "./contracts/pancakerouter";
import { busdContract } from "./contracts/busd";

const {tokenAddress,stakingAddress,pancakeRouterAddress,busdAddress} = require('./global');

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      let provider = await detectEthereumProvider();
      if(provider) {
        let accounts ="";
        await provider.request({ method: 'eth_requestAccounts' }).then((result) => {
          accounts = result;
          provider.on('accountsChanged', (result) => {
            accounts = result;
          });
        });

        await provider.request({method: 'eth_chainId'}).then((result) =>{
          provider.on('chainChanged', (chainId) => {
            console.log("Chain"+chainId);
          });
        });

        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        let bnbBalance=""

        await provider.getBalance(accounts.toString()).then((balance) => {
          bnbBalance =balance/1E18;
        });

        const token = new Contract(
          tokenAddress, tokenContract, signer
        );

        const staking = new Contract(
          stakingAddress,stakingContract, signer
        );

        const pancake = new Contract(
          pancakeRouterAddress,pancakeRouterContract, signer
        );

        const busd = new Contract(
          busdAddress,busdContract, signer
        );

        resolve({provider,signer,token,staking,accounts,pancake,busd,bnbBalance});
      }
      reject('Install or Login Metamask');
      resolve({provider:undefined, signer:undefined, staking: undefined, token:undefined, accounts:undefined, pancake:undefined,busd:undefined,bnbBalance:undefined});
    });
  });

export default getBlockchain;