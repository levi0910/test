import React, {useState} from 'react';
import {KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View} from "react-native";

const Input = (props) => {


   
    return (
        <KeyboardAvoidingView behaviour={'position'}>
            <View style={{
                backgroundColor: '#FFF',
                flexDirection: 'row',
                borderTopWidth: 1,
                borderColor: '#EEE',
                alignItems: 'center',
                paddingLeft: 15,
            }}>
                <TextInput
                    placeholder={'Add a comment...'}
                    keyboardType={'twitter'}
                    autoFocus={false}
                    onChangeText={text=>props.setComment(text)}
                    style={{flex: 1, height: 40, fontSize: 15}}
                />
                <TouchableOpacity
                    style={{height: 40, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center'}}
                >
                        <Text style={{color: '#3F51B5', fontWeight: 'bold', textAlign: 'center'}}
                         onPress = {()=>{props.PostComment()}}>Post</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{height: 40, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => {props.closeModal()}}
                >
                        <Text style={{color: 'red', fontWeight: 'bold', textAlign: 'center'}}>Close</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}
export default Input;