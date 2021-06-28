import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import styles from './styles';
import SidebarItem from './SidebarItem';
import {VectorIcon} from '../../presentation/VectorIcon';

class SidebarView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menus: {
                btc: {
                    title: 'BTC',
                    items:
                        [
                            {
                                id: 'select-active-wallet',
                                name: 'Active Wallet',
                                icon: 'wallet-outline',
                                view: 'SelectActiveWalletStack',
                            },
                        ],
                },
                eth: {
                    title: 'ETH',
                    items:
                        [
                            {
                                id: 'select-active-wallet',
                                name: 'Active Wallet',
                                icon: 'wallet-outline',
                                view: 'SelectActiveWalletStack',
                            },
                        ],
                },
            },
        };
    }

    onClick = (item) => {
        if (item.view) {
            const {navigation} = this.props;
            navigation.navigate(item.view);
        }
    };

    render() {
        const {tab} = this.props;
        const {menus} = this.state;

        return (
            <SafeAreaView testID="sidebar-view" style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{menus[tab].title}</Text>
                </View>
                {
                    menus[tab].items.map(m => (
                        <SidebarItem
                            id={`sidebar-view-key-${m.id}`}
                            text={m.name}
                            left={(
                                <VectorIcon
                                    name={m.icon}
                                    type="MaterialCommunityIcons"
                                    color={'#FFFFFF'}
                                    size={20}
                                />
                            )}
                            onPress={() => this.onClick(m)}
                            current={false}
                        />
                    ))
                }
            </SafeAreaView>
        );
    }
}

export default SidebarView;
