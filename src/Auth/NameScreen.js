import { View, Text, SafeAreaView, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, {useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../../AuthContext';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import auth from '@react-native-firebase/auth';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
export default function NameScreen({ navigation,route }) {
    const { userPassword } = route.params;
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [fullname, setFullname] = useState('');
    // const { setUsers } = useAuth();
    //const dispatch = useDispatch();
    const userEmail = useSelector((state) => state.user.user);

    const handleEmail = async() => {
        if(!userEmail && !userPassword && !fullname){
            setError('Username  is required.');
        }else{
            try {
                const userCredential = await auth().createUserWithEmailAndPassword(userEmail, userPassword);
                const user = userCredential.user;
                console.log('User signed in!', user);
                await AsyncStorage.setItem('@user_token', user.uid);
                const cr = firestore().collection('user').add({
                    userEmail,
                   'username':fullname,
                });
                if(cr){
                    console.log('pass');
                }else{
                    console.log('fail');
                }
            //dispatch(setUser(user.email));
            //console.log(setUser);
            } catch (error) {
                console.log(error);
                if (error.code === 'auth/email-already-in-use') {
                setError('The email address is already in use by another account.');
                } else {
                    setError('An error occurred. Please try again.');
                }
            }
        }
        //dispatch(setUser(email));
    };


  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <Text style={styles.topText}>What's your name?</Text>

          <View style={styles.InputBoxes}>
              <TextInput
                style={styles.userInput}
                placeholder="Full name"
                value={fullname}
                onChangeText={setFullname}
            />
          </View>

      </View>
        {/* {error && <Text style={styles.error}>{error}</Text>} */}
      <View style={{justifyContent:'center',alignItems:'center',marginTop:30}}>
          <TouchableOpacity onPress={handleEmail} style={styles.login}>
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
    // alignItems:'center',
    //justifyContent:'center',
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
      //marginTop:30,
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
