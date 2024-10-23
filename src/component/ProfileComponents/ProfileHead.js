import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
export default function ProfileHead() {
  const userEmail = useSelector((state) => state.user.user);
  const userName = useSelector((state)=>state.userName.username);
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // This effect will run whenever `userName` changes
    console.log('Username updated:', userName);
  }, [userName]);

  useEffect(() => {
    const fetchUsername = async () => {
      console.log('username...' + userEmail);
      console.log('userEmail', '==', userEmail);
      try {
        const userNameQuerySnapshot = await firestore()
          .collection('user')
          .where('userEmail', '==', userEmail)
          .get();

        if (userNameQuerySnapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        const usersList = userNameQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (e) {
        console.error('Error fetching users:', e);
      }
    };

    fetchUsername();
  }, [userEmail]);

  useEffect(() => {
    if (users.length > 0) {
      console.log('users.....', users);
    }
  }, [users]);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.userName}>{ (userName) || (users[0]?.username ?  users[0].username : 'User')}</Text>
      <View style={styles.userManu}>
        <TouchableOpacity onPress={()=>navigation.navigate('PostAdd')}>
            <FontAwesome name="plus-square-o" color={'#fff'} size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Settings')}>
            <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    headerContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'black',
        height:50,
        alignItems:'center',
    },
    userName:{
        fontSize:20,
        fontWeight:'bold',
        color:'#fff',
        paddingLeft:20,
    },
    userManu:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        width:'35%',
    },
});
