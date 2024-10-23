import { View, StyleSheet,Text, TouchableOpacity } from 'react-native';
import React,{useEffect,useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function SpecificHeader(props) {

   const userEmail = props.mail;
   const [users, setUsers] = useState([]);
   const navigation = useNavigation();

   useEffect(() => {
    const fetchUsername = async () => {
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

    if (userEmail) {
      fetchUsername();
    }
  }, [userEmail]);

  return (
    <View style={styles.HeadContainer}>
    <View style={styles.HeaderName}>
    <TouchableOpacity onPress={()=>{navigation.navigate('Home');}}>
      <Feather name = "arrow-left" color = "#fff" size={28}/>
    </TouchableOpacity>
         { users.length > 0 && users[0].username ? (
              <Text style={styles.HeaderText}>{users[0].username }</Text>
            ) : (
              <Text style={styles.HeaderText}>Anonymous</Text>
            )}
    </View>
        <Feather name = "more-vertical" color = "#fff" size={25} />
    </View>
  );
}

const styles = StyleSheet.create({
    HeadContainer:{
        flexDirection:'row',
        paddingHorizontal:20,
        paddingTop:10,
        justifyContent:'space-between',
        backgroundColor:'black',
        paddingBottom:10,
    },
    HeaderText:{
        justifyContent:'center',
        paddingLeft:30,
        fontSize:21,
        fontWeight:'500',
        color:'#fff',
    },
    HeaderName:{
        flexDirection:'row',
    },
});
