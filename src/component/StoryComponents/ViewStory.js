// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import Video from 'react-native-video';

// export default function ViewStory({ route, navigation }) {
//   const { storyData } = route.params;
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Check if media is a video
//   const isVideo = (mediaType) => mediaType && mediaType.startsWith('video/');

//   useEffect(() => {
//     const totalMedia = storyData.media.length;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % totalMedia); // Loop back to the start
//     }, 5000); // Change every 5 seconds

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [storyData.media.length]);

//   const { mediaType, mediaUrl, id } = storyData.media[currentIndex];
//   const userImage = storyData.userImage; // Correct destructuring
//   const userName = storyData.userName; // Correct destructuring

//   return (
//     <View style={styles.fullContainer}>
//       {isVideo(mediaType) ? (
//         <Video
//           source={{ uri: mediaUrl }}
//           style={styles.mediaPlaceholder}
//           controls
//           resizeMode="cover"
//         />
//       ) : (
//         <Image
//           source={{ uri: mediaUrl }}
//           key={id}
//           style={styles.mediaPlaceholder}
//         />
//       )}
//       <Image source={{ uri: userImage }} style={styles.userImg} />
//       <Text style={styles.storyText}>{userName}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   fullContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   mediaPlaceholder: {
//     width: '100%',
//     height: '100%',
//   },
//   userImg: {
//     height: 40,
//     width: 40,
//     borderRadius: 50,
//     position: 'absolute',
//     top: 20,
//     left: 20,
//   },
//   storyText: {
//     position: 'absolute',
//     top: 35,
//     left: 70,
//     color: 'white', // Change color for better visibility
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import Video from 'react-native-video';

export default function ViewStory({ route, navigation }) {
  const { storyData } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useState(new Animated.Value(0))[0]; // Initialize the progress value

  // Check if media is a video
  const isVideo = (mediaType) => mediaType && mediaType.startsWith('video/');

  useEffect(() => {
    const totalMedia = storyData.media.length;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalMedia); // Loop back to the start
      progress.setValue(0); // Reset progress for the new media

      // Start the progress animation
      Animated.timing(progress, {
        toValue: 1,
        duration: 10000, // Change every 5 seconds
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }, 10000);

    // Start the first animation
    Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    return () => {
      clearInterval(interval); // Cleanup on unmount
      progress.setValue(0); // Reset progress on unmount
    };
  }, [progress, storyData.media.length]);

  const { mediaType, mediaUrl, id } = storyData.media[currentIndex];
  const userImage = storyData.userImage;
  const userName = storyData.userName;

  // Calculate width for the progress bar
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.fullContainer}>
      {isVideo(mediaType) ? (
        <Video
          source={{ uri: mediaUrl }}
          style={styles.mediaPlaceholder}
          controls
          resizeMode="cover"
        />
      ) : (
        <Image
          source={{ uri: mediaUrl }}
          key={id}
          style={styles.mediaPlaceholder}
        />
      )}
      <Image source={{ uri: userImage }} style={styles.userImg} />
      <Text style={styles.storyText}>{userName}</Text>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
  },
  userImg: {
    height: 40,
    width: 40,
    borderRadius: 50,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  storyText: {
    position: 'absolute',
    top: 35,
    left: 70,
    color: 'white', // Change color for better visibility
  },
  progressContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
});

