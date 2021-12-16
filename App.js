import React, { useRef, useState} from 'react';
import {useEffect} from 'react';
import {forwardRef} from 'react';
import {Pressable} from 'react-native';
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

export const App = () => {
  const defaultFocusIndex = 1; // The middle box (2/3) shoud receive initial focus for the purpose of this demonstration
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
      console.log(`focusing the following component at index ${defaultFocusIndex}: `, defaultFocusRef.current);
      defaultFocusRef.current?.focus();
    };

    // FAILURE
    // executing the callback immediately does not work
    callback();

    // HACKY WORKAROUND
    // works if you set a timeout of 1ms
    // setTimeout(callback, 1);
  }, []);

  /**
   * Expected result from launching the app (don't touch anything to avoid tampering with default focus, just watch it go):
   * - First box should be red (not focused)
   * - Second box should be white (focused)
   * - Third box should be red (not focused)
   */

  /**
   * Actual result from launching the app (don't touch anything to avoid tampering with default focus, just watch it go):
   * - All 3 boxes are red (indicating that none of them receive initial focus)
   * - You can workaround this but hitting the TAB bar on PC, but this is not recoverable on Xbox. Not a good experience for either platform.
   */

  /**
   * Workaround:
   * - If you wrap the call to ref.focus() in a timeout of 1ms, this seems to avoid the issue
   * - See comments in the useEffect hook to try this out yourself
   */

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

export default App;
