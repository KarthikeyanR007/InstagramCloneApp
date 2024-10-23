/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const logo = require('../../assets/defImg.jpg');

const SpecificUserSinglePost = ({ route }) => {
  const { userEmail } = route.params;
  const [posts, setPosts] = useState([]);
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

    fetchUsername();
  }, [userEmail]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .doc(userEmail)
      .collection('userPosts')
      .onSnapshot((snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
      }, (error) => {
        console.error('Error fetching user posts:', error);
      });

    return () => unsubscribe();
  }, [userEmail]);

  const SinglePost = ({ data }) => {
  const isLiked = data.likes && data.likes.includes(userEmail);
  const likeCount = Array.isArray(data.likes) ? data.likes.length : 0;

  const likeMedia = async (userIdToCompare) => {
    try {
        // Query the userPosts collection group
        const querySnapshot = await firestore()
        .collectionGroup('userPosts')
        .get();

        // Iterate through the documents in the snapshot
        querySnapshot.forEach(async (doc) => {
        // Access the document data
        const data = doc.data();
        const docId = doc.id; // Get the document ID

        // Compare the document ID with the user ID
        if (docId === userIdToCompare) {
            console.log('Match found:', data);
            await doc.ref.update({
            likes: firestore.FieldValue.arrayUnion(userEmail),
            });
        }
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
  };

  const unLikeMedia = async(userIdToCompare) => {
  try {
    // Query the userPosts collection group
    const querySnapshot = await firestore()
      .collectionGroup('userPosts')
      .get();

    // Iterate through the documents in the snapshot
    querySnapshot.forEach(async (doc) => {
      // Access the document data
      const data = doc.data();
      const docId = doc.id; // Get the document ID

      // Compare the document ID with the user ID
      if (docId === userIdToCompare) {
        console.log('Match found:', data);
        await doc.ref.update({
          likes: firestore.FieldValue.arrayRemove(userEmail),
        });
      }
    });
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};
    return (
      <View style={styles.postContainer}>
        {users.map(user => (
          <View key={user.id}>
            <View style={styles.Topheader}>
              <Image
                style={styles.topImage}
                source={user.profileImg ? { uri: user.profileImg } : logo}
              />
              <View style={styles.TopHeaderNameBox}>
                <Text style={styles.TopuserName}>{user.username || 'Unknown'}</Text>
              </View>
              <View style={styles.TopHeaderNameBoxIcon}>
                <MaterialIcons name="more-vert" size={24} color="#fff" />
              </View>
            </View>
            {data.mediaType.startsWith('video/') ? (
              <Video
                source={{ uri: data.mediaUrl }}
                style={styles.imagePlaceholder}
                controls
                resizeMode="cover"
              />
            ) : (
              <Image
                source={{ uri: data.mediaUrl || logo }}
                style={styles.imagePlaceholder}
              />
            )}
            <View style={styles.actions}>
              <TouchableOpacity onPress={()=>{isLiked ? unLikeMedia(data.id) : likeMedia(data.id);}}>
                 <FontAwesome
                    name={isLiked ? 'heart' : 'heart-o'} // Use filled heart if liked
                    size={24}
                    color={isLiked ? 'red' : 'white'} // Change color based on like status
                  />
              </TouchableOpacity>
              <TouchableOpacity style={styles.likeIcons}>
                <Ionicons name="chatbubble-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.likeIcons}>
                <Ionicons name="paper-plane-outline" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.rightAction}>
                <TouchableOpacity>
                  <FontAwesome name="bookmark-o" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.likeText}>{likeCount || 0} likes</Text>
            <View style={styles.captionContainer}>
              <Text style={styles.caption}>
                <Text style={styles.boldText}>{user.username || 'Unknown'}</Text>
                {data.caption}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.username}>Posts</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {posts.length === 0 ? (
        <Text style={styles.noPost}>No posts available</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <SinglePost data={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 50,
    color: '#fff',
  },
  postContainer: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 300,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rightAction: {
    marginLeft: 'auto',
  },
  likeText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  captionContainer: {
    marginBottom: 10,
  },
  caption: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  noPost: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  likeIcons: {
    marginLeft: 15,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  Topheader: {
    flexDirection: 'row',
  },
  TopuserName: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffff',
  },
  TopHeaderNameBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopHeaderNameBoxIcon: {
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    alignItems: 'center',
    top: 20,
  },
  topImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
    margin: 10,
    borderColor: '#797d7f',
    borderWidth: 1,
  },
});

export default SpecificUserSinglePost;
