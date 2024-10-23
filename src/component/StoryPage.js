import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function StoryPage() {
  const userEmail = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const unsubscribe = firestore()
  //     .collection('StoryContainer')
  //     .doc(userEmail)
  //     .collection('userStory')
  //     .onSnapshot((snapshot) => {
  //       const fetchedPosts = snapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       const now = new Date();

  //       // Filter posts for 24-hour visibility
  //       const filteredPosts = fetchedPosts.filter(post => {
  //         const createdAt = post.createdAt;

  //         if (!createdAt){ return false;}

  //         const createdAtDate = createdAt.toDate();

  //         const visibilityEnd = new Date(createdAtDate);
  //         visibilityEnd.setDate(createdAtDate.getDate() + 1);
  //         visibilityEnd.setHours(12, 0, 0, 0);

  //         return now >= createdAtDate && now <= visibilityEnd;
  //       });

  //       setPosts(filteredPosts);
  //       console.log(posts);
  //     }, (error) => {
  //       console.error('Error fetching posts:', error);
  //     });

  //   return () => unsubscribe();
  // }, [userEmail,posts]);
  useEffect(() => {
  const unsubscribe = firestore()
    .collection('StoryContainer')
    .doc(userEmail)
    .collection('userStory')
    .onSnapshot((snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const now = new Date();

      // Filter posts for 24-hour visibility
      const filteredPosts = fetchedPosts.filter(post => {
        const createdAt = post.createdAt;

        if (!createdAt) {
          return false;
        }

        const createdAtDate = createdAt.toDate();
        const visibilityEnd = new Date(createdAtDate);
        visibilityEnd.setDate(createdAtDate.getDate() + 1);
        visibilityEnd.setHours(12, 0, 0, 0);

        return now >= createdAtDate && now <= visibilityEnd;
      });

      // Group posts by userEmail
      const groupedPosts = {};

      filteredPosts.forEach(post => {
        const { userEmail, mediaType, mediaUrl, userImage,userName,id } = post;

        if (!groupedPosts[userEmail]) {
          groupedPosts[userEmail] = {
            id,
            userEmail,
            userImage,
            userName,
            media: [],
          };
        }

        groupedPosts[userEmail].media.push({ mediaType, mediaUrl });
      });

      // Convert to an array
      const result = Object.values(groupedPosts);
      setPosts(result);
      console.log(result);
    }, (error) => {
      console.error('Error fetching posts:', error);
    });

  return () => unsubscribe();
}, [userEmail]);


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

  const postAvail = posts.length > 0;
  const handlePress = (item) => { navigation.navigate('ViewStory', { storyData: item }); };

  const renderStory = ({ item }) => {
    return (
      <View>
        {item.userEmail === userEmail ? (
          <View style={styles.ImgBox}>
            <LinearGradient
              colors={postAvail ? ['#FF5733', '#FFC300', '#FF33F6'] : ['transparent', 'transparent']}
              style={postAvail ? styles.gradientBorder : null}
            >
              <TouchableOpacity onPress={postAvail ? () => handlePress(item) : null} style={postAvail ? styles.addStoryTrue : styles.addStoryFalse}>
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  key={item.id}
                  source={{ uri: item.userImage }}
                />
              </TouchableOpacity>
            </LinearGradient>
            <Text style={styles.StoryUserName}>your story</Text>
          </View>
        ) : (
          <View>
           {/* { users.map((user) => (
            <View key={user.id} style={styles.ImgBox}>
              <TouchableOpacity style={postAvail ? styles.addStoryTrue : styles.addStoryFalse}>
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={{ uri: user.profileImg }}
                />
              </TouchableOpacity>
              <Text style={styles.StoryUserName}>your story</Text>
            </View>
          )) } */}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
         users.map((user) => (
            <View key={user.id} style={styles.ImgBox}>
              <TouchableOpacity style={postAvail ? styles.addStoryTrue : styles.addStoryFalse}>
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={{ uri: user.profileImg }}
                />
              </TouchableOpacity>
              <Text style={styles.StoryUserName}>your story</Text>
            </View>
          ))
      ) : (
        <FlatList
          data={posts}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    // flex: 1,
  },
  ImgBox: {
    // margin: 5,
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
  },
  gradientBorder: {
    padding: 3,
    borderRadius: 50,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  noPost: {
    color: 'white',
    textAlign: 'center',
  },
  flatListContent: {
    paddingHorizontal: 5,
    paddingTop: 0,
  },
  StoryUserName: {
    color: '#fff',
    paddingLeft: 15,
    paddingTop: 10,
  },
});
