import React, {useMemo, useRef, useState} from 'react';
import {useEffect} from 'react';
import {forwardRef} from 'react';
import {Pressable} from 'react-native';
import {View, StyleSheet, Text, FlatList, InteractionManager} from 'react-native';

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
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
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
  const focusedStyle = focused ? { backgroundColor: 'white'} : null;

  return <Pressable style={[styles.item, focusedStyle]} onPress={onPress} ref={ref} onFocus={onFocus} onBlur={onBlur}>
      <Text style={styles.title}>{title}</Text>
  </Pressable>
});

export const PressableFocusTest = () => {
  const length = DATA.length;
  const inputRefs = useMemo(
    () =>
      Array(length)
        .fill(0)
        .map(() => React.createRef()),
    [length],
  );

  const renderItem = ({item, index}) => {
    const ref = inputRefs[index];
    const onPress = () => {
      console.log(item);
    };
    return <TestItem title={item.title} onPress={onPress} ref={ref} />;
  };

  useEffect(() => {
    const callback = () => {
      const defaultFocusedIndex = 0;
      const defaultFocusedItem = inputRefs[defaultFocusedIndex];
      console.log('focusing the following component: ', defaultFocusedItem.current);
      defaultFocusedItem.current?.focus();
    };

    // executing the callback immediately does not work
    // callback();

    // works if you set a timeout of 1ms
    setTimeout(callback, 1);
  }, [inputRefs]);


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
