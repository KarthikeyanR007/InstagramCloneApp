import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import * as Progress from 'react-native-progress';
import { useSelector } from 'react-redux';
import Video from 'react-native-video'; // Importing react-native-video

const logo = require('../../assets/defImg.jpg');

const AddStory = () => {
  const userEmail = useSelector((state) => state.user.user);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userImg, setUserImg] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userNameQuerySnapshot = await firestore()
          .collection('user')
          .where('userEmail', '==', userEmail)
          .get();

        if (userNameQuerySnapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        const userData = userNameQuerySnapshot.docs[0].data();
        setUserName(userData.username);
        setUserImg(userData.profileImg);
      } catch (e) {
        console.error('Error fetching users:', e);
      }
    };

    fetchUserData();
  }, [userEmail]);

  const openGallery = () => {
    const options = {
      mediaType: 'mixed', // Allows both images and videos
      selectionLimit: 0,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri, type: response.assets[0].type }; // Ensure type is included
        setSelectedMedia(source);
        console.log('Selected Media:', source); // Debug log
      } else {
        console.log('No media selected');
      }
    });
  };

  const uploadMedia = async () => {
    if (!selectedMedia) {
      console.log('No media selected');
      return;
    }

    const uploadUri = selectedMedia.uri;
    const fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    try {
      const task = storage().ref(fileName).putFile(uploadUri);

      task.on('state_changed', (taskSnapshot) => {
        const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log(`Upload is ${progress}% done`);
      });

      await task;

      const downloadURL = await storage().ref(fileName).getDownloadURL();
      console.log('Media uploaded to Firebase Storage:', downloadURL);

      // Save download URL to Firestore under user's email sub-collection
      await firestore()
        .collection('StoryContainer')
        .doc(userEmail)
        .collection('userStory')
        .add({
          caption,
          mediaUrl: downloadURL,
          mediaType: selectedMedia.type, // Save media type
          createdAt: firestore.FieldValue.serverTimestamp(),
          userName: userName || 'Unknown',
          userImage: userImg || logo,
          userEmail: userEmail,
        });

      console.log('Story added to Firestore');

      // Reset state or navigate
      setSelectedMedia(null);
      setCaption('');
      setUploadProgress(0);
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Upload error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHead}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.nextBtn1}>
          <AntDesign name="close" size={25} color="#ffff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.newPostBtn}>Add to Story</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openGallery} style={styles.netBtnTouch}>
          <Text style={styles.nextBtn}>Add</Text>
        </TouchableOpacity>
      </View>
      {selectedMedia ? (
        selectedMedia.type && selectedMedia.type.startsWith('video/') ? (
          <Video
            source={{ uri: selectedMedia.uri }}
            style={styles.video}
            controls={true} // Show controls
            resizeMode="contain" // Adjust as necessary
            onError={(e) => console.log('Video Error:', e)} // Handle errors
          />
        ) : (
          <Image source={selectedMedia} style={styles.image} />
        )
      ) : (
        <Text style={styles.NoSelected}>No Media Selected</Text>
      )}
      <View style={styles.captionContainer}>
        {uploadProgress > 0 && (
          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={uploadProgress / 100}
              width={300}
              color="#ffff"
              borderWidth={1}
              borderColor="#2874a6"
              height={10}
              style={styles.progressBar}
              unfilledColor="#555"
            />
          </View>
        )}
        <TextInput
          placeholder="Write a caption"
          placeholderTextColor="#a6acaf"
          style={styles.txtInput}
          value={caption}
          onChangeText={setCaption}
        />
        <TouchableOpacity onPress={uploadMedia} style={styles.nextbtmbtn}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddStory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '50%',
  },
  video: {
    width: '100%',
    height: 300, // Adjust height as needed
  },
  topHead: {
    width: '100%',
    height: 40,
    paddingTop:7,
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
  nextBtn: {
    color: '#2874a6',
    fontSize: 17,
    paddingRight: 20,
  },
  newPostBtn: {
    fontSize: 20,
    color: 'white',
   // marginHorizontal: 15,
    fontWeight: 'bold',
  },
  btns: {
    flexDirection: 'row',
    justifyContent:'space-evenly',
  },
  nextBtn1: {
    marginHorizontal: 15,
  },
  netBtnTouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionContainer: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
  },
  txtInput: {
    paddingLeft: 20,
  },
  nextbtmbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  progressContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  NoSelected:{
    color:'black',
  },
});
