import React, { Component} from "react";

import detectEthereumProvider from '@metamask/detect-provider';

import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const globAddr = require('./global');

class Swap extends Component { 
  constructor(props) {
    super(props);  
    this.state = { 
      showModal: "none",
      showCurrencyModal: "none",
      walletconnect: "none",
      walletconnectmsg: "none",
      unlockwallet: "block",
      unlockwalletmsg: "block",
      swapBalErr: "none",
      balFromToken:0,
      baltoToken:0,
      fromTokenValue:0,
      toTokenValue:0,
      btnDisable:1,
      appBtnDisable:1,
      tokenBtn:"none",
      fromTokenName:"Select",
      toTokenName:"Select",
      fromContractAddress: 0,
      toContractAddress: 0,
      selectFromError: "none",
      selectToError: "none",
      price:0
    };
    /* this.swapping = this.swapping.bind(this);  */
    
  }

  async componentDidMount() {
    await new Promise(resolve => setTimeout(resolve, 5000)); 
    if(this.props.signer){
      this.setState({ walletconnect: "block"});
      this.setState({ unlockwallet: "none"});
      this.setState({ walletconnectmsg: "block"});
      this.setState({ unlockwalletmsg: "none"});
      console.log("ACC:"+this.props.accounts.toString());
    }

   }

   conversion = async (_from) => {
    let _fromValue = _from*1E18;
    if(_fromValue!==0){
    let fromConversionToken =""
    switch(this.state.fromTokenName) {
      case 'BUSD':
        fromConversionToken = globAddr.busdAddress
        console.log("SELECTED TOKEN:BUSD");
        break;
      case 'DAI':
        break;
      default:
        fromConversionToken = this.props.pancake.WETH()
        console.log("SELECTED TOKEN:BNB");
    }

    let toConversionToken =""
    switch(this.state.toTokenName) {
      case 'BUSD':
        toConversionToken = globAddr.busdAddress
        console.log("SELECTED TOKEN:BUSD");
        break;
      case 'DAI':
        break;
      default:
        toConversionToken = this.props.pancake.WETH()
        console.log("SELECTED TOKEN:BNB");
    }

    if(fromConversionToken!==null && fromConversionToken!=="" && toConversionToken!==null && toConversionToken!==""){
      await this.props.pancake.getAmountsOut(_fromValue.toString(),[fromConversionToken, 
        toConversionToken]).then((response) => {
        this.setState({ toTokenValue: (response[1]/1E18).toFixed(5)});
        this.setState({ price: ((_fromValue/this.state.toTokenValue)/1E18).toFixed(5)});
        if(this.state.fromTokenName!=="BNB"){
          this.setState({btnDisable: 1});
          this.setState({appBtnDisable: 0});
        }
      }).catch((error) =>{
        toast.error('Conversion Error', {autoClose:3000});
        this.setState({swapBalErr: "none"});
      });
    }
    } 
  }

  swap = async (e) => {
    e.preventDefault();
    let _fromTokenValue=e.target.elements[0].value;
    let _toTokenValue=e.target.elements[1].value;
    _fromTokenValue = parseFloat(_fromTokenValue);
    _toTokenValue = parseFloat(_toTokenValue);
    let fromStateTokenValue = parseFloat(this.state.fromTokenValue);    
    if (_fromTokenValue<=fromStateTokenValue && _fromTokenValue!==0){

      let fromConversionToken =""
      switch(this.state.fromTokenName) {
        case 'BUSD':
          fromConversionToken = globAddr.busdAddress
          console.log("SELECTED TOKEN:BUSD");
          break;
        case 'DAI':
          break;
        default:
          fromConversionToken = this.props.pancake.WETH()
          console.log("SELECTED TOKEN:BNB");
      }
  
      let toConversionToken =""
      switch(this.state.toTokenName) {
        case 'BUSD':
          toConversionToken = globAddr.busdAddress
          console.log("SELECTED TOKEN:BUSD");
          break;
        case 'DAI':
          break;
        default:
          toConversionToken = this.props.pancake.WETH()
          console.log("SELECTED TOKEN:BNB");
      }

      _fromTokenValue = this.state.fromTokenValue*1E18;
      _toTokenValue = this.state.toTokenValue*1E18;

      if(this.state.fromTokenName === "BNB"){
        let _swapTime =""
        await this.props.provider.getBlock("latest").then((response) =>{
          console.log("IN BNB SWAP TIME:::::::"+response.timestamp);
          _swapTime = response.timestamp;
          _swapTime = parseInt(_swapTime) +60;
        });
        let _tokenVal = _fromTokenValue.toString();
        await this.props.pancake.swapExactETHForTokens(0,[fromConversionToken, toConversionToken],
          this.props.signer.getAddress(), _swapTime,{value: _tokenVal}).then((response) => {
            let _fromTokenVal = ((_fromTokenValue/1E18).toFixed(5)).toString();
            let _toTokenVal = ((_toTokenValue/1E18).toFixed(5)).toString();
            toast.success(this.state.fromTokenName +' '+ _fromTokenVal+' swapped to '+_toTokenVal+' '+this.state.toTokenName, {autoClose:3000});
        }).catch((error) =>{
          toast.error('Swapping Error', {autoClose:3000});
          this.setState({swapBalErr: "none"});
        });
      }else{
        let _swapTime =""
        await this.props.provider.getBlock("latest").then((response) =>{
          console.log("IN BUSD SWAP TIME:::::::"+response.timestamp);
          _swapTime = response.timestamp;
          _swapTime = parseInt(_swapTime) +60;
        });
        await this.props.pancake.swapExactTokensForETH(_fromTokenValue.toString(), 0, 
        [fromConversionToken, toConversionToken],this.props.signer.getAddress(), _swapTime).then((response) => {
          toast.success(this.state.fromTokenName +' '+ (_fromTokenValue/1E18).toFixed(5)+' swapped to '+(_toTokenValue/1E18).toFixed(5)+ this.state.toTokenName, {autoClose:3000});
        }).catch((error) =>{
          toast.error('Swapping Error', {autoClose:3000});
          this.setState({swapBalErr: "none"});
        });
      }

    }else{
      this.setState({swapBalErr: "block"});
    }
  }

  approve =async() =>{

    let _fromTokenValue = parseFloat(this.state.fromTokenValue);
    let _bal =parseFloat(this.state.balFromToken);    
    let _stateFromTokenValue = this.state.fromTokenValue*1E18;
    console.log("Approve");
    if (_fromTokenValue<=_bal && _fromTokenValue!==0){

      let approveCall =""
      switch(this.state.fromTokenName) {
        case 'BUSD':
          approveCall = this.props.busd
          console.log("SELECTED TOKEN:BUSD");
          break;
        case 'DAI':
          break;
        default:
          console.log("SELECTED TOKEN:BNB");
      }

    await approveCall.approve(globAddr.pancakeRouterAddress,_stateFromTokenValue.toString()).then((response) => {
      
      toast.success('Approve Success', {autoClose:3000});
      setTimeout(
        () => {this.setState({btnDisable: 0});
        this.setState({appBtnDisable: 1})}, 
        3000
      );
    }).catch((error) =>{
      console.log("error: " + error);
      toast.error('Swapping Error', {autoClose:3000});
      this.setState({swapBalErr: "none"});
    });
    }else{
      this.setState({swapBalErr: "block"});
    }
  }

  async showModal() {
    this.setState({ showModal: "block"});
  }

  async hideModal() {
    this.setState({ showModal: "none"});
  }

  async showCurrencyModal() {
    this.setState({ showCurrencyModal: "block"});
  }

  async hideCurrencyModal() {
    this.setState({ showCurrencyModal: "none"});
  }

  async swapMax() {
    let _fromTokenValue = this.state.balFromToken;
    this.setState({ fromTokenValue: _fromTokenValue});
  }

  async connect() {
    let provider = await detectEthereumProvider();
    if(provider) {
      let accounts ="";
        await provider.request({ method: 'eth_requestAccounts' }).then((result) => {
          accounts= result;
        }).catch((error) =>{
          toast.error(error.message, {autoClose:3000});
        });
    }
  }

  handleFromSwap = async (e) => {
    this.setState({ fromTokenValue: e.target.value });
    let _from=parseFloat(e.target.value);
    let _bal =parseFloat(this.state.balFromToken);
    if(_from<=_bal && this.state.toTokenName!==null && this.state.toTokenName!==""  && this.state.toTokenName!== "Select"){
      if(this.state.toTokenName!=="BNB"){
        this.setState({btnDisable: 0});
        this.setState({appBtnDisable: 1});
      }
    }else{
      this.setState({ btnDisable: 1});
    }
    if(_from!==0 && this.state.toTokenName!==null && this.state.toTokenName!==""  && this.state.toTokenName!== "Select"){
      this.conversion(_from);
    }
  }

  handleToSwap = async (e) => {
    this.setState({ toTokenValue: e.target.value });
  }

  fromTokenName = async (_fromTokenName) => {
    this.setState({ fromTokenName: _fromTokenName });
    if (_fromTokenName!==null && _fromTokenName!== "" && _fromTokenName!== "Select"){
      let contractCall =""
      switch(_fromTokenName) {
        case 'BUSD':
          contractCall = this.props.busd;
          console.log("SELECTED TOKEN:BUSD");
          this.setState({tokenBtn: "block"});
          this.setState({btnDisable: 1});
          break;
        case 'DAI':
          this.setState({tokenBtn: "block"});
          this.setState({btnDisable: 1});
          break;
        default:
          this.setState({ balFromToken: this.props.bnbBalance.toFixed(5)});
          this.setState({tokenBtn: "none"});
          this.setState({btnDisable: 0});
          console.log("SELECTED TOKEN:BNB");
        }
        if(contractCall!==null && contractCall!==""){
          await contractCall.balanceOf(this.props.accounts.toString()).then((balance) => {
            this.setState({ balFromToken: (balance/1E18).toFixed(5)});
           });
        }
      this.hideModal();
      this.setState({selectFromError: "none"});
    }else{
      this.setState({selectFromError: "block"});
    }
    
  }

  toTokenName = async (_toTokenName) => {
    this.setState({ toTokenName: _toTokenName });
    if (_toTokenName!==null && _toTokenName!==""  && _toTokenName!== "Select" ){

      let toContractCall =""
      switch(_toTokenName) {
        case 'BUSD':
          toContractCall = this.props.busd;
          console.log("SELECTED TOKEN:BUSD");
          this.setState({ btnDisable: 0});
          this.setState({ appBtnDisable: 1});
          break;
        case 'DAI':
          this.setState({ btnDisable: 0});
          this.setState({ appBtnDisable: 1});
          break;
        default:
          this.setState({ baltoToken: this.props.bnbBalance.toFixed(5)});
          this.setState({ appBtnDisable: 0});
          console.log("SELECTED TOKEN:BNB");
        }
        if(toContractCall!==null && toContractCall!==""){
          await toContractCall.balanceOf(this.props.accounts.toString()).then((balance) => {
            this.setState({ baltoToken: (balance/1E18).toFixed(5)});
            console.log("BBUSD: "+this.state.baltoToken);
            this.setState({ btnDisable: 1});
          })
        }

      this.hideCurrencyModal();

      if(this.state.fromTokenValue!==0 && _toTokenName!==null && _toTokenName!==""  && _toTokenName!== "Select"){
        this.conversion(this.state.fromTokenValue);
        if(_toTokenName!=="BNB"){  
          this.setState({ btnDisable: 0});
        }
        
      }
    }
  }

  render() {
    return (
      <div>
    <div class="main_wrap">
    <div class="exchange_wrap">
      <div class="wrapper">
      <div id="tab-1" className="tab-content active">
        <div className="row row-xl-12 row-l-3 row-m-3 row-s-3">
          <div className="col-xl-4 col-l-3 col-m-2 col-s-1">&nbsp;</div>
          <div className="col-xl-4 col-l-6 col-m-8 col-s-10">
            <div className="exchange_area">
              <h5>Exchange</h5>
              <p>Trade tokens in an instant</p>
              <form onSubmit={(e) => this.swap(e)} method="post">
              <div className="row row-xl-3 row-l-3 row-m-3 row-s-3 row-xs-3 from_area">
                <div className="col-xl-4 col-l-4 col-m-4 col-s-4 col-xs-4">
                  <p>From</p>
                  <input type="text" id="" value ={this.state.fromTokenValue} onChange={ this.handleFromSwap } name="fromAmount" required/>
                </div>
                <div className="col-xl-4 col-l-4 col-m-4 col-s-4 col-xs-4">
                  <p><a href="#" onClick={() => (this.swapMax())}>MAX </a> </p>
                </div>
                <div className="col-xl-4 col-l-4 col-m-4 col-s-4 col-xs-4">
                <p className="alignright">{this.state.balFromToken.toString()}</p>
                  <p className="da"><img src="images/yellow_squre.png" alt="yellow"/> 
                  <a href="#" onClick={() => (this.showModal())}>{this.state.fromTokenName}</a></p>
                </div>
              </div>
              <div className="aligncenter"><img src="images/bda.png" alt="bda"/></div>
              <p style={{display: this.state.swapBalErr,color:"red"}}>Insufficient Balance</p>
              <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 row-xs-2 from_area">
                <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-4">
                  <p>TO</p>
                  <input type="text" id="" value ={this.state.toTokenValue} onChange={ this.handleToSwap } name="toAmount" required/>
                </div>
                <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-8">
                <p className="alignright">{this.state.baltoToken}</p>
                  <p className="da"><a href="#" onClick={() => (this.showCurrencyModal())}>{this.state.toTokenName}</a></p>
                </div>
              </div>
              <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 row-xs-2">
                <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-8">
                  <p>Price</p>
                </div>
                <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-4">
                  <p className="alignright">{this.state.price}</p>
                </div>
              </div>
              <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 row-xs-2">
                <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-8">
                  <p>Slippage Tolerance</p>
                </div>
                <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-4">
                  <p className="alignright">1%</p>
                </div>
              </div>

              <button type="button" disabled={this.state.appBtnDisable} className="btn" style={{display: this.state.walletconnect && this.state.tokenBtn}} 
              onClick={() => (this.approve())}>Approve</button> 

              <input type="submit" disabled={this.state.btnDisable} className="btn" style={{display: this.state.walletconnect}} value="Swap"></input> 

              <button type="button" className="btn" style={{display: this.state.unlockwallet}} onClick={() => (this.connect())} > Unlock Wallet</button> 
              </form>
            </div>
          </div>
          <div className="col-xl-4 col-l-3 col-m-2 col-s-1">&nbsp;</div>
        </div>
      </div>

      </div>
    </div>
</div>

<div style={{display: this.state.showModal}}>
  <div id="myModal" class="modal_book">
    <div class="modal-content"> <span class="close cursor" onClick={() => (this.hideModal())}>×</span>
      <div class="download_box">
        <div class="download_form">
          <h6>Select a token</h6>
          <form method="post">
            <div class="aligncenter">
              <div class="row row-xl-1 row-l-1 row-m-1">
                <div class="col-xl-12 col-l-12 col-m-12">
                  <input type="text" id="" name="Name" placeholder="Search Name or Paste Address"/>
                </div>
                <div class="col-xl-12 col-l-12 col-m-12 token_area">
                <p style={{display: this.state.selectFromError,color:"red"}}>Select Token</p>
                  <ul>
                    <li onClick={() => this.fromTokenName("BNB")} value="BNB"><img src="images/t-1.png" alt="token"/> BNB</li>
                    <li onClick={() => this.fromTokenName("BUSD")} value="BUSD"><img src="images/t-1.png" alt="token"/> BUSD</li>
                    <li><img src="images/t-1.png" alt="token"/> 1INCH</li>
                    <li><img src="images/t-1.png" alt="token"/> AAVE</li>
                    <li><img src="images/t-1.png" alt="token"/> AMP</li>
                    <li><img src="images/t-1.png" alt="token"/> ANT</li>
                    <li><img src="images/t-1.png" alt="token"/> BAL</li>
                  </ul>
                </div>
                {/* <div class="col-xl-12 col-l-12 col-m-12 col-s-12">
                  <button type="button" onClick={() => (this.hideModal())}>Manage</button>
                </div> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>


<div style={{display: this.state.showCurrencyModal}}>
  <div id="myModal_2" class="modal_book">
    <div class="modal-content"> <span class="close cursor" onClick={() => (this.hideCurrencyModal())}>×</span>
      <div class="download_box">
        <div class="download_form">
          <h6>Select a token</h6>
          <form method="post">
            <div class="aligncenter">
              <div class="row row-xl-1 row-l-1 row-m-1">
                <div class="col-xl-12 col-l-12 col-m-12">
                  <input type="text" id="" name="Name" placeholder="Search Name or Paste Address"/>
                </div>
                <div class="col-xl-12 col-l-12 col-m-12 token_area">
                <p style={{display: this.state.selectToError,color:"red"}}>Select Token</p>
                  <ul>
                    <li onClick={() => this.toTokenName("BNB")} value="BNB"><img src="images/t-1.png" alt="token"/> BNB</li>
                    <li onClick={() => this.toTokenName("BUSD")} value="BUSD"><img src="images/t-1.png" alt="token"/> BUSD</li>
                    <li><img src="images/t-1.png" alt="token"/> AAVE</li>
                    <li><img src="images/t-1.png" alt="token"/> AMP</li>
                    <li><img src="images/t-1.png" alt="token"/> ANT</li>
                    <li><img src="images/t-1.png" alt="token"/> BAL</li>
                  </ul>
                </div>
                {/* <div class="col-xl-12 col-l-12 col-m-12 col-s-12">
                  <button name="" type="button"  onClick={() => (this.hideCurrencyModal())}>Manage</button>
                </div> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>


</div>

    );
  }
}

export default Swap;

