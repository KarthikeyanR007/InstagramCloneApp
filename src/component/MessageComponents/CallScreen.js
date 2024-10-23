import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import RtcEngine from 'react-native-agora';

const APP_ID = '8d0f015e678543b1980030951c767553'; // Replace with your App ID

const CallScreen = () => {
  const [engine, setEngine] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [channel, setChannel] = useState('testChannel'); // Set your channel name

  useEffect(() => {
    const init = async () => {
      const rtcEngine = await RtcEngine.create(APP_ID);
      setEngine(rtcEngine);

      rtcEngine.addListener('UserJoined', (uid) => {
        console.log('User Joined:', uid);
      });

      rtcEngine.addListener('UserOffline', (uid) => {
        console.log('User Offline:', uid);
      });
    };

    init();

    return () => {
      if (engine) {
        engine.destroy();
      }
    };
  }, [engine]);

  const joinChannel = async () => {
    if (engine) {
      await engine.enableAudio();
      await engine.joinChannel(null, channel, null, 0);
      setIsJoined(true);
    }
  };

  const leaveChannel = async () => {
    if (engine) {
      await engine.leaveChannel();
      setIsJoined(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agora Video Call</Text>
      {!isJoined ? (
        <Button title="Join Channel" onPress={joinChannel} />
      ) : (
        <Button title="Leave Channel" onPress={leaveChannel} />
      )}
      {/* Add video view here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default CallScreen;
