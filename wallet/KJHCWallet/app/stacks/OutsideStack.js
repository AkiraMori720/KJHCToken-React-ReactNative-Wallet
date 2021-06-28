import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeContext } from '../theme';
import {
	outsideHeader, themedHeader, StackAnimation, ModalAnimation, defaultHeader,
} from '../utils/navigation';

import * as HeaderButton from '../containers/HeaderButton';
import {themes} from '../constants/colors';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Sidebar from '../views/SidebarView';
import SelectActiveWalletBtc from '../views/btc/SelectActiveWalletBtc';

const stack = createStackNavigator();
const BtcStack = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<stack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...ModalAnimation }}>
			<stack.Screen
				name='SelectActiveWallet'
				component={SelectActiveWalletBtc}
				options={({navigation}) => ({
					title: 'Select Active Wallet',
					headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='rooms-list-view-sidebar' />,
				})}
			/>
		</stack.Navigator>
	);
};

const EthStack = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<stack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...ModalAnimation }}>
			<stack.Screen
				name='SelectActiveWallet'
				component={SelectActiveWalletBtc}
				options={({navigation}) => ({
					title: 'Select Active Wallet',
					headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='rooms-list-view-sidebar' />,
				})}
			/>
		</stack.Navigator>
	);
};


// Outside
const Btc = createDrawerNavigator();
const BtcDraw = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Btc.Navigator
			drawerContent={({ navigation, state }) => <Sidebar navigation={navigation} state={state} tab={'btc'} />}
			screenOptions={{ headerShown: false }}
			drawerType='back'>
			<Btc.Screen
				name='BtcStack'
				component={BtcStack}
			/>
		</Btc.Navigator>
	);
};


const Eth = createDrawerNavigator();
const EthDraw = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Eth.Navigator
			drawerContent={({ navigation, state }) => <Sidebar navigation={navigation} state={state} tab={'eth'}/>}
			screenOptions={{ headerShown: false }}
			drawerType='back'>
			<Eth.Screen
				name='EthStack'
				component={EthStack}
			/>
		</Eth.Navigator>
	);
};

// OutsideStackModal
const Tab = createBottomTabNavigator();
const TabNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Tab.Navigator
			initialRouteName="RoomsListStack"
			resetOnBlur={true}
			tabBarOptions={{
				activeTintColor: themes[theme].activeTintColor,
				inactiveTintColor: themes[theme].inactiveTintColor,
			}}
		>
			<Tab.Screen
				name="Btc"
				component={BtcDraw}
				navigationOptions = {{
					tabBarIcon: <Text>₿</Text>,
					title: 'Bitcoin'}}
				/>
			<Tab.Screen
				name="Eth"
				component={EthDraw}
				navigationOptions = {{
					tabBarIcon: <Text>Ξ</Text>,
					title: 'Ethereum'}}
			/>
		</Tab.Navigator>
	);
};

export default TabNavigator;
