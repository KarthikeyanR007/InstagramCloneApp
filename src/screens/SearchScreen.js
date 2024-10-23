import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Text,ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PostGridScreen = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup('userPosts')
      .onSnapshot((snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.postContainer}>

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
                navigation.navigate('Reels'); // Pass post ID
              }}
            >
              {item.mediaType.startsWith('video/') ? (
                <Video
                  source={{ uri: item.mediaUrl }}
                  style={styles.postVideo}
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
  postVideo:{
    width: '100%',
    height: 240,
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
