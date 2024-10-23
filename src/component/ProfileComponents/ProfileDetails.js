import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector,useDispatch } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import { setUser } from '../../redux/userNameSlice';
const defImg = require('../../assets/defImg.jpg');
export default function ProfileDetails() {
    const userEmail = useSelector((state) => state.user.user);
    const [users, setUsers] = useState([]);
    const [modalVisible,setModalVisible] = useState(false);
    const [usernameModal,setUsernameModal] = useState(false);
    const [aboutModal,setAboutModal] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [username, setUserName] = useState('');
    const [about, setAbout] = useState('');
    const dispatch = useDispatch();
    const StoreUsername = useSelector((state) => state.userName.username);

   const uploadFile = async () => {
    try {
      // Pick a file using Document Picker
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });

      // Set uploading to true
      setUploading(true);

      // Get the file URI and create a reference to Firebase Storage
      const fileUri =
        Platform.OS === 'ios' ? res.uri.replace('file://', '') : res.uri;
      const fileName = res.name;
      const reference = storage().ref(fileName);

      // Upload the file
      const task = reference.putFile(fileUri);

      // Monitor the upload progress
      task.on('state_changed', snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgress(progress);
      });

      // Handle completion
      await task;

      // Get the download URL of the uploaded image
      const url = await reference.getDownloadURL();
      setImageUrl(url);

      // Fetch the user document based on email
      const userQuerySnapshot = await firestore()
        .collection('user')
        .where('userEmail', '==', userEmail)
        .get();

      if (userQuerySnapshot.empty) {
        Alert.alert('Upload Failed', 'No matching user found.');
        return;
      }

      // Update the document for each matching user
      userQuerySnapshot.forEach(async doc => {
        await firestore().collection('user')
          .doc(users[0].id)
          .update({
            profileImg: url,
          });
      });

      Alert.alert('Upload Successful', `File ${fileName} uploaded and URL saved!`);
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

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
      const abt = users[0]?.about ? users[0].about : '';
      setAbout(abt);
      setUserName(StoreUsername);
    }

  }, [users,StoreUsername]);

    const closeModal = () => {
        setModalVisible(false);
    };

    const openModal = () => {
        setModalVisible(true);
    };
    const openUserNameModal = () => {
      setUsernameModal(true);
    };
    const closeuserNameModal = () => {
      setUsernameModal(false);
    };

    const closeAboutModal = () => {
      setAboutModal(false);
    };

    const handleTextInputFocus = () => {
      setUsernameModal(true);
      setUserName(users.length > 0 ? users[0].username : '');
    };

    const handleAboutInputFocus = () => {
      setAboutModal(true);
      setAbout(users.length > 0 ? users[0].about : '');
    };

    const handleName = async () => {
      try {
        const snapshot = await firestore()
          .collection('user')
          .where('userEmail', '==', userEmail) // Ensure `user` is defined and valid
          .get();

        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        const batch = firestore().batch();

        snapshot.forEach((doc) => {
          console.log(`Updating document ID: ${doc.id}`); // Log document ID being updated
          const docRef = firestore().collection('user').doc(doc.id);
          batch.update(docRef, {
            username: username, // Ensure `status` is defined and contains the new value
          });
        });

        await batch.commit();
        console.log('Fields updated successfully!');
        dispatch(setUser(username));
        console.log('Current state after dispatch:', StoreUsername);
      } catch (error) {
        console.error('Error updating fields:', error);
      }
      setUsernameModal(false);
    };

    const handleAbout = async () => {
      try {
        const snapshot = await firestore()
          .collection('user')
          .where('userEmail', '==', userEmail) // Ensure `user` is defined and valid
          .get();

        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        const batch = firestore().batch();

        snapshot.forEach((doc) => {
          console.log(`Updating document ID: ${doc.id}`); // Log document ID being updated
          const docRef = firestore().collection('user').doc(doc.id);
          batch.update(docRef, {
            about: about, // Ensure `status` is defined and contains the new value
          });
        });

        await batch.commit();
        console.log('Fields updated successfully!');
      } catch (error) {
        console.error('Error updating fields:', error);
      }
      setAboutModal(false);
    };

    // const showAlert = (name) => {
    //   Alert.alert(
    //     "Alert Title", // Title of the alert
    //     name, // Alert message
    //     [
    //       {
    //         text: "Cancel", // Button to cancel
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel"
    //       },
    //       { text: "OK", onPress: () => console.log("OK Pressed") } // OK button
    //     ],
    //     { cancelable: false } // Prevents dismissal by tapping outside the alert
    //   );
    // };

  return (
    <>
      <View style={styles.DetailContainer}>
        <Text style={styles.profileAbout}>
          {about}
        </Text>
        <TouchableOpacity onPress={openModal} style={styles.editButton}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
              <View>
                <View style={styles.modelTitle}>
                    <Text style={styles.modelTitleText}>Edit Profile</Text>
                </View>
                <TouchableOpacity onPress={closeModal} style={styles.close}>
                    <Fontisto name="close-a" size={18} color="white" />
                </TouchableOpacity>
              </View>
                {users.map(user => (
                    <View key={user.id}>
                     <View style={styles.DBImg} >
                         {user.profileImg ?
                            <Image
                            style={styles.profileImage}
                            source={{ uri: users[0].profileImg }}
                            />
                            :
                            <Image
                            style={styles.profileImage}
                            source={defImg}
                            />
                            }
                        </View>
                        <TouchableOpacity onPress={uploadFile} style={styles.changeImgText}>
                            <Text style={styles.changeImgTexts}>Change Profile Photo</Text>
                        </TouchableOpacity>
                        <View style={styles.modalDetail} >
                            <TouchableOpacity onPress={openUserNameModal} style={styles.modalName}>
                                <Text style={styles.modalNameDefault}>
                                    username
                                </Text>
                                <TextInput
                                   style={styles.modalNameText}
                                   value={StoreUsername}
                                   onChangeText={(text) => setUserName(text)}
                                   editable={true}
                                   onFocus={handleTextInputFocus}
                                 />
                                  {/* <Text style={styles.modalNameText}>
                                    {user.username}
                                  </Text> */}
                            </TouchableOpacity>
                             {/* <Button title="Show Alert" onPress={()=>showAlert(user.username)} /> */}
                        </View>
                        <View style={styles.modalDetail} >
                            <TouchableOpacity style={styles.modalName}>
                                <Text style={styles.modalNameDefault}>
                                    Bio
                                </Text>
                                <TextInput
                                   style={styles.modalNameText}
                                   value={about}
                                   onChangeText={(text) => setAbout(text)}
                                   editable={true}
                                   onFocus={handleAboutInputFocus}
                                 />
                                {/* <Text style={styles.modalNameText}>
                                    {user.about}
                                </Text> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
              </View>
            </View>
          </Modal>
        </View>
        {/* userName modal */}
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={usernameModal}
            onRequestClose={closeuserNameModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
              <View>
                <View style={styles.modelTitle}>
                    <Text style={styles.modelTitleText}>Name</Text>
                </View>
                <TouchableOpacity onPress={closeuserNameModal} style={styles.userNameclose}>
                    <Fontisto name="close-a" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleName} style={styles.userNameRight}>
                    <Feather name="check" size={28} color="white" />
                </TouchableOpacity>
              </View>
                <View>
                 <TextInput
                    style={styles.userInput}
                    placeholder="Name"
                    placeholderTextColor="#909497"
                    value={username}
                    onChangeText={(text) => setUserName(text)}
                  />
                 </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* About modal */}
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={aboutModal}
            onRequestClose={closeAboutModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
              <View>
                <View style={styles.modelTitle}>
                    <Text style={styles.modelTitleText}>About</Text>
                </View>
                <TouchableOpacity onPress={closeAboutModal} style={styles.userNameclose}>
                    <Fontisto name="close-a" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAbout} style={styles.userNameRight}>
                    <Feather name="check" size={28} color="white" />
                </TouchableOpacity>
              </View>
                <View>
                 <TextInput
                    style={styles.userInput}
                    placeholder="Name"
                    placeholderTextColor="#909497"
                    value={about}
                    onChangeText={(text) => setAbout(text)}
                  />
                 </View>
              </View>
            </View>
          </Modal>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
   DetailContainer: {
    borderWidth:1,
    backgroundColor:'black',
    paddingBottom:10,
    justifyContent:'center',
    alignItems:'center',
   },
   editButton:{
    height:30,
    width:'92%',
    borderWidth:1,
    borderColor:'white',
    backgroundColor:'#0000',
    justifyContent:'center',
    alignItems:'center',
    marginTop:10,
    borderRadius:5,
   },
    modalOverlay: {
      flex: 1,
      justifyContent: 'space-evenly',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width:'100%',
    },
    modalButton:{
      flexDirection:'row',
      justifyContent:'space-evenly',
      marginTop:10,

    },
    modalText:{
    //   marginLeft:20,
    },
    modalView: {
      backgroundColor: 'black',
      borderRadius: 10,
      padding: 35,
      height:'100%',
      width:'100%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modelTitle:{
      justifyContent:'center',
      alignItems:'center',
    },
    modelTitleText:{
       fontSize:20,
       fontWeight:'bold',
       color:'#fff',
    },
    profileImage:{
        height:90,
        width:90,
        borderRadius:50,
        marginBottom:20,
        resizeMode:'cover',
        borderWidth:3,
    },
    profileAbout:{
        color:'#fff',
    },
    DBImg:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:30,
    },
    changeImgText:{
        justifyContent:'center',
        alignItems:'center',
    },
    changeImgTexts:{
        color:'#2e86c1',
    },
    modalName:{
        // height:80,
        borderWidth:1,
        borderColor:'#fff',
        width:'100%',
        marginTop:20,
        borderRadius:10,
        padding:10,
    },
    modalDetail:{
        width:'100%',
    },
    modalNameDefault:{
        fontSize:15,
        color:'#b3b6b7',
        marginBottom:10,
    },
    modalNameText:{
        color:'#fff',
        //height:40,
    },
    close:{
        position:'absolute',
        top:9,
        right:9,
    },
    userNameclose:{
      position:'absolute',
      top:9,
      left:9,
    },
    userNameRight:{
      position:'absolute',
      top:5,
      right:9,
    },
    userInput:{
     height:60,
     width:'100%',
     borderRadius:15,
     borderWidth:2,
     borderColor:'#424949',
     backgroundColor:'black',
     marginTop:30,
     paddingLeft: 15,
    },
});
