import {
  View,
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';


export default function PrtChat({ route }) {
  const { ChatId, userName } = route.params;
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [matchedDocs, setMatchedDocs] = useState([]);
  const navigation = useNavigation();
  const usermain = useSelector(state => state.user.user);
  const [docIdToUse, setDocIdToUse] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: userName === '' ? 'No title' : userName,
    });
  }, [navigation, userName]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('user').doc(ChatId).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        } else {
          Alert.alert('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [ChatId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }}>
          <Icon name="call" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (userData) {
      const docId1 = `${usermain}_${userData.userEmail}`;
      const docId2 = `${userData.userEmail}_${usermain}`;

      const fetchDocuments = async () => {
        try {
          const snapshot = await firestore().collection('prtChats').get();
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const matched = docs.filter(doc => doc.id === docId1 || doc.id === docId2);
          setMatchedDocs(matched);

          const ids = matched.map(item => item.id);
          const foundDocId = ids.find(id => id === docId1 || id === docId2);
          setDocIdToUse(foundDocId);
        } catch (error) {
          console.error('Error fetching documents: ', error);
        }
      };

      fetchDocuments();
    }
  }, [usermain, userData]);

  useEffect(() => {
    if (usermain) {
      const fetchImg = async () => {
        try {
          const snap = await firestore()
            .collection('user')
            .where('userEmail', '==', usermain)
            .get();

          if (snap.empty) {
            console.log('No matching documents.');
            return;
          }

          const usersList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
        } catch (e) {
          console.error('Error fetching users:', e);
        }
      };

      fetchImg();
    }
  }, [usermain]);

  useLayoutEffect(() => {
    if (userData && docIdToUse) {
      const docRef = firestore().collection('prtChats').doc(docIdToUse);

      const unsubscribe = docRef.onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const newMessages = data.messages || [];

          const formattedMessages = newMessages.map(msg => ({
            ...msg,
            //createdAt: msg.createdAt.toDate(),
          })).reverse();

          setMessages(formattedMessages);
        } else {
          console.error('No such document!');
        }
      }, (error) => {
        console.error('Firestore query error:', error);
      });

      return unsubscribe;
    }
  }, [userData, usermain, docIdToUse]);

  const markMessagesAsSeen = async () => {
    if (docIdToUse) {
      const docRef = firestore().collection('prtChats').doc(docIdToUse);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        const updatedMessages = data.messages.map(msg => {
          if (msg.user._id !== auth().currentUser?.email) {
            return {
              ...msg,
              status: 'seen',
            };
          }
          return msg;
        });

        await docRef.update({
          messages: updatedMessages,
        });
      }
    }
  };

  useEffect(() => {
    if (docIdToUse) {
      markMessagesAsSeen();
    }
  },);

  const onSend = useCallback((messages = []) => {
    const { _id, text, user } = messages[0];

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const docId = `${usermain}_${userData?.userEmail || 'unknown'}`;

    const newMessage = {
      _id,
      text,
      user,
      createdAt: new Date(),
      status: 'sent', // Set initial status as 'sent'
    };

    firestore().collection('prtChats').doc(docIdToUse || docId).set({
      messages: firestore.FieldValue.arrayUnion(newMessage),
    }, { merge: true }).catch((error) => {
      console.error('Error adding document:', error);
    });
  }, [usermain, userData, docIdToUse]);

  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isCurrentUser = currentMessage.user._id === auth().currentUser?.email;

    return (
      <View style={[styles.MainChat, isCurrentUser ? styles.right : styles.left]}>
        {isCurrentUser ? (
          <>
           <View style={[styles.messageContainer, isCurrentUser ? styles.rightMessage : styles.leftMessage]}>
              <Text style={styles.messageText}>{currentMessage.text}</Text>
              <Text style={styles.messageStatus}>
                {currentMessage.status === 'seen' ? 'Seen' : 'Sent'}
              </Text>
            </View>
              <Image
              style={styles.avatar}
              source={{ uri: currentMessage.user.avatar }}
            />
          </>
        ) : (
          <>
            <Image
              style={styles.avatar}
              source={{ uri: currentMessage.user.avatar }}
            />
            <View style={[styles.messageContainer, isCurrentUser ? styles.rightMessage : styles.leftMessage]}>
              <Text style={styles.messageText}>{currentMessage.text}</Text>
              {/* <Text style={styles.messageStatus}>
                {currentMessage.status === 'seen' ? 'Seen' : 'Sent'}
              </Text> */}
            </View>
        </>
        )}
      </View>
    );
  };

  return (
    <>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={true}
        onSend={messages => onSend(messages)}
        renderMessage={renderMessage}
        messagesContainerStyle={styles.msgContainer}
        textInputStyle={styles.TextChat}
        user={{
          _id: auth().currentUser?.email || 'anonymous',
          avatar: users[0]?.profileImg ? users[0].profileImg : 'https://i.pravatar.cc/300',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  MainChat: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
    maxWidth: '99%',
  },
  left: {
    justifyContent: 'flex-start', // Align to the left
  },
  right: {
    justifyContent: 'flex-end', // Align to the right
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10, // Add space for left side messages
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  leftMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  rightMessage: {
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
    color: 'white',
  },
  messageText: {
    color: 'black',
  },
  messageStatus: {
    fontSize: 10,
    color: '#212f3d',
  },
  TextChat: {
    backgroundColor: '#fff',
    borderRadius: 0,
    color: 'black',
    padding: 0,
    margin: 0,
  },
  msgContainer: {
    backgroundColor: 'black',
  },
});
