import { View,StyleSheet,Image, Text, TouchableOpacity} from 'react-native';
import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
const logo = require('../../assets/defImg.jpg');

export default function ProfileDB() {
     const userEmail = useSelector((state) => state.user.user);
     const [users, setUsers] = useState([]);
     const [posts,setPost] = useState([]);
     const navigation = useNavigation();
   useEffect(() => {
    const fetchUsername = async () => {
      console.log('username...' + userEmail);
      console.log('userEmail', '==', userEmail);
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
  const fetchPostCount = async () => {
    console.log('username...' + userEmail);
    console.log('userEmail', '==', userEmail);
    try {
      const userPostsQuerySnapshot = await firestore()
        .collection('posts')
        .doc(userEmail)  // Change `docs` to `doc`
        .collection('userPosts')
        .get();

      if (userPostsQuerySnapshot.empty) {
        console.log('No matching documents.');
        return;
      }

      const PostList = userPostsQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPost(PostList);
    } catch (e) {
      console.error('Error fetching posts:', e);  // Update error message for clarity
    }
  };

  fetchPostCount();
}, [userEmail]);

  return (
    <View style = {styles.mainContainer}>
     {users.map(user => (
      <View key={user.id}  style = {styles.mainContainer}>
        <View style={styles.ImgBox} >
            {user.profileImg ?
               <Image
                  style={styles.topImage}
                  source={{ uri: users[0].profileImg }}
                  />
                :
                <Image
                  style={styles.topImage}
                  source={logo}
                  />
              }
        </View>
        <TouchableOpacity onPress={()=>{navigation.navigate('AddStory')}}  style={styles.addStory}>
          <Feather name="plus" color="#fff" size={16}/>
        </TouchableOpacity>
        <View style={styles.postStyle}>
            <View style={styles.post}>
              <Text style={styles.postText}>{posts.length}</Text>
              <Text style={styles.posttxt}>posts</Text>
            </View>
            <View style={styles.post}>
              <Text style={styles.postText}>{Array.isArray(user.follower) ? users[0].follower.length : 0}</Text>
              <Text style={styles.posttxt}>followers</Text>
            </View>
            <View style={styles.post}>
              <Text style={styles.postText}>{Array.isArray(user.following) ? users[0].following.length : 0}</Text>
              <Text style={styles.posttxt}>following</Text>
            </View>
        </View>
      </View>
       ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer:{
    flexDirection:'row',
    // height:'10%',
    borderWidth:2,
    alignItems:'center',
    backgroundColor:'black',
  },
  ImgBox:{},
  topImage:{
    height:80,
    width:80,
    borderRadius:50,
    marginLeft:'8%',
  },
  postStyle:{
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection:'row',
  },
  post:{
    justifyContent:'center',
    alignItems:'center',
    marginRight:20,
  },
  postText:{
    fontWeight:'bold',
    fontSize:20,
    color:'#FFFFFF',
  },
  posttxt:{
    fontSize:15,
  },
  addStory:{
    position:'absolute',
    left:75,
    top:45,
    height:20,
    width:20,
    borderRadius:50,
    borderWidth:1,
    backgroundColor:'#3498db',
    justifyContent:'center',
    alignItems:'center',
  },
});
