import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
export type TabKey='home'|'pets'|'services'|'profile';
type Props={active:TabKey; onChange:(tab:TabKey)=>void};
const items:{key:TabKey;label:string;icon:any}[]=[{key:'home',label:'Início',icon:'home-outline'},{key:'pets',label:'Meus pets',icon:'paw-outline'},{key:'services',label:'Serviços',icon:'calendar-outline'},{key:'profile',label:'Perfil',icon:'person-outline'}];
export default function BottomNavigation({active,onChange}:Props){return <View style={styles.bar}>{items.map(i=><TouchableOpacity key={i.key} onPress={()=>onChange(i.key)} style={styles.item}><Ionicons name={i.icon} size={21} color={active===i.key?colors.primary:'#9AA2B4'}/><Text style={[styles.label,active===i.key&&styles.selected]}>{i.label}</Text></TouchableOpacity>)}</View>}
const styles=StyleSheet.create({bar:{height:65,backgroundColor:colors.white,borderTopWidth:1,borderTopColor:colors.border,flexDirection:'row',justifyContent:'space-around',alignItems:'center'},item:{alignItems:'center',gap:3,minWidth:60},label:{fontSize:10,color:'#9AA2B4'},selected:{color:colors.primary,fontWeight:'700'}});
