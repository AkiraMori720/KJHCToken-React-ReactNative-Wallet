import React, { Component } from 'react'
import metamask from "../../lib/metamask";

class CurrencyItem extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const {item} = this.props;
        const ethRowWithoutExternalProvider = item.address.toLowerCase() === 'not connected' && !metamask.web3connect.isInjectedEnabled();

        return (
            !ethRowWithoutExternalProvider
            && <div className="currencyItem">
                Item
            </div>
        );
    }
}

export default CurrencyItem;
