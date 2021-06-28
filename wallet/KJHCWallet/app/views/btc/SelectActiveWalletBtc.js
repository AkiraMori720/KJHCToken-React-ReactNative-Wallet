import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Alert, FlatList, Text, TouchableOpacity, View} from 'react-native';
import {deleteWalletAction, selectActiveWalletAction} from '../../actions/btc';

// import SelectActiveWallet from '../screens/SelectActiveWallet';
// import {networkOptions} from '../../lib/btcService';

const styles = StyleSheet.create({
    walletName: {
        fontSize: 16,
        paddingVertical: 12,
    },
});

const mapStateToProps = (state) => ({
    wallets: selectWallets(state),
});

const mapDispatchToProps = {
    selectActiveWallet: selectActiveWalletAction,
    deleteWallet: deleteWalletAction,
};

class SelectActiveWalletContainer extends React.Component {
    static propTypes = {
        wallets: PropTypes.array.isRequired,
        deleteWallet: PropTypes.func.isRequired,
        selectActiveWallet: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
    }

    handleDelete = (walletId) => {
        Alert.alert(
            'Do you really want to delete this wallet?',
            'Make sure you have a mnemonic or a backup of this wallet.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => this.props.deleteWallet(walletId), style: 'destructive' },
            ]
        );
    };

    keyExtractor = ({ walletId }) => walletId;

    renderItem = ({ item: { walletId, walletName } }) => (
        <TouchableOpacity
            onPress={() => this.props.selectActiveWallet(walletId)}
            onLongPress={() => this.handleDelete(walletId)}
        >
            <Text style={styles.walletName}>{walletName}</Text>
        </TouchableOpacity>
    );

    render() {
        const { wallets } = this.props;
        const { network } = this.state;

        const filteredWallets = wallets.filter((w) => w.network === network);

        return (
            <View>
                {/*<Radio*/}
                {/*    options={networkOptions}*/}
                {/*    value={network}*/}
                {/*    onChange={(network) => this.setState({ network })}*/}
                {/*/>*/}

                {filteredWallets.length > 0 ? (
                    <FlatList
                        data={filteredWallets}
                        extraData={network}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                ) : (
                    <View>
                        <Text>No wallets</Text>
                    </View>
                )}
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectActiveWalletContainer);
