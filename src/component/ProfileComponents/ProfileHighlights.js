import { View,TouchableOpacity, StyleSheet, Text } from 'react-native';
import React from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';

export default function ProfileHighlights() {
  return (
    <View style={styles.highlightContainer}>
       <TouchableOpacity style={styles.highlightBox}>
         <Text style={styles.highlightIcon}>
           <Fontisto name="plus-a" size={18} color="white" />
         </Text>
       </TouchableOpacity>
       <Text style={styles.highlightText}>Highlights</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  highlightBox:{
    height:80,
    width:80,
    borderRadius:50,
    borderColor:'#fff',
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center',
  },
  highlightContainer:{
    backgroundColor:'black',
    justifyContent:'center',
    paddingVertical:5,
  },
  highlightIcon:{
    justifyContent:'center',
    alignItems:'center',
  },
  highlightText:{
    marginVertical:5,
  },
});
