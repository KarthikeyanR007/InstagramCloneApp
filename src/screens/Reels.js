import { View, Text, ActivityIndicator, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function Reels() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup('userPosts')
      .onSnapshot((snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Filter to only include videos
        const videoPosts = fetchedPosts.filter(post => post.mediaType && post.mediaType.startsWith('video/'));
        setPosts(videoPosts);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderPost = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: item.mediaUrl }}
            style={styles.fullScreenVideo}
            controls
            resizeMode="cover"
          />
          <Image
            source={{uri:item.userImage}}
            style={styles.imgIcon}
          />
          <Text style={styles.usernameOverlay}>{item.userName}</Text>
          <TouchableOpacity style={styles.follow}>
                <Text>Follow</Text>
          </TouchableOpacity>
          <Text style={styles.command}>{item.caption}</Text>
          <View style={styles.Icons}>
            <TouchableOpacity style={styles.likeIcons}>
              <FontAwesome name="heart-o" size={26} color="white" />
              <Text style={styles.count}>112K</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.likeIcons}>
              <Ionicons name="chatbubble-outline" size={26} color="white" />
              <Text style={styles.count}>112K</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeIcons}>
              <Ionicons name="paper-plane-outline" size={26} color="white" />
              <Text style={styles.count}>112K</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeIcons}>
              <MaterialIcons name="more-vert" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text style={styles.noPost}>No videos available</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0, // Remove padding for full-screen video
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    width: width, // Ensure the post container takes full width
    height: height, // Ensure the post container takes full height
  },
  videoContainer: {
    position: 'relative', // Needed for absolute positioning of username
    width: '100%',
    height: '100%', // Full height
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  usernameOverlay: {
    position: 'absolute',
    bottom:110,
    left: 80,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  noPost: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  follow:{
    position: 'absolute',
    bottom:110, // Adjust as needed
    left: 190,
    height:30,
    width:80,
    borderWidth:1,
    borderColor:'#ffff',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
  },
  imgIcon:{
    height:50,
    width:50,
    borderRadius:50,
    position:'absolute',
    bottom:100,
    left:20,
  },
  command:{
    position:'absolute',
    bottom:75,
    left:35,
  },
  Icons:{
    position:'absolute',
    right:10,
    bottom:'15%',
  },
  likeIcons:{
    marginVertical:10,
  },
  count:{
    marginTop:5,
  },
});
