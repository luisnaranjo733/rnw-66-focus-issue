import React, {useRef, useState} from 'react';
import {useEffect} from 'react';
import {forwardRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, StyleSheet, Text, FlatList} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  item: {
    backgroundColor: 'red',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 32,
  },
});

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Merry',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Christmas',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '!!!',
  },
];

const TestItem = forwardRef(function InnerTestItem({title, onPress}, ref) {
  const [focused, setFocused] = useState(false);
  const onFocus = () => {
    console.log(`onFocus: ${title}`);
    setFocused(true);
  };
  const onBlur = () => {
    console.log(`onBlur: ${title}`)
    setFocused(false);
  };
  const focusedStyle = focused ? { backgroundColor: 'white'} : null;``
  return (
    <TouchableOpacity style={[styles.item, focusedStyle]} onPress={onPress} ref={ref} onFocus={onFocus} onBlur={onBlur}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
});

export const TouchableOpacityFocusTest = () => {
  const defaultFocusIndex = 1;
  const defaultFocusRef = useRef();

  const renderItem = ({item, index}) => {
    // Only grab the ref if the index is right
    const ref = index === defaultFocusIndex ? defaultFocusRef : undefined;

    const onPress = () => {
      console.log(item);
    };

    return <TestItem title={item.title} onPress={onPress} ref={ref} />;
  };

  useEffect(() => {
    const callback = () => {
      console.log('focusing the following component: ', defaultFocusRef.current);
      defaultFocusRef.current?.focus();
    };

    // executing the callback immediately does not work
    // callback();

    // works if you set a timeout of 1ms
    setTimeout(callback, 1);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
