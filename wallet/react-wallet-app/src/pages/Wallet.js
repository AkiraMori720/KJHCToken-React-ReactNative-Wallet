import React from "react";
import CurrenciesList from "./components/currenciesList";
import { connect } from 'react-redux';
import metamask from "../lib/metamask";
import config from "../config";
import {getCoinInfo} from "../utils/helper";

class Wallet extends React.Component{
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            userWallets: []
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    init = () => {
        const withInternal = false;

        const {
            btcData,
            ghostData,
            nextData,
            btcMultisigSMSData,
            btcMultisigUserData,
            btcMultisigPinData,
            ethData,
            bnbData,
            maticData,
            arbethData,
            tokensData,
            metamaskData,
            // Sweep
            btcMnemonicData,
            ethMnemonicData,
            bnbMnemonicData,
            maticMnemonicData,
            arbethMnemonicData } = this.props.user;

        const metamaskConnected = metamask.isConnected()

        const tokenWallets = Object.keys(tokensData).map((k) => {
            const { coin, blockchain } = getCoinInfo(k)
            if (metamaskConnected) {
                return (
                    coin && blockchain !== `` &&
                    (metamaskData?.networkVersion === config.evmNetworks[blockchain].networkVersion) ?
                        tokensData[k] : false
                )
            }
            return (coin && blockchain !== ``) ? tokensData[k] : false
        }).filter((d) => d !== false)

        // if enabledCurrencies equals FALSE then all currencies is enabled
        //const enabledCurrencies = config.opts.curEnabled
        const enabledCurrencies = false;
        console.log('wallet data', metamaskData);

        const allData = [
            ...(
                !enabledCurrencies ||
                enabledCurrencies.eth ||
                enabledCurrencies.bnb ||
                enabledCurrencies.matic ||
                enabledCurrencies.arbeth
                    ? metamaskData
                    ? [metamaskData]
                    : []
                    : []
            ),
            // Sweep ===============================
            ...(!enabledCurrencies || enabledCurrencies.btc
                ? btcMnemonicData && !btcData.isMnemonic
                    ? [btcMnemonicData]
                    : []
                : []),
            // Sweep ===============================
            ...(!enabledCurrencies || enabledCurrencies.eth
                ? ethMnemonicData && !ethData.isMnemonic
                    ? [ethMnemonicData]
                    : []
                : []),
            // Sweep ===============================
            ...(!enabledCurrencies || enabledCurrencies.bnb
                ? bnbMnemonicData && !bnbData.isMnemonic
                    ? [bnbMnemonicData]
                    : []
                : []),
            // Sweep ===============================
            ...(!enabledCurrencies || enabledCurrencies.matic
                ? maticMnemonicData && !maticData.isMnemonic
                    ? [maticMnemonicData]
                    : []
                : []),
            // Sweep ===============================
            ...(!enabledCurrencies || enabledCurrencies.arbeth
                ? arbethMnemonicData && !arbethData.isMnemonic
                    ? [maticMnemonicData]
                    : []
                : []),
            // =====================================
            ...(!enabledCurrencies || enabledCurrencies.btc
                    ? [btcData, btcMultisigSMSData, btcMultisigUserData]
                    : []
            ),
            ...(!enabledCurrencies || enabledCurrencies.btc
                ? btcMultisigPinData && btcMultisigPinData.isRegistered
                    ? [btcMultisigPinData]
                    : []
                : []),
            // =====================================
            ...(!enabledCurrencies || enabledCurrencies.btc
                ? btcMultisigUserData && btcMultisigUserData.wallets
                    ? btcMultisigUserData.wallets
                    : []
                : []),
            // =====================================
            ...(!enabledCurrencies || enabledCurrencies.eth
                ? metamaskConnected
                    ? withInternal
                        ? [ethData]
                        : []
                    : [ethData]
                : []),
            // =====================================
            ...(!enabledCurrencies || enabledCurrencies.bnb
                ? metamaskConnected
                    ? withInternal
                        ? [bnbData]
                        : []
                    : [bnbData]
                : []),
            // =====================================
            ...(!enabledCurrencies || enabledCurrencies.matic
                ? metamaskConnected
                    ? withInternal
                        ? [maticData]
                        : []
                    : [maticData]
                : []),
            // =====================================
            ...(!enabledCurrencies || enabledCurrencies.arbeth
                ? metamaskConnected
                    ? withInternal
                        ? [arbethData]
                        : []
                    : [arbethData]
                : []),
            // =====================================
            ...(!enabledCurrencies || enabledCurrencies.ghost ? [ghostData] : []),
            ...(!enabledCurrencies || enabledCurrencies.next ? [nextData] : []),
            ...tokenWallets,
        ].map(({ account, keyPair, ...data }) => ({
            ...data,
        }))

        const userWallets = allData.filter((item) => item?.address && item?.currency)
        console.log('userWallet', userWallets);

        if(this.mounted){
            this.setState({
                userWallets
            });
        } else {
            this.state.userWallets = userWallets;
        }
    }

    render() {
        const { userWallets } = this.state;
        return (
            <div className="App">
                Wallet Details
                <CurrenciesList
                    data={userWallets}
                    goToCreateWallet={this.goToCreateWallet}
                    />
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    user : state.user
})

export default connect(mapStateToProps, null)(Wallet);
