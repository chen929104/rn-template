/*
 * @文件描述: picker 级联组件
 * @公司: thundersdata
 * @作者: 廖军
 * @Date: 2019-10-08 14:28:00
 * @LastEditors: 黄姗姗
 * @LastEditTime: 2020-05-08 18:06:28
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { IconOutline } from '@ant-design/icons-react-native';
import { Picker } from '@ant-design/react-native';
import { Color, Size } from '../../config';
import { CascadeDataType, valuesType } from '../../interfaces/common';
import { textEllipsis } from '../../utils/string';
import { useNavigation } from '@react-navigation/native';

export interface CascadePickerProps {
  data: CascadeDataType[];
  value?: valuesType;
  onChange?: (value: valuesType, labelArray: string[]) => void;
  placeholder?: string;
  visible?: boolean;
  style?: ViewStyle;
  cols?: number;
  width?: number | string;
}

/** 递归获取级联label array */
const getLabelArray = (data: CascadeDataType[], value: valuesType) => {
  const labelArray: string[] = [];
  const loopData = (list: CascadeDataType[], index: number) => {
    const currentIndex = list.findIndex(item => item.value === value[index]);
    if (currentIndex !== -1) {
      const item = list[currentIndex];
      labelArray.push(item.label);
      if (item.children) {
        loopData(item.children, index + 1);
      }
    }
  };
  loopData(data, 0);
  return labelArray;
};

const CascadePicker: React.FC<CascadePickerProps> = props => {
  const { data, value, onChange, placeholder, visible, style, cols, width } = props;
  const [useVisible, setVisible] = useState(false);
  const [useValue, setValue] = useState<valuesType>([]);
  const navigation = useNavigation();

  // 选择框显示的内容
  const text = useValue.length > 0 ? textEllipsis(getLabelArray(data, useValue).join('-'), 8) : placeholder;
  const isDataEmpty = data.length > 0;

  // 绑定监听
  useEffect(() => {
    navigation.addListener('blur', () => {
      setVisible(false);
    });

    return () => {
      navigation.removeListener('blur', () => {
        setVisible(false);
      });
    };
  }, [navigation]);

  // 内部和父组件都可以控制显隐
  useEffect(() => {
    if (visible !== undefined) {
      setVisible(visible);
    }
  }, [visible]);

  // 父组件可以控制value
  useEffect(() => {
    if (value !== undefined) {
      setValue(value);
    }
  }, [value]);

  const onPickerChange = (values?: valuesType) => {
    const selectedValues = values || [];
    setValue(selectedValues);
    if (onChange && selectedValues.length > 0) {
      onChange(selectedValues, getLabelArray(data, selectedValues));
    }
  };

  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => (isDataEmpty ? setVisible(true) : null)}
        style={[styles.picker, width ? { width } : {}]}>
        <Text style={styles.picked}>{isDataEmpty ? text : '暂无数据'}</Text>
        <IconOutline name="caret-down" color={Color.dark} />
      </TouchableOpacity>
      <Picker
        visible={useVisible}
        onChange={onPickerChange}
        value={useValue}
        data={data}
        cascade={true}
        cols={cols}
        onOk={() => setVisible(false)}
        onDismiss={() => setVisible(false)}
        itemStyle={styles.pickerItem}
      />
    </View>
  );
};

CascadePicker.defaultProps = {
  placeholder: '请选择',
  cols: 2
};

const styles = StyleSheet.create({
  picker: {
    minWidth: Size.px(90),
    height: Size.px(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Size.ONE_PIXEL,
    borderColor: Color.borderColor,
    borderRadius: Size.px(2),
    overflow: 'hidden',
    paddingHorizontal: Size.px(2)
  },
  pickerItem: {
    paddingTop: Size.px(10),
    paddingBottom: Size.px(10)
  },
  picked: {
    color: Color.dark,
    fontSize: Size.px(14),
    marginRight: Size.px(4),
    paddingHorizontal: Size.px(4)
  }
});

export default CascadePicker;
