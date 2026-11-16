// Cobertura de serviços por plano.
// Este é o único lugar onde se define o que cada plano cobre e a cota mensal.
// Use 'ilimitado' para serviços sem limite e um número para a cota do mês.
// Serviço que não aparece no plano fica bloqueado (cadeado).

import type { ImageSourcePropType } from 'react-native';
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type PlanId = 'bronze' | 'prata' | 'ouro' | 'diamante';

export type ServiceId =
  | 'banho_tosa'
  | 'exames'
  | 'vacinacao'
  | 'emergencia'
  | 'leva_busca'
  | 'consulta';

export type Quota = number | 'ilimitado';

export type ServiceInfo = {
  id: ServiceId;
  name: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  image?: ImageSourcePropType;
};

export const PLAN_ORDER: PlanId[] = ['bronze', 'prata', 'ouro', 'diamante'];

export const PLAN_NAMES: Record<PlanId, string> = {
  bronze: 'Plano Bronze',
  prata: 'Plano Prata',
  ouro: 'Plano Ouro',
  diamante: 'Plano Diamante',
};

export const SERVICES: ServiceInfo[] = [
  {
    id: 'banho_tosa',
    name: 'Banho e tosa',
    description: 'Higiene e estética com profissionais da rede.',
    icon: 'cut-outline',
    image: require('../assets/banho-tosa.jpg'),
  },
  {
    id: 'exames',
    name: 'Exames',
    description: 'Exames de rotina e laboratoriais.',
    icon: 'flask-outline',
    image: require('../assets/exames.jpg'),
  },
  {
    id: 'vacinacao',
    name: 'Vacinação',
    description: 'Vacinas anuais e reforços.',
    icon: 'medkit-outline',
    image: require('../assets/vacinacao.jpg'),
  },
  {
    id: 'emergencia',
    name: 'Emergência 24h',
    description: 'Atendimento de urgência a qualquer hora.',
    icon: 'pulse-outline',
    image: require('../assets/emergencia.jpg'),
  },
  {
    id: 'leva_busca',
    name: 'Leva e busca',
    description: 'Buscamos e levamos seu pet com segurança.',
    icon: 'car-outline',
    image: require('../assets/leva-busca.jpg'),
  },
  {
    id: 'consulta',
    name: 'Consulta',
    description: 'Consulta veterinária presencial.',
    icon: 'medical-outline',
  },
];

// Baseado nos banners dos planos, com a regra: o plano maior inclui
// tudo o que o menor tem. Ajuste aqui se as regras mudarem.
export const PLAN_COVERAGE: Record<PlanId, Partial<Record<ServiceId, Quota>>> = {
  bronze: {
    banho_tosa: 1,
    consulta: 1, // atendimento veterinário básico
    emergencia: 'ilimitado', // atendimento 24h
  },
  prata: {
    banho_tosa: 1,
    consulta: 2, // consultas presenciais limitadas
    vacinacao: 'ilimitado', // vacinas anuais inclusas
    emergencia: 'ilimitado',
  },
  ouro: {
    banho_tosa: 2,
    exames: 2,
    consulta: 'ilimitado',
    vacinacao: 'ilimitado',
    leva_busca: 2,
    emergencia: 'ilimitado',
  },
  diamante: {
    banho_tosa: 2,
    exames: 2,
    consulta: 'ilimitado',
    vacinacao: 'ilimitado',
    leva_busca: 'ilimitado',
    emergencia: 'ilimitado',
  },
};

// O que cada plano inclui, em texto (igual aos banners).
// Usado no checkout e na aba Benefícios.
export type PlanFeature = { text: string; count: string };

export const PLAN_FEATURES: Record<PlanId, PlanFeature[]> = {
  bronze: [
    { text: 'Banho e Tosa', count: '1x/mês' },
    { text: 'Atendimento veterinário básico', count: '1x/mês' },
    { text: 'Histórico de vacinas digital', count: 'Incluso' },
    { text: 'Atendimento 24h', count: 'Incluso' },
    { text: 'Desconto em medicamentos', count: '10%' },
  ],
  prata: [
    { text: 'Banho e Tosa', count: '1x/mês' },
    { text: 'Consultas presenciais', count: '2x/mês' },
    { text: 'Vacinas anuais', count: 'Inclusas' },
    { text: 'Atendimento 24h', count: 'Incluso' },
    { text: 'Desconto em medicamentos', count: '15%' },
  ],
  ouro: [
    { text: 'Banho e Tosa', count: '2x/mês' },
    { text: 'Exames de rotina', count: '2x/mês' },
    { text: 'Consultas presenciais', count: 'Ilimitadas' },
    { text: 'Vacinas anuais', count: 'Inclusas' },
    { text: 'Leva & Traz Pet', count: '2x/mês' },
    { text: 'Atendimento 24h', count: 'Incluso' },
    { text: 'Desconto em medicamentos', count: '20%' },
  ],
  diamante: [
    { text: 'Banho e Tosa', count: '2x/mês' },
    { text: 'Consultas presenciais', count: 'Ilimitadas' },
    { text: 'Exames de rotina', count: '2x/mês' },
    { text: 'Vacinas anuais', count: 'Inclusas' },
    { text: 'Leva & Traz Pet', count: 'Ilimitado' },
    { text: 'Atendimento 24h', count: 'Incluso' },
    { text: 'Desconto em medicamentos', count: '15%' },
  ],
};

// Desconto em medicamentos, como nos banners.
export const PLAN_MEDICINE_DISCOUNT: Record<PlanId, number> = {
  bronze: 10,
  prata: 15,
  ouro: 20,
  diamante: 15,
};

// Preços por mês, iguais aos dos banners e do checkout (PrivatePlansScreen.tsx).
// Se mudar um preço lá, mude aqui também.
export const PLAN_PRICES: Record<'monthly' | 'yearly', Record<PlanId, number>> = {
  monthly: {
    bronze: 139.9,
    prata: 219.9,
    ouro: 399.9,
    diamante: 649.9,
  },
  yearly: {
    bronze: 119.9,
    prata: 179.9,
    ouro: 349.9,
    diamante: 549.9,
  },
};

export type BillingCycle = 'monthly' | 'yearly';

// Valor por mês no ciclo escolhido.
export function getMonthlyPrice(planId: PlanId, cycle: BillingCycle): number {
  return PLAN_PRICES[cycle][planId];
}

// Valor cobrado por ciclo (1 mês ou 12 meses), como no checkout.
export function getCyclePrice(planId: PlanId, cycle: BillingCycle): number {
  const monthly = getMonthlyPrice(planId, cycle);
  return cycle === 'yearly' ? Math.round(monthly * 12 * 100) / 100 : monthly;
}

// O que muda na cobertura ao trocar de plano.
export function getCoverageChanges(from: PlanId, to: PlanId) {
  const gains: string[] = [];
  const losses: string[] = [];
  SERVICES.forEach((service) => {
    const before = PLAN_COVERAGE[from][service.id];
    const after = PLAN_COVERAGE[to][service.id];
    const name = service.name;
    if (before === after) return;
    if (before === undefined && after !== undefined) gains.push(name);
    else if (after === undefined && before !== undefined) losses.push(name);
    else if (after === 'ilimitado') gains.push(`${name} ilimitado`);
    else if (before === 'ilimitado') losses.push(`${name} ${after}x/mês`);
    else if (typeof before === 'number' && typeof after === 'number') {
      if (after > before) gains.push(`+${after - before} ${name.toLowerCase()}`);
      else losses.push(`${before - after} ${name.toLowerCase()} a menos`);
    }
  });
  return { gains, losses };
}

// Converte o nome salvo no pet ("Plano Ouro", "ouro"...) no id do plano.
export function getPlanId(planName?: string | null): PlanId | null {
  if (!planName) return null;
  const normalized = planName.toLowerCase();
  return PLAN_ORDER.find((id) => normalized.includes(id)) ?? null;
}

export function getServiceQuota(planId: PlanId | null, serviceId: ServiceId): Quota | null {
  if (!planId) return null;
  return PLAN_COVERAGE[planId][serviceId] ?? null;
}

// Plano mais barato que cobre o serviço.
export function getMinimumPlan(serviceId: ServiceId): PlanId | null {
  return PLAN_ORDER.find((id) => PLAN_COVERAGE[id][serviceId] !== undefined) ?? null;
}