import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';


export default function Settings() {
  // const navigation = useNavigation();
    const handleLogOut = async () => {
        try {
            await auth().signOut();
            console.log('User signed out!');
            await AsyncStorage.removeItem('@user_token');
        } catch (error) {
            console.error('Sign out error:', error.message);
        }
    };

    const handleAddAccount = async() =>{
        handleLogOut();
        //navigation.navigate('Emailentery');
    };
  return (
    <View style={styles.container}>
    <View style={styles.horizantal}/>
      <View style={styles.LoginContainer}>
        <Text style={styles.LoginText}>Login</Text>
        <TouchableOpacity onPress={handleAddAccount} style={styles.AddAccount}>
            <Text style={styles.AddAccountText}>Add account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogOut} style={styles.AddAccount}>
            <Text style={styles.LogoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'black',
    justifyContent:'flex-end',
  },
  LoginContainer:{
    marginLeft:40,
    marginBottom:50,
    paddingTop:20,
  },
  LoginText:{
    color:'#797d7f',
    fontSize:16,
  },
  AddAccount:{
    marginTop:20,
  },
  AddAccountText:{
    color:'#2874a6',
    fontSize:16,
  },
  LogoutText:{
    color:'#cb4335',
    fontSize:16,
  },
  horizantal:{
      borderWidth:1,
      borderColor:'#424949',
  },
});
