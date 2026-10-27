import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
type Props = { title: string; onPress: () => void; secondary?: boolean; style?: ViewStyle };
export default function AppButton({ title, onPress, secondary, style }: Props) { return <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.button, secondary && styles.secondary, style]}><Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text></TouchableOpacity>; }
const styles = StyleSheet.create({ button:{ minHeight:49, borderRadius:14, backgroundColor:colors.primary, alignItems:'center', justifyContent:'center', paddingHorizontal:16, marginTop:14 }, secondary:{ backgroundColor:colors.white, borderWidth:1, borderColor:colors.border }, text:{ color:colors.white, fontSize:15, fontWeight:'700' }, secondaryText:{ color:colors.primary } });
