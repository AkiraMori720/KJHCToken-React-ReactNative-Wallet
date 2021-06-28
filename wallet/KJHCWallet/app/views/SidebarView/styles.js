import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#34599d'
    },
    header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#34599d'
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemCurrent: {
        backgroundColor: '#5c78a7'
    },
    itemLeft: {
        marginHorizontal: 10,
        width: 30,
        alignItems: 'center'
    },
    itemCenter: {
        flex: 1
    },
    itemText: {
        marginVertical: 16,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
})
