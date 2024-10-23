/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, TouchableOpacity, Text, FlatList, StyleSheet, Image, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import { Vibration } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useSelector } from 'react-redux';
import { launchCamera } from 'react-native-image-picker';

const Message = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [matchedDocs, setMatchedDocs] = useState([]);
  const [docIdToUse, setDocIdToUse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.IconContainer}>
          <TouchableOpacity>
            <Icon name="edit" size={24} color="white" style={styles.IconText} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (users.length > 0) {
      console.log('Fetching user data...');
      fetchUserData();
    }
  }, [users]); // Keep this as is, but ensure fetchUserData doesn't cause re-renders

  const fetchUsers = async () => {
    try {
      const docRef = firestore().collection('MyChatMembers').doc(user);
      const snapshot = await docRef.get();

      if (!snapshot.exists) {
        console.log('No matching documents.');
        return;
      }

      const data = snapshot.data();
      if (data && Array.isArray(data.members)) {
        const usersList = data.members.map(member => ({ id: member, username: member }));
        setUsers(usersList);
        console.log(usersList);
      } else {
        console.log('No members found.');
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

   const removeUserByEmail = async (emailToRemove) => {
    try {
      const docRef = firestore().collection('MyChatMembers').doc(user);

      // Update Firestore to remove the email
      await docRef.update({
        members: firestore.FieldValue.arrayRemove(emailToRemove),
      });

      // Update local state
      setUsers((prevUsers) => prevUsers.filter(email => email !== emailToRemove));
    } catch (e) {
      console.error('Error removing user:', e);
      Alert.alert('Error', 'Could not remove user');
    }
  };

  const fetchUserData = async () => {
    try {
      const userIds = users.map(user => user.id);
      if (userIds.length === 0) {
        console.log('No users to fetch.');
        return;
      }

      const usersSnapshot = await firestore()
        .collection('user')
        .where('userEmail', 'in', userIds)
        .get();

      if (usersSnapshot.empty) {
        console.log('No matching users found.');
        return;
      }

      const fetchedUserData = [];
      usersSnapshot.forEach(doc => {
        fetchedUserData.push({ id: doc.id, ...doc.data() });
      });

      setChatUsers(fetchedUserData);
      console.log(fetchedUserData);
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

  const handlePrtChat = (id, username) => {
    navigation.navigate('PrtChat', { ChatId: id, userName: username });
  };

const MyModal = ({ visible, onClose, name, userImg, userMail }) => {

  return(
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text  style={styles.userNameText} >{name}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Pin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={()=>removeUserByEmail(userMail)}>
            <Text style={styles.modalButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Item = React.memo((props) => {
  const [userData, setUserData] = useState(null);
  const [matchedDocs, setMatchedDocs] = useState([]);
  const [docIdToUse, setDocIdToUse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    if (props.Email) {
      const docId1 = `${user}_${props.Email}`;
      const docId2 = `${props.Email}_${user}`;

      const fetchDocuments = async () => {
        try {
          const snapshot = await firestore().collection('prtChats').get();
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const matched = docs.filter(doc => doc.id === docId1 || doc.id === docId2);
          setMatchedDocs(matched);

          const foundDocId = matched.find(item => item.id === docId1 || item.id === docId2)?.id;
          setDocIdToUse(foundDocId);
          console.log('foundDocId', foundDocId);
        } catch (error) {
          console.error('Error fetching documents: ', error);
        }
      };
      fetchDocuments();
    }
  }, [props.Email]);

  useLayoutEffect(() => {
    if (docIdToUse) {
      const docRef = firestore().collection('prtChats').doc(docIdToUse);
      const unsubscribe = docRef.onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const newMessages = data.messages || [];
          setMessages(newMessages.reverse());

          // Count how many messages have the status "sent" and are not from the current user
          const sentCount = newMessages.filter(msg => msg.status === 'sent' && msg.user._id !== user).length;
          console.log('Sent Messages Count:', sentCount); // Log or handle the count as needed

        } else {
          console.error('No such document!');
        }
      }, (error) => {
        console.error('Firestore query error:', error);
      });

      return unsubscribe;
    }
  }, [docIdToUse]);


  const handleModal = async() => {
     Vibration.vibrate(50);
     console.log('console check');
     setModalVisible(true);

  };

   const openCamera = () => {
     launchCamera({}, (response) => {
       if (response.didCancel) {
         console.log('User cancelled camera');
       } else if (response.error) {
         console.log('Camera error: ', response.error);
       } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        console.log('Photo: ', uri);
       }
     });
   };

  return (
    <>
      <TouchableOpacity onPress={() => handlePrtChat(props.id, props.name)} style={styles.item} onLongPress={handleModal}>
      <Image source={{ uri: props.userImg ? props.userImg : 'https://via.placeholder.com/150' }} style={styles.UserImg} />
      <Text style={styles.nameText}>{props.name}</Text>
      {(messages.filter(msg => msg.status === 'sent' && msg.user._id !== user).length) > 0 ?
        <TouchableOpacity style={styles.sentCount}>
          <Text style={styles.sentCountText}>
           {messages.filter(msg => msg.status === 'sent' && msg.user._id !== user).length}
          </Text>
         </TouchableOpacity>
          :
         <Text>{''}</Text> }
      <TouchableOpacity onPress={openCamera} style={styles.CameraIconContainer}>
        <Icon name="camera" size={24} color="white" style={styles.ChatIconText} />
      </TouchableOpacity>
    </TouchableOpacity>
    <MyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        name={props.name}
        userImg={props.userImg}
        userMail={props.Email}
      />
    </>
  );
});


  return (
    <Provider>
      <View style={styles.fullContainer}>
        <FlatList
          data={chatUsers} // Change to chatUsers to display fetched user data
          renderItem={({ item }) => <Item Email={item.userEmail} name={item.username} userImg={item.profileImg} id={item.id} />}
          keyExtractor={(item) => item.id}
          style={styles.BodyContainer}
        />
        {/* {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200 }} // Adjust the dimensions as needed
        />
      )} */}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 75,
    width: '100%',
    borderWidth: 0,
    borderTopWidth: 0,
  },
  UserImg: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 2,
    marginRight: 15,
  },
  nameText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
    flex: 1,
    marginLeft: 20,
  },
  CameraIconContainer: {
    paddingRight: 5,
  },
  IconContainer: {
    flexDirection: 'row',
  },
  IconText: {
    marginRight: 25,
  },
  sentCountText: {
    fontSize:17,
    color:'black',
    marginBottom:3,
    fontWeight:'bold',
  },
  sentCount:{
    height:25,
    width:25,
    borderRadius:50,
    backgroundColor:'#fff',
    marginRight:15,
    justifyContent:'center',
    alignItems:'center',
  },
  BodyContainer: {
    backgroundColor: 'black',
  },
   modalBackground: {
    flex: 1,
    width:'100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '98%',
    height:'30%',
    padding: 20,
    backgroundColor: '#424949',
    borderRadius: 15,
  },
  modalButton:{
    paddingTop:15,
  },
  modalButtonText:{
    color:'#fff',
    fontSize:15,
  },
  userNameText:{
    color:'#fff',
  },
});

export default Message;
