import { View, Text, Image, StyleSheet} from 'react-native'
import React, { useEffect, useState } from 'react';
import { Container } from 'inversify';


const UserImage = (props: any) => {
    const [userPic, setUserPic] = useState(props.pic)
    const [userName, setUserName] = useState(props.name)
  return (
    <View style={styles.container}>
      {userPic && userPic.length > 0 ?
        <View>
            <Image />
        </View>
        :
        <View>
            <Text style={styles.component}>
                {userName}
            </Text>
        </View>

      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    width: '100%',
    height: '100%',
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  component: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'white',
    display: 'flex',
    textAlign: 'center'
  }
})

export default UserImage