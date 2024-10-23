import { View, Text, SafeAreaView, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../../AuthContext';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';


export default function Emailentery({ navigation }) {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    // const { setUsers } = useAuth();
    const dispatch = useDispatch();

    const handleEmail = () => {
        if(!email){
            setError('Email address required.');
        }else{
            const cnEmail = convert(email);
            dispatch(setUser(cnEmail));
            console.log(cnEmail);
            navigation.navigate('PasswordScreen');
        }
    };

    const convert = (email) => {
      if(!email || email.length === 0) return email;
      return email.charAt(0).toLowerCase() + email.slice(1);
    };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <Text style={styles.topText}>What's your email address?</Text>
        <Text style={styles.secondText}>Enter the email address at which you can be contacted. No one will see this on your profile </Text>
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
            {error && <Text style={styles.error}>{error}</Text>}
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
    paddingTop:40,
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
