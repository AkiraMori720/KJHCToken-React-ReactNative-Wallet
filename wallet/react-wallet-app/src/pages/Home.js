import React from "react";
import metamask from "../lib/metamask";
import supported from "../lib/supported";

class Home extends React.Component{
    constructor(props) {
        super(props);
    }

    isInjected = () => {
        return window && window.ethereum;
    }

    onConnectMetaMask = () => {
        metamask.web3connect.connectTo(supported.INJECTED).then(connected => {
            if (!connected && metamask.web3connect.isLocked()) {
                return console.log('metamask locked');
            }
            this.props.history.push('/wallet');
        }).catch(e => {
            console.log('metamask connect error', e);
        })
    }

    render() {
        return (
            <div className="App">
                <input className={'connectBtn'} type='button' value='Connect MetaMask' onClick={this.onConnectMetaMask}/>
            </div>
        );
    }

}

export default Home;
