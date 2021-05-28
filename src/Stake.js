import React, { Component} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const globAddr = require('./global');


class Stake extends Component { 
  constructor(props) {
    super(props);
    this.state = { 
      totalStakes: 0,
      stakeRecords: 0,
      stakedAmount: 0,
      tokensAvailable: 0,
      depositTokens:0,
      withdrawTokens:0,
      showModal: "none",
      showWithdrawModal: "none",
      walletconnect: "none",
      walletconnectmsg: "none",
      unlockwallet: "block",
      unlockwalletmsg: "block",
      zerodeposit: "block",
      depositBalErr: "none",
      withdrawBalErr: "none"
    }; 

    this.deposit = this.deposit.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.hideModal =this.hideModal.bind(this);
    this.hideWithdrawModal = this.hideWithdrawModal.bind(this);
    
  }

  async componentDidMount() {
    await new Promise(resolve => setTimeout(resolve, 10000)); 
    let address =null;
    if(this.props.signer){
      address = this.props.signer.getAddress();
      this.setState({ address: address});
      const stakeRecords = await this.props.staking.stakeRecords(address);
      let _stakeAmount = stakeRecords.stakedAmount;
      _stakeAmount = (_stakeAmount/1E18).toFixed(5);
      this.setState({ stakedAmount: _stakeAmount});
      if(_stakeAmount ===0){
        this.setState({ zerodeposit: "none"});
      }
      this.setState({ walletconnect: "block"});
      this.setState({ unlockwallet: "none"});
      this.setState({ walletconnectmsg: "block"});
      this.setState({ unlockwalletmsg: "none"});
      let _balance = await this.props.token.balanceOf(address);
      _balance = (_balance/1E18).toFixed(5);
      this.setState({ tokensAvailable: _balance});
    }else{
      console.log("Login or Install Metamask");
    }
  }

   async harvest() {
     await this.props.staking.harvest().then((response) => {
      toast.success('Harvest success', {autoClose:3000});
    }).catch((error) =>{
      toast.error('Harvest Not Working', {autoClose:3000});
    });
   }

  async compound() {
    await this.props.staking.compound().then((response) => {
      toast.success('Compound success', {autoClose:3000});
    }).catch((error) =>{
      toast.error('Compound Not Working', {autoClose:3000});
    });

  }

  deposit = async (e) => {
    console.log("Deposit...");
    e.preventDefault();
    let amount=e.target.elements[0].value;
    amount = parseFloat(amount);
    let tokensAvailable = parseFloat(this.state.tokensAvailable);

    if (amount<=tokensAvailable && amount!==0){
      amount = this.state.depositTokens*1E18;
      await this.props.token.approve(globAddr.stakingAddress,amount.toString()).then((response) => {
        this.props.staking.createStake(amount.toString()).then((response) => {
          this.hideModal();
          toast.success('Deposit success', {autoClose:3000});
         }).catch((error) =>{
           console.log("error: " + error);
           toast.error('Deposit Error', {autoClose:3000});
           this.setState({depositBalErr: "none"});
         });
      }).catch((error) =>{
        console.log("error: " + error);
        toast.error('Deposit Error', {autoClose:3000});
        this.setState({depositBalErr: "none"});
      });

    }else{
      this.setState({depositBalErr: "block"});
      toast.error('Deposit Error', {autoClose:3000});
    }
    
  }


  withdraw = async (e) => {
    e.preventDefault();
    let amount=e.target.elements[0].value;
    if (amount<=this.state.stakedAmount && amount!==0){
      amount = this.state.withdrawTokens*1E18;
      await this.props.staking.unStake(amount.toString()).then((response) => {
        toast.success('Withdrawl success', {autoClose:3000});
        this.hideWithdrawModal();
      }).catch((error) =>{
        toast.error('Withdrawl Error', {autoClose:3000});
        this.setState({withdrawBalErr: "none"});
      });
    }else{
      this.setState({withdrawBalErr: "block"});
    }
  }

  async showModal(e) {
    this.setState({ showModal: "block"});
  }
  async hideModal(e) {
    this.setState({ showModal: "none"});
    this.setState({ depositTokens: 0});
    this.setState({depositBalErr: "none"});
  }

  async showWithdrawModal(e) {
    this.setState({ showWithdrawModal: "block"});
  }
  async hideWithdrawModal(e) {
    this.setState({ showWithdrawModal: "none"});
    this.setState({ withdrawTokens: 0});
    this.setState({withdrawBalErr: "none"});
  }

  async connect() {
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

  async depositmax() {
      let _tokensAvailable = this.state.tokensAvailable;
      this.setState({ depositTokens: _tokensAvailable});
  }

  async withdrawmax() {
    let _withdrawTokens = this.state.stakedAmount;
    this.setState({ withdrawTokens: _withdrawTokens});
  }

  handleDeposit = async (e) => {
    this.setState({ depositTokens: e.target.value });
  }

  handleWithdraw = async (e) => {
    this.setState({ withdrawTokens: e.target.value });
  }

  render() {
    return (
      <div>
        <div class="main_wrap">
    <div class="exchange_wrap">
      <div class="wrapper">
        <div id="tab-2" className="tab-content active">
          <div className="row row-xl-3 row-l-3 row-m-3 row-s-3 ">
            <div className="col-xl-4 col-l-3 col-m-2 col-s-1">&nbsp;</div>
            <div className="col-xl-4 col-l-6 col-m-8 col-s-10">
              <div className="exchange_area">
                <h6>EbiStakeSwap pool</h6>

                <div style={{display: this.state.walletconnect}}>
                  
                  <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 row-xs-1 earned_area">
                    <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-12"> 
                      <h5>0.0000</h5>
                      <p>EbiStakeSwap earned</p>
                    </div>
                    <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-12" style={{display: this.state.zerodeposit}}> 
                      <button type="button" className="btn"  onClick={() => (this.harvest())} > Harvest</button> 
                      <button type="button" className="btn"  onClick={() => (this.compound())} > Compound</button> 
                    </div>

                  </div>
                  <div className="aligncenter btn_area"> 
                    <button type="button" className="btn btn-white unstake-btn" onClick={() => (this.showWithdrawModal())} >Unstake CAKE</button> 
                    <button type="button" className="btn" onClick={() => (this.showModal())} >+</button> 
                  </div>
                </div>

                <div className="col-xl-12 col-l-12 col-m-12 col-s-12 col-xs-12" style={{display: this.state.unlockwallet}}>
                  <button type="button" className="btn unlock-btn"   onClick={() => (this.connect())} > Unlock Wallet</button> 
                </div>

                <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 row-xs-2 from_area">
                  <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-6">
                    <p>APR</p>
                  </div>
                  <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-6 alignright">
                    
                    <p style={{display: this.state.walletconnectmsg}}>98.21%</p>

                    <p style={{display: this.state.unlockwalletmsg}}>Locked</p>

                  </div>
                </div>
                <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 row-xs-2 from_area">
                  <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-6">
                    <p>Your Stake</p>
                  </div>
                  <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-6 alignright">
                  
                  <p style={{display: this.state.walletconnectmsg}}>{this.state.stakedAmount.toString()}</p>
                  
                  <p style={{display: this.state.unlockwalletmsg}}>Locked</p>

                  </div>
                </div>

              </div>

            </div>
            <div className="col-xl-4 col-l-3 col-m-2 col-s-1">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
</div>
<div style={{display: this.state.showModal}}>
  
  <div id="myModal_1" className="modal_book">
        <div className="modal-content"> <span className="close cursor" onClick={() => (this.hideModal(this))}>×</span>
          <div className="download_box">
            <div className="download_form">
              <h6>Deposit EbiStakeSwap Tokens</h6>
              <form onSubmit={(e) => this.deposit(e)} method="post">
                <div className="aligncenter">
                  <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 gap-small-bottom">
                    <div className="col-xl-3 col-l-6 col-m-6 col-s-6">&nbsp;</div>
                    <div className="col-xl-9 col-l-6 col-m-6 col-s-6 alignright"> {this.state.tokensAvailable.toString()} Tokens Available</div>
                  </div>
                  <div className="row row-xl-3 row-l-3 row-m-3 row-s-3 row-sx-3 token_box">
                    <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-4">
                      <input type="text" id="" value ={this.state.depositTokens} onChange={ this.handleDeposit } name="amount" required/>
                    </div>
                    <div className="col-xl-3 col-l-3 col-m-3 col-s-3 col-xs-4"> <a href="#" onClick={() => (this.depositmax())} className="btn">Max</a> </div>
                    <p style={{display: this.state.depositBalErr,color:"red"}}>Insufficient Balance</p>
                  </div>
                  <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 row-xs-2">
                    <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-6"> <a href="#" className="btn"  onClick={() => (this.hideModal())} >Cancel</a> </div>
                    <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-6"> <button type="submit" className="btn">Confirm</button> </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> 
  </div>


  <div style={{display: this.state.showWithdrawModal}}>
  
  <div id="myModal_2" className="modal_book">
        <div className="modal-content"> <span className="close cursor" onClick={() => (this.hideWithdrawModal())}>×</span>
          <div className="download_box">
            <div className="download_form">
              <h6>Withdraw EbiStakeSwap Tokens</h6>
              <form onSubmit={e => this.withdraw(e)} method="post">
                <div className="aligncenter">
                  <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 gap-small-bottom">
                    <div className="col-xl-3 col-l-6 col-m-6 col-s-6">&nbsp;</div>
                    <div className="col-xl-9 col-l-6 col-m-6 col-s-6 alignright">{this.state.stakedAmount.toString()} Tokens Available</div>
                  </div>
                  <div className="row row-xl-3 row-l-3 row-m-3 row-s-3 row-sx-3 token_box">
                    <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-4">
                      <input type="text" id="" value ={this.state.withdrawTokens} onChange={ this.handleWithdraw } name="amount" required/>
                    </div>
                    <div className="col-xl-3 col-l-3 col-m-3 col-s-3 col-xs-4"> <a href="#" onClick={() => (this.withdrawmax())} className="btn">Max</a> </div>
                    <p style={{display: this.state.withdrawBalErr,color:"red"}}>Insufficient Balance</p>
                  </div>
                  <div className="row row-xl-2 row-l-2 row-m-2 row-s-2 row-xs-2">
                    <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-6"> <a href="#" onClick={() => (this.hideWithdrawModal())} className="btn">Cancel</a> </div>
                    <div className="col-xl-6 col-l-6 col-m-6 col-s-6 col-xs-6"> <button type="submit" className="btn">Confirm</button> </div>
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

export default Stake;

