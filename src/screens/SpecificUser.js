import React from 'react';
import {View,FlatList,StyleSheet} from 'react-native';
import SpecificHeader from '../component/SpecificFollowers/SpecificHeader';
import SpecificUserDB from '../component/SpecificFollowers/SpecificUserDB';
import SpecificUserBio from '../component/SpecificFollowers/SpecificUserBio';
import SpecificUserFollow from '../component/SpecificFollowers/SpecificUserFollow';
import SpecificUserPost from '../component/SpecificFollowers/SpecificUserPost';


export default function SpecificUser({route}) {
    const { userEmail } = route.params;

     const renderItem = () => (
        <View>
          <SpecificHeader mail={userEmail} />
          <SpecificUserDB mail={userEmail}/>
          <SpecificUserBio mail={userEmail}/>
          <SpecificUserFollow mail={userEmail}/>
          <SpecificUserPost mail={userEmail}/>
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
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
