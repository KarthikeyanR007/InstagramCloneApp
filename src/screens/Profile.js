import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProfileHead from '../component/ProfileComponents/ProfileHead';
import ProfileDB from '../component/ProfileComponents/ProfileDB';
import ProfileDetails from '../component/ProfileComponents/ProfileDetails';
import ProfileHighlights from '../component/ProfileComponents/ProfileHighlights';
import ProfilePost from '../component/ProfileComponents/ProfilePost';

const Profile = () => {
  const renderItem = () => (
        <View>
          <ProfileHead />
          <ProfileDB />
          <ProfileDetails />
          <ProfileHighlights />
          <ProfilePost />
        </View>
    );
  return (
       <FlatList
          data={[{ key: '1' }]} // Dummy data to render the list
          renderItem={renderItem}
          keyExtractor={item => item.key}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default Profile;
