import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function StoryPage() {
  const userEmail = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup('userStory')
      .onSnapshot((snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const now = new Date();

        // Filter posts for 24-hour visibility and exclude own stories
        const filteredPosts = fetchedPosts.filter(post => {
          const createdAt = post.createdAt;

          if (!createdAt || post.userEmail === userEmail) {
            return false; // Skip posts without createdAt or if it's the user's own story
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
          const { userEmail, mediaType, mediaUrl, userImage, userName } = post;

          if (!groupedPosts[userEmail]) {
            groupedPosts[userEmail] = {
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
        //console.log(posts);
      }, (error) => {
        console.error('Error fetching posts:', error);
      });

    return () => unsubscribe();
  }, [userEmail,posts]);

  const handlePress = (item) => {
    navigation.navigate('ViewStory', { storyData: item });
  };

  const renderStory = ({ item }) => {
    return (
      <View style={styles.ImgBox}>
        <LinearGradient
          colors={['#FF5733', '#FFC300', '#FF33F6']}
          style={styles.gradientBorder}
        >
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.addStoryTrue}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{ uri: item.userImage }}
            />
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.StoryUserName}>{item.userName}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text style={styles.noPost}>No Stories Available</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderStory}
          keyExtractor={(item) => item.userEmail}
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
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  ImgBox: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  StoryUserName: {
    color: '#fff',
    paddingLeft: 15,
    paddingTop: 10,
  },
});
