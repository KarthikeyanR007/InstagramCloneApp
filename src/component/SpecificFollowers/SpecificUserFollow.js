import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function SpecificUserFollow(props) {
    const userEmail = props.mail;
    const navigation = useNavigation();
    const currentUserEmail = useSelector((state) => state.user.user);
    const [users, setUsers] = useState([]);
    const [chatMembers, setChatMembers] = useState([]);

    const addFollow = () => {
        addFollower();
        addFollowing();
    };

    const addFollower = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('user')
                .where('userEmail', '==', userEmail)
                .get();

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await userDoc.ref.update({
                    follower: firestore.FieldValue.arrayUnion(currentUserEmail),
                });
            } else {
                console.error('No user found with this email');
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

    const addFollowing = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('user')
                .where('userEmail', '==', currentUserEmail)
                .get();

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await userDoc.ref.update({
                    following: firestore.FieldValue.arrayUnion(userEmail),
                });
            } else {
                console.error('No user found with this email');
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

    const removeFollower = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('user')
                .where('userEmail', '==', userEmail)
                .get();

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await userDoc.ref.update({
                    follower: firestore.FieldValue.arrayRemove(currentUserEmail),
                });
            } else {
                console.error('No user found with this email');
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

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

    useEffect(() => {
        const unsubscribe = firestore()
            .collectionGroup('Members')
            .onSnapshot((snapshot) => {
                const fetchedPosts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setChatMembers(fetchedPosts);
            }, (error) => {
                console.error('Error fetching posts:', error);
            });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const handleMessage = async (userID, userName) => {
        const isMember = chatMembers.length > 0 && chatMembers[0].members && chatMembers[0].members.includes(userEmail);

       if (!isMember) {
        try {
            // Add the user to the Members collection for the current user
            await firestore()
                .collection('MyChatMembers')
                .doc(currentUserEmail) // Reference to the specific user document
                .set({ // Use set to create or update the document
                    members: firestore.FieldValue.arrayUnion(userEmail), // Add to the array of members
                }, { merge: true }); // Merge option to update without overwriting existing data
        } catch (e) {
            console.error('Upload error: ', e);
        }
    } else {
        console.log(`${userEmail} is already a member.`);
    }
       navigation.navigate('PrtChat', { ChatId: userID, userName: userName });
    };

    return (
        <>
            <View style={styles.followContainer}>
                {users.map(user => (
                    <View key={user.id} style={styles.followContainer}>
                        <TouchableOpacity
                            style={user.follower && user.follower.includes(currentUserEmail) ? styles.OuterContainer2 : styles.OuterContainer1}
                            onPress={user.follower && user.follower.includes(currentUserEmail) ? removeFollower : addFollow}>
                            <Text style={styles.FollowText}>
                                {user.follower && user.follower.includes(currentUserEmail) ? 'Following' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleMessage(user.id, user.username)}
                            style={[styles.OuterContainer2, styles.marginLeftValue]}>
                            <Text style={styles.FollowText}>Message</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={styles.highlightContainer}>
                <TouchableOpacity style={styles.highlightBox}>
                    <Text style={styles.highlightIcon}>
                        <Fontisto name="plus-a" size={18} color="white" />
                    </Text>
                </TouchableOpacity>
                <Text style={styles.highlightText}>Highlights</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    followContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    OuterContainer1: {
        height: 35,
        width: 150,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3498db',
    },
    OuterContainer2: {
        height: 35,
        width: 150,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#212f3d',
    },
    FollowText: {
        fontWeight: 'bold',
    },
    highlightBox: {
        height: 80,
        width: 80,
        borderRadius: 50,
        borderColor: '#fff',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    highlightContainer: {
        backgroundColor: 'black',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    highlightIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    highlightText: {
        marginVertical: 5,
    },
    marginLeftValue: {
        marginLeft: 10,
    },
});
