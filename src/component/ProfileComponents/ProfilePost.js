import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const PostGridScreen = () => {
  const [isTaggedView, setIsTaggedView] = useState(false);
  const userEmail = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .doc(userEmail)
      .collection('userPosts')
      .orderBy('createdAt', 'desc') // Ensure you have a 'createdAt' field
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

  return (
    <View style={styles.postContainer}>
      <View style={styles.postIcon}>
        <TouchableOpacity style={styles.touchIcon} onPress={() => setIsTaggedView(false)}>
          <Icon name="grid-on" size={30} color={!isTaggedView ? '#fff' : 'gray'} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="user" size={30} color={isTaggedView ? '#fff' : 'gray'} />
        </TouchableOpacity>
      </View>

      {posts.length === 0 ? (
        <Text style={styles.noPost}>No posts available</Text>
      ) : (
        <FlatList
          data={posts}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postImgTouch}
              onPress={() => {
                navigation.navigate('ProfilePostSingle', { postId: item.id }); // Pass post ID
              }}
            >
              {item.mediaType.startsWith('video/') ? (
                <Video
                  source={{ uri: item.mediaUrl }}
                  style={styles.postImg}
                  resizeMode="cover"
                  paused={true} // Start paused
                />
              ) : (
                <Image
                  source={{ uri: item.mediaUrl }}
                  style={styles.postImg}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  postIcon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: 'black',
  },
  postImg: {
    width: '100%',
    height: 120,
    margin: 1,
  },
  touchIcon: {
    marginRight: '20%',
  },
  postImgTouch: {
    width: '33%',
    margin: 1,
  },
  noPost: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PostGridScreen;
