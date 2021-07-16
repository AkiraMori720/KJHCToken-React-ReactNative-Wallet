import React from "react";

class Home extends React.Component{
    constructor(props) {
        super(props);
    }

    onConnectMetaMask = () => {
        console.log('connect metamask');
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
