  
import React, {useState, useEffect} from 'react';
import Stake from './Stake.js';
import Swap from './Swap.js';
import getBlockchain from './ethereum.js';
import detectEthereumProvider from '@metamask/detect-provider';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, Redirect
} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [signer, setSigner] = useState(undefined); 
  const [staking, setStaking] = useState(undefined); 
  const [pancake, setPancake] = useState(undefined); 
  const [token, setToken] = useState(undefined);
  const [busd, setBusd] = useState(undefined);  
  const [address, setAddress] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [bnbBalance, setBnbBalance] = useState(undefined);
  const [provider, setProvider] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState("none"); 
  const [isNotLoggedIn, setIsNotLoggedIn] = useState("block");  
  
  useEffect(() => {
    const init = async () => {
      const {provider, signer,staking, busd, pancake, token, accounts, bnbBalance  } = await getBlockchain();
      setStaking(staking);
      setSigner(signer);
      setBusd(busd);
      setPancake(pancake);
      setToken(token);
      setAccounts(accounts);
      setBnbBalance(bnbBalance);
      setProvider(provider);
      
     
      let addr = accounts.toString();
      const start = addr.slice(0,4);
      const end = addr.slice(38,42);
      setAddress(start+"...."+end);

      setIsLoggedIn("block");
      setIsNotLoggedIn("none");
      toast.configure();
    }
    init();
}, []);
      

const connect = async() => {
    let provider = await detectEthereumProvider();
    if(provider) {
      let accounts ="";
        await provider.request({ method: 'eth_requestAccounts' }).then((result) => {
          accounts = result;
        }).catch((error) =>{
          toast.error(error.message, {autoClose:3000});
        });
    }else{
      toast.error("Install or Login Metamask", {autoClose:3000});
    }
}

  return ( 
    <div>
      <Router>
        <header>
          <div class="wrapper">

            <div class="col-xl-2 col-l-2 col-m-2 col-s-4 col-xs-6 logo">
              EBISTAKESWAP</div>
           
              
              <div class="col-xl-6 col-l-4 col-m-6 col-s-6 col-xs-6 menu_area tab_area">
                  <ul class="tabs">
                    <li class="tab-link dt1"  data-tab="tab-1">
                      <Link to="/swapping" class="routing-color">SWAP</Link>
                    </li>
                    <li class="tab-link dt1"  data-tab="tab-1">
                      <Link to="/staking" class="routing-color">STAKE</Link>
                    </li>
                  </ul>
              </div>

                  <div class="col-xl-2 col-l-4 col-m-4 col-s-2 col-xs-6 isLogged">
                  <div style={{display: isLoggedIn}}>
                      <p class="user-addr">{address}</p>
                    </div>
                    <div style={{display: isNotLoggedIn}}>
                      <button type="button" className="btn"  onClick={() => connect()}> Connect</button>
                    </div>
                  </div>
            </div>
        </header>

        <Switch>
          <Route exact path="/">
              <Redirect to="/staking" />
          </Route>
            <Route path="/staking">
              <Stake staking={staking} signer={signer} token={token} accounts={accounts} bnbBalance={bnbBalance} isLoggedIn={isLoggedIn} isNotLoggedIn={isNotLoggedIn} provider={provider}/>
            </Route>
            <Route path="/swapping">
              <Swap pancake={pancake} signer={signer} token={token} busd={busd} accounts={accounts} bnbBalance={bnbBalance} isLoggedIn={isLoggedIn} isNotLoggedIn={isNotLoggedIn} provider={provider}/>
            </Route>
        </Switch>
      </Router>
    </div>    
  );
}

export default App;