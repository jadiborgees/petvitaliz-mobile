import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme/privateTheme';
import {
  PLAN_ORDER,
  PLAN_NAMES,
  PLAN_FEATURES,
  getMonthlyPrice,
  getCyclePrice,
  type PlanId,
  type BillingCycle,
} from '../data/planCoverage';

// Vitrine de planos (mesmo visual da área logada): coroa com fundo da cor
// do nível, um card aberto por vez e botão com o valor.
export const PLAN_TIER: Record<PlanId, { color: string; summary: string }> = {
  bronze: { color: '#B87333', summary: 'Banho e tosa + atendimento básico' },
  prata: { color: '#A3ADBC', summary: '+ vacinas e 2 consultas' },
  ouro: { color: '#E3A912', summary: '+ exames e consultas ilimitadas' },
  diamante: { color: '#4FB3D9', summary: '+ leva e traz ilimitado' },
};

const C = theme.colors;
const F = theme.fonts;

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface Props {
  onChoose: (planId: PlanId, cycle: BillingCycle) => void;
  initialPlanId?: PlanId;
}

export default function PlanShowcaseList({ onChoose, initialPlanId = 'ouro' }: Props) {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [openId, setOpenId] = useState<PlanId>(initialPlanId);
  const [showAll, setShowAll] = useState(false);

  return (
    <View>
      <View style={styles.toggle}>
        {(['monthly', 'yearly'] as BillingCycle[]).map((option) => {
          const active = cycle === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.toggleOption, active && styles.toggleActive]}
              onPress={() => setCycle(option)}
            >
              <Text style={[styles.toggleText, active && styles.toggleTextActive]}>
                {option === 'monthly' ? 'Mensal' : 'Anual'}
              </Text>
              {option === 'yearly' && (
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>até 18% off</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {PLAN_ORDER.map((id) => {
        const open = openId === id;
        const features = PLAN_FEATURES[id];
        const visible = open && showAll ? features : features.slice(0, 3);
        const name = PLAN_NAMES[id].replace('Plano ', '');
        return (
          <View key={id} style={[styles.card, open && styles.cardOpen]}>
            {id === 'ouro' && (
              <View style={styles.ribbon}>
                <Text style={styles.ribbonText}>Mais escolhido</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.top}
              onPress={() => {
                setOpenId(id);
                setShowAll(false);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.crown, { backgroundColor: PLAN_TIER[id].color }]}>
                <MaterialCommunityIcons name="crown" size={19} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.summary}>{PLAN_TIER[id].summary}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.price}>{money(getMonthlyPrice(id, cycle))}</Text>
                <Text style={styles.unit}>/mês</Text>
              </View>
            </TouchableOpacity>

            {open && (
              <>
                <View style={styles.features}>
                  {visible.map((feature) => (
                    <View key={feature.text} style={styles.featureRow}>
                      <Feather name="check-circle" size={14} color={C.success} />
                      <Text style={styles.featureText}>{feature.text}</Text>
                      <Text style={styles.featureCount}>{feature.count}</Text>
                    </View>
                  ))}
                  {features.length > 3 && (
                    <TouchableOpacity onPress={() => setShowAll((v) => !v)}>
                      <Text style={styles.seeAll}>
                        {showAll ? 'Ver menos' : `Ver tudo (${features.length} itens)`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity style={styles.button} onPress={() => onChoose(id, cycle)} activeOpacity={0.85}>
                  <Text style={styles.buttonText}>
                    Escolher {name} ·{' '}
                    {cycle === 'yearly' ? `${money(getCyclePrice(id, 'yearly'))}/ano` : `${money(getMonthlyPrice(id, 'monthly'))}/mês`}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', backgroundColor: C.divider, borderRadius: 12, padding: 4, marginBottom: 16 },
  toggleOption: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 9, borderRadius: 9 },
  toggleActive: { backgroundColor: C.card },
  toggleText: { fontSize: 13, fontFamily: F.semibold, color: C.muted },
  toggleTextActive: { fontFamily: F.bold, color: C.navy },
  saveBadge: { backgroundColor: '#E7F6EF', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  saveText: { fontSize: 10, fontFamily: F.bold, color: C.success },

  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 13, marginBottom: 12 },
  cardOpen: { borderColor: C.primary, borderWidth: 2 },
  ribbon: {
    position: 'absolute',
    top: -10,
    left: 14,
    backgroundColor: C.brandYellow,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  ribbonText: { fontSize: 10, fontFamily: F.bold, color: C.navy },
  top: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  crown: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontFamily: F.bold, color: C.navy },
  summary: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 1 },
  price: { fontSize: 16, fontFamily: F.bold, color: C.primary },
  unit: { fontSize: 10, fontFamily: F.regular, color: C.muted },
  features: { borderTopWidth: 1, borderTopColor: C.divider, marginTop: 12, paddingTop: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 },
  featureText: { flex: 1, fontSize: 12, fontFamily: F.medium, color: C.navy },
  featureCount: { fontSize: 12, fontFamily: F.semibold, color: C.muted },
  seeAll: { fontSize: 12, fontFamily: F.bold, color: C.primary, paddingTop: 6 },
  button: { minHeight: 46, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  buttonText: { fontSize: 13, fontFamily: F.bold, color: '#FFFFFF' },
});