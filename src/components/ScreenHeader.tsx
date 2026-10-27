import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
type Props={ title:string; subtitle?:string; onBack?:()=>void };
export default function ScreenHeader({title,subtitle,onBack}:Props){return <View style={styles.wrap}>{onBack ? <TouchableOpacity onPress={onBack} style={styles.back}><Ionicons name="chevron-back" size={23} color={colors.primary}/></TouchableOpacity>:null}<View style={{flex:1}}><Text style={styles.title}>{title}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text>:null}</View><View style={styles.logo}><Ionicons name="paw" size={19} color={colors.primary}/></View></View>}
const styles=StyleSheet.create({wrap:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:18},back:{width:38,height:38,borderRadius:12,backgroundColor:colors.white,alignItems:'center',justifyContent:'center'},title:{fontSize:23,fontWeight:'800',color:colors.text},subtitle:{fontSize:12,color:colors.muted,marginTop:3},logo:{width:38,height:38,borderRadius:13,backgroundColor:colors.paleBlue,alignItems:'center',justifyContent:'center'}});
