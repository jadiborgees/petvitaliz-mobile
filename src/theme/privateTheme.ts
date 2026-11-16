// Padrão visual das telas privadas, baseado na tela Meu Plano
// e nas cores dos banners dos planos.
// Mude aqui para alterar a cor ou a fonte de todas as telas que usam o padrão.

export const theme = {
  colors: {
    primary: '#183C98', // azul dos banners: botões, ícones, links e valores
    navy: '#183B72', // azul-marinho: títulos e cabeçalho
    primarySoft: '#E8EEFA', // fundo de ícones e destaques suaves
    text: '#183B72', // texto principal (mesmo azul-marinho dos títulos)
    textSecondary: '#52627D', // texto de apoio
    muted: '#71809A', // legendas e textos pequenos
    border: '#E8EDF5', // bordas de cards
    divider: '#EEF1F6', // linha do cabeçalho e separadores
    background: '#F6F8FC', // fundo das telas (cinza bem claro)
    card: '#FFFFFF', // fundo dos cards
    brandYellow: '#FECA3E', // amarelo dos banners (botões de destaque)
    brandTeal: '#7BB9B2', // verde-água do fundo dos banners
    danger: '#DC2626',
    success: '#16865B',
    warning: '#B45309',
  },
  fonts: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semibold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
  },
  radius: {
    card: 16,
    bigCard: 20,
    button: 12,
  },
};