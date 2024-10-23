/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';

export default function PasswordScreen({ navigation }) {

    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const handlePassword = async() => {
        if(!password){
            setError('Password is required.');
        }
        else{
            navigation.navigate('NameScreen', {userPassword : password});
        }
    };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{paddingTop:30}}>
        <Text style={styles.topText}>Create a Password</Text>
        <Text style={styles.secondText}>Cteate a password with at least 6 letters or numbers. It should be something that others can't guess.</Text>
          <View style={styles.InputBoxes}>
              <TextInput
                style={styles.userInput}
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                <Text style={{fontSize:20}}>{isPasswordVisible ? <Entypo name="eye" size={24} color="#fff" /> : <Entypo name="eye-with-line" size={24} color="#fff" />}</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
          </View>

      </View>
      <View style={{justifyContent:'center',alignItems:'center',marginTop:30}}>
          <TouchableOpacity onPress={handlePassword} style={styles.login}>
            <Text style={{fontSize:15,fontWeight:'bold'}}>Next</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.signUp}>
        <Text>
                <TouchableOpacity onPress={() => { navigation.navigate("LoginScreen") }}>
                    <Text style={{color:'#2e86c1',textAlignVertical:'center'}}>I already have an account?</Text>
                </TouchableOpacity>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInput:{
    height:50,
    width:'90%',
    borderRadius:4,
    borderWidth:2,
    borderColor:'#424949',
    backgroundColor:'#212f3d',
    marginTop:30,
    paddingLeft: 15,
  },
  mainContainer:{
    flex:1,
    backgroundColor:'black',
  },
  InputBoxes:{
    justifyContent:'center',
    alignItems:'center',
  },
  forgotpassword:{
    position:'absolute',
    right:20,
    top:'110%',
  },
  horizontalLine:{
    width:'100%',
    height:2,
    backgroundColor: '#212f3d',
    marginTop:50,
  },
  signUp:{
    justifyContent:'flex-end',
    alignItems:'center',
    textAlignVertical:'center',
    alignContent:'flex-end',
    position:'absolute',
    bottom:'5%',
    left:'26%',
  },
  login:{
    height:40,
    width:'90%',
    backgroundColor:'#2e86c1',
    marginTop:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:15,
  },
  input: {
    flex: 1,
    height:50,
    width:'90%',
    borderRadius:4,
    borderWidth:2,
    borderColor:'#424949',
    backgroundColor:'#212f3d',
  },
  icon: {
    paddingLeft: 10,
    position:'absolute',
    top:'55%',
    right:'20%',
  },
  error:{
    color:'red',
    position:'absolute',
    left:20,
    top:'100%',
  },
  topText:{
    fontSize:26,
    fontWeight:'bold',
  },
  secondText:{
    fontSize:17,
    marginTop:10,
    lineHeight:25,
  },
});
