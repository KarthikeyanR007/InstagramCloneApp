import React from 'react';
import { View,FlatList, StyleSheet } from 'react-native';
import Header from '../component/Header';
import StoryPage from '../component/StoryPage';
import OtherStory from '../component/StoryComponents/OtherStory';
import AllPost from '../component/HomeComponents/AllPost';

const Home = () => {
    const renderItem = () => (
        <View>
            <Header />
            <View style={styles.homeStyle}>
                <StoryPage />
                <OtherStory />
            </View>
            <AllPost />
        </View>
    );

    return (
        <FlatList
            data={[{ key: '1' }]}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default Home;

const styles = StyleSheet.create({
    homeStyle:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
});
