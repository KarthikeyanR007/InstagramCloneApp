import { View, Text, SafeAreaView, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../../AuthContext';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../redux/userSlice';
import auth from '@react-native-firebase/auth';
const logo = require('../assets/insta.png');

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    // const { setUsers } = useAuth();
    // const dispatch = useDispatch();


    const onHandleSignUp = async() => {
        if(!email && !password ){
            setError('Please Enter Email and Password');
        }else{
            try {
                const userCredential = await auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                console.log('User signed in!', user);
                await AsyncStorage.setItem('@user_token', user.uid);
               // setUsers(userCredential.user);
                // const cr = firestore().collection('user').add({
                //    email,
                //    'username':username,

                // });
                // if(cr){
                //     console.log('pass');
                // }else{
                //     console.log('fail');
                // }
            //dispatch(setUser(user.email));
            //console.log(setUser);
            } catch (error) {
                console.error(error.message);
            }
        }
    };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <Image
          source={logo}
          style={{height: 70, width: '100%',resizeMode: 'contain'}}
          />
          <View style={styles.InputBoxes}>
            <TextInput
              style={styles.userInput}
              placeholder="email"
              placeholderTextColor="#909497"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.userInput}
              placeholder="password"
              placeholderTextColor="#909497"
              secureTextEntry={true}
              textContentType="password"
               value={password}
              onChangeText={(text) => setPassword(text)}
            />

          </View>

      </View>
        {error && <Text style={styles.error}>{error}</Text>}
      <View style={{justifyContent:'center',alignItems:'center',marginTop:30}}>
          <TouchableOpacity onPress={onHandleSignUp} style={styles.login}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.signUp}>
        <Text>
            Do you have an account?
                <TouchableOpacity onPress={() => { navigation.navigate("LoginScreen") }}>
                    <Text style={{color:'blue',textAlignVertical:'center'}}>Log In</Text>
                </TouchableOpacity>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInput:{
    height:40,
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
    // alignItems:'center',
    justifyContent:'center',
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
    marginTop:40,
    justifyContent:'center',
    alignItems:'center',
    textAlignVertical:'center',
  },
  login:{
    height:40,
    width:'90%',
    backgroundColor:'#2e86c1',
    marginTop:10,
    justifyContent:'center',
    alignItems:'center',
  },
  error:{
    color:'red',
    alignItems:'center',
    marginLeft:'20%',
    marginTop:25,
  },
});
