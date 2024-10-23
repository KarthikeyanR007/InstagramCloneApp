import { View,Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
//const logo = require('../assets/homeLogo.png');
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';

const logo = require('../assets/insta.png');
export default function Header() {
    const navigation = useNavigation();
  return (
       <View style={styles.topHeader}>
           <Image
               source={logo}
               style={styles.topImage}
            />
            <View style={styles.topManu}>
                <TouchableOpacity>
                    <AntDesign name="hearto" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('Message')}>
                    <Fontisto name="messenger" size={23} color="#fff" />
                </TouchableOpacity>
            </View>
       </View>
  );
}

const styles = StyleSheet.create({
    topHeader:{
        height:50,
        width:'100%',
        // borderWidth:2,
        // borderColor:'blue',
        flexDirection:'row',
        backgroundColor:'black',
        justifyContent:'space-between',
        alignItems:'center',
    },
    topImage:{
      height: '100%',
      width: '30%',
      resizeMode: 'contain',
      paddingLeft:10,
    },
    topManu:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        width:'35%',
    },
});
