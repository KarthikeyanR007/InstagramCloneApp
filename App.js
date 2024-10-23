import './gesture-handler';
import 'react-native-get-random-values';
import '@react-native-firebase/app';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Image} from 'react-native';
import { AuthProvider, useAuth } from './AuthContext';
import LoginScreen from './src/Auth/LoginScreen';
import SignUpScreen from './src/Auth/SignUpScreen';
import Emailentery from './src/Auth/Emailentery';
import PasswordScreen from './src/Auth/PasswordScreen';
import NameScreen from './src/Auth/NameScreen';
import Home from './src/screens/Home';
import PostAdd from './src/screens/PostAdd';
import Profile from './src/screens/Profile';
import ProfilePostSingle from './src/component/ProfileComponents/ProfilePostSingle';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './src/redux/userSlice';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import Reels from './src/screens/Reels';
import SearchScreen from './src/screens/SearchScreen';
import Settings from './src/screens/Settings';
import Message from './src/component/MessageComponents/Message';
import PrtChat from './src/component/MessageComponents/PrtChat';
import SpecificUser from './src/screens/SpecificUser';
import SpecificUserSinglePost from './src/component/SpecificFollowers/SpecificUserSinglePost';
import AddStory from './src/component/StoryComponents/AddStory';
import ViewStory from './src/component/StoryComponents/ViewStory';

// import CameraScreen from './src/component/MessageComponents/CemaraScreen';
const defImg = require('./src/assets/defImg.jpg');


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const [users, setUsers] = useState([]);
  const userEmail = useSelector((state) => state.user.user);

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

    if (userEmail) {
      fetchUsername();
    }
  }, [userEmail]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black', height: 70 },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '', // Hide the label
          tabBarIcon: ({ focused }) => (
            <Entypo name="home" color={focused ? 'white' : 'gray'} size={25} />
          ),
        }}
      />

      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="search" color={focused ? 'white' : 'gray'} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="PostAdd"
        component={PostAdd}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="plus-square-o" color={focused ? 'white' : 'gray'} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Reels"
        component={Reels}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="movie-outline" color={focused ? 'white' : 'gray'} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: '', // Hide the label
          tabBarIcon: ({ focused }) => (
            users.length > 0 && users[0].profileImg ? (
              <Image
                style={{ width: 25, height: 25, borderRadius: 12.5 }} // Adjust style as needed
                source={{ uri: users[0].profileImg }}
              />
            ) : (
              <Image
                style={{ width: 25, height: 25, borderRadius: 12.5 }} // Adjust style as needed
                source={defImg}
              />
            )
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppStack = () => {
    const [users, setUsers] = useState([]);
    const userEmail = useSelector((state) => state.user.user);

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

    if (userEmail) {
      fetchUsername();
    }
  }, [userEmail]);

  return(
    <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="ProfilePostSingle" component={ProfilePostSingle} options={{ headerShown: false }} />
    <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          headerStyle: {
              backgroundColor: 'black',
            },
          headerTintColor: 'white',
         }} />
    <Stack.Screen
        name="Message" component={Message}
        options={{
          title:  users.length > 0 && users[0].username ? (
             users[0].username
            ) : (
             'User'
            ),
          headerStyle: {
              backgroundColor: 'black',
            },
          headerTintColor: 'white'}}/>
    <Stack.Screen
      name="PrtChat"
      component={PrtChat}
      options={{
          headerShown: true,
          headerStyle: {
              backgroundColor: 'black',
            },
          headerTintColor: 'white',
         }}  />
    <Stack.Screen
      name="SpecificUser"
      component={SpecificUser}
      options={{
          headerShown: false,
         }}  />
    <Stack.Screen
      name="SpecificUserSinglePost"
      component={SpecificUserSinglePost}
      options={{
          headerShown: false,
         }}  />
    <Stack.Screen
      name="AddStory"
      component={AddStory}
      options={{
          headerShown: false,
         }}  />
    <Stack.Screen
      name="ViewStory"
      component={ViewStory}
      options={{
          headerShown: false,
         }}  />
  </Stack.Navigator>
  );
};

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{
        title: '',
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
      }}
    />
    <Stack.Screen
      name="Emailentery"
      component={Emailentery}
      options={{
        title: '',
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
      }}
    />
    <Stack.Screen
      name="PasswordScreen"
      component={PasswordScreen}
      options={{
        title: '',
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
      }}
    />
    <Stack.Screen
      name="NameScreen"
      component={NameScreen}
      options={{
        title: '',
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
      }}
    />
    <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
  </Stack.Navigator>
);

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.user.user);

   useEffect(() => {
     if (!isLoading) {
       if (user) {
         dispatch(setUser(user.email));
       }
     }
   },);

  useEffect(() => {
    setIsLoading(false); // For demonstration purposes
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
