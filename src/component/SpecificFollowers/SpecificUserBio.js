import { View, Text, StyleSheet } from 'react-native';
import React,{useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

export default function SpecificUserBio(props) {
    const userEmail = props.mail;
    const [users, setUsers] = useState([]);

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

        fetchUsername();
    }, [userEmail]);


  return (
    <View style={styles.AboutContainer}>
      {
          users.length > 0 && users[0].username ? (
              <Text style={styles.AboutText}>{users[0].about }</Text>
            ) : (
              <Text>Anonymous</Text>
            )
      }
    </View>
  );
}

const styles = StyleSheet.create({
   AboutText:{
    paddingLeft:20,
    paddingTop:20,
    fontSize:17,
   },
   AboutContainer:{
    paddingBottom:20,
   },
});
