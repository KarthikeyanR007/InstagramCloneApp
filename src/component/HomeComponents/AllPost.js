import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

// import { useNavigation } from '@react-navigation/native';

const AllPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = useSelector((state) => state.user.user);
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

  const renderPost = ({ item }) => {
    const isVideo = item.mediaType && item.mediaType.startsWith('video/');

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

const isLiked = item.likes && item.likes.includes(userEmail);
const likeCount = Array.isArray(item.likes) ? item.likes.length : 0;

   const handleNavigation = (otherMail) => {
      if(userEmail === otherMail){
        navigation.navigate('Profile');
      }else{
        navigation.navigate('SpecificUser', { userEmail : item.userEmail });
      }
   };

    return (
      <View style={styles.postContainer}>
      <TouchableOpacity onPress={()=>handleNavigation(item.userEmail)}>
        <View style={styles.Topheader}>
          <Image
            style={styles.topImage}
            source={{ uri: item.userImage }}
          />
          <View style={styles.TopHeaderNameBox}>
            <Text style={styles.TopuserName}>{item.userName}</Text>
          </View>
          <View style={styles.TopHeaderNameBoxIcon}>
            <MaterialIcons name="more-vert" size={24} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>

        {isVideo ? (
          <Video
            source={{ uri: item.mediaUrl }}
            style={styles.imagePlaceholder}
            controls
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{ uri: item.mediaUrl }}
            style={styles.imagePlaceholder}
          />
        )}

        <View style={styles.actions}>
          <TouchableOpacity onPress={()=>{isLiked ? unLikeMedia(item.id) : likeMedia(item.id);}} >
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

        <Text style={styles.likeText}>{ likeCount } likes</Text>
        <Text style={styles.caption}>
          <Text style={styles.boldText}>{item.userName} </Text>
          {item.caption}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {posts.length === 0 ? (
        <Text style={styles.noPost}>No posts available</Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'white',
  },
  caption: {
    color: 'white',
  },
  noPost: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  boldText: {
    fontWeight: 'bold',
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
    color: '#fff',
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

export default AllPost;
