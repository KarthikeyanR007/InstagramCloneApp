import { View, Text,StyleSheet,TouchableOpacity,Image } from 'react-native';
import React from 'react';

export default function PostContainer() {
  return (
    <View style={styles.postContainer}>
        <View style={styles.header}>
            <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
            <Text style={styles.username}>user2</Text>
        </View>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <View style={styles.actions}>
              <TouchableOpacity>
                  <Text style={styles.actionText}>❤️</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                  <Text style={styles.actionText}>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                  <Text style={styles.actionText}>➡️</Text>
              </TouchableOpacity>
          </View>
          <Text style={styles.likes}>112 likes</Text>
          <Text style={styles.caption}>
              <Text style={styles.username}>user3 </Text>
              'Coffee time!'
          </Text>
          <Text style={styles.comments}>'Coffee time!' comments</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        backgroundColor:'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    actions: {
        flexDirection: 'row',
        padding: 10,
    },
    actionText: {
        fontSize: 24,
        marginRight: 15,
        color: 'black', // Set action text color to black
    },
    likes: {
        fontWeight: 'bold',
        paddingLeft: 10,
        color: 'black', // Set likes text color to black
    },
    caption: {
        padding: 10,
        color: 'black', // Set caption text color to black
    },
    comments: {
        color: 'white', // Set comments text color to black
        paddingLeft: 10,
    },
    mainContainer:{
        flex:1,
    },
    topHeader:{
        height:50,
        width:'100%',
        borderWidth:2,
        borderColor:'blue',
        flexDirection:'row',
        backgroundColor:'black',
    },
});
