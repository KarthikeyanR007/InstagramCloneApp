import { View, Text, SafeAreaView, Image, TextInput, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../AuthContext';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import auth from '@react-native-firebase/auth';
const logo = require('../assets/insta.png');

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] = useState('');
    const { setUsers } = useAuth();
    const dispatch = useDispatch();


    const onHandleLogin = async() => {
      console.log(email,password);
      if(!email && !password){
          setError('Please Enter Email and Password');
      }else{
        try {
                const userCredential = await auth().signInWithEmailAndPassword(email,password);
                const user = userCredential.user;
                console.log('User signed in!', user);
                await AsyncStorage.setItem('@user_token', user.uid);
                setUsers(userCredential.user);
                const cnEmail = convert(user.email);
                dispatch(setUser(cnEmail));
            } catch (error) {
               console.log(error);
                if (error.code === 'auth/email-already-in-use') {
                setError('The email address is already in use by another account.');
                } else {
                setError('Please Enter correct email and password.');
                }
            }
      }
    };

    const convert = (email) => {
      if(email.lenght === 0 || !email)return email;
      return email.charAt(0).toLowerCase() + email.slice(1);
    };

  //    useEffect(() => {
  //     const fetchUsername = async () => {
  //       console.log('username  ' + userEmail);
  //       try {
  //         const userNameQuerySnapshot = await firestore()
  //           .collection('user')
  //           .where('userEmail', '==', userEmail)
  //           .get();

  //         if (userNameQuerySnapshot.empty) {
  //           console.log('No matching documents.');
  //           return;
  //         }

  //         const usersList = userNameQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //         setUsers(usersList);
  //       } catch (e) {
  //         console.error('Error fetching users:', e);
  //       }
  //     };

  //     fetchUsername();
  //   }, [userEmail]);

  // useEffect(() => {
  //   if (users.length > 0) {
  //     console.log('users.....', users);
  //   }
  // }, [users]);

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Please enter your email to reset password.");
            return;
        }
        try {
            await auth().sendPasswordResetEmail(email);
            Alert.alert("Password reset email sent! Check your inbox.");
        } catch (error) {
            console.error(error.message);
            Alert.alert("Error sending password reset email: " + error.message);
        }
    };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{marginTop:'25%'}}>
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
          <View style={{justifyContent:'center',alignItems:'center'}}>
              <TouchableOpacity onPress={onHandleLogin} style={styles.login}>
                <Text>Log In</Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotpassword}>
            <Text style={{ fontSize:18,fontWeight:'bold'}}>Forgot password?</Text>
          </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {/* <View style={{justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={onHandleLogin} style={styles.login}>
            <Text>Log In</Text>
          </TouchableOpacity>
      </View> */}
      {/* <View style={styles.horizontalLine} /> */}
      {/* <TouchableOpacity style={styles.signUp}>
        <Text>Don't hava an account?
          <TouchableOpacity onPress={() => { navigation.navigate('SignUpScreen');}}>
            <Text style={{color:'blue',textAlignVertical:'center',}}>Sign Up</Text>
          </TouchableOpacity>
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={()=>navigation.navigate('Emailentery')} style={styles.newAccount}>
        <Text style={styles.newAccountText}>Create New Account</Text>
      </TouchableOpacity>
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
    //justifyContent:'center',
  },
  InputBoxes:{
    justifyContent:'center',
    alignItems:'center',
  },
  forgotpassword:{
    position:'absolute',
    left:'31%',
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
    marginTop:30,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:15,
  },
  error:{
    color:'red',
    position:'absolute',
    top:'75%',
    left:'15%',
  },
  newAccount:{
    // position:'absolute',
    // top:'85%',
    marginTop:'65%',
    height:40,
    width:'90%',
    borderWidth:1,
    borderColor:'#2874a6',
    marginLeft:20,
    borderRadius:15,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
  },
  newAccountText:{
     alignItems:'center',
     color:'#2874a6',
  },
});
