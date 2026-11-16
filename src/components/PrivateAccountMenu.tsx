import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PrivateAccountMenuProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  profileImage?: string | null;

  onNavigateToProfile?: () => void;
  onNavigateToPets?: () => void;
  onNavigateToConsultations?: () => void;
  onNavigateToPersonalData?: () => void;
  onNavigateToPaymentMethods?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToSecurity?: () => void;
  onNavigateToHelp?: () => void;
  onLogout?: () => void;
}

export default function PrivateAccountMenu({
  visible,
  onClose,
  userName,
  userEmail,
  profileImage,
  onNavigateToProfile,
  onNavigateToPets,
  onNavigateToConsultations,
  onNavigateToPersonalData,
  onNavigateToPaymentMethods,
  onNavigateToNotifications,
  onNavigateToSecurity,
  onNavigateToHelp,
  onLogout,
}: PrivateAccountMenuProps) {

  const initial = userName?.trim()
    ? userName.trim().charAt(0).toUpperCase()
    : 'U';

  const navigate = (action?: () => void) => {
    onClose();
    action?.();
  };

  const renderItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    action?: () => void,
  ) => (
    <TouchableOpacity
      key={title}
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={() => navigate(action)}
    >
      <View style={styles.menuItemIcon}>
        <Ionicons name={icon} size={20} color="#183C98" />
      </View>

      <Text style={styles.menuItemText}>{title}</Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#A0A9B8"
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar />

      <View style={styles.modalContainer}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Minha conta</Text>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Dados do usuário */}
            <TouchableOpacity
              style={styles.profileCard}
              activeOpacity={0.8}
              onPress={() => navigate(onNavigateToProfile)}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
              )}

              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userEmail}>{userEmail}</Text>
                <Text style={styles.viewProfile}>Ver meu perfil</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>

            {/* Atalhos */}
            <Text style={styles.sectionTitle}>MEUS ATALHOS</Text>

            <View style={styles.shortcuts}>
              <TouchableOpacity
                style={styles.shortcut}
                activeOpacity={0.7}
                onPress={() => navigate(onNavigateToPets)}
              >
                <View style={styles.shortcutIcon}>
                  <Ionicons name="paw-outline" size={23} color="#183C98" />
                </View>
                <Text style={styles.shortcutTitle}>Meus Pets</Text>
                <Text style={styles.shortcutSubtitle}>Animais cadastrados</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shortcut}
                activeOpacity={0.7}
                onPress={() => navigate(onNavigateToConsultations)}
              >
                <View style={styles.shortcutIcon}>
                  <Ionicons name="calendar-outline" size={23} color="#183C98" />
                </View>
                <Text style={styles.shortcutTitle}>Consultas</Text>
                <Text style={styles.shortcutSubtitle}>Meus agendamentos</Text>
              </TouchableOpacity>
            </View>

            {/* Configurações */}
            <Text style={styles.sectionTitle}>CONTA E PREFERÊNCIAS</Text>

            <View style={styles.menuGroup}>
              {renderItem(
                'person-outline',
                'Dados pessoais',
                onNavigateToPersonalData,
              )}

              {renderItem(
                'card-outline',
                'Formas de pagamento',
                onNavigateToPaymentMethods,
              )}

              {renderItem(
                'notifications-outline',
                'Notificações',
                onNavigateToNotifications,
              )}

              {renderItem(
                'shield-checkmark-outline',
                'Segurança',
                onNavigateToSecurity,
              )}
            </View>

            {/* Ajuda */}
            <Text style={styles.sectionTitle}>PRECISA DE AJUDA?</Text>

            <View style={styles.menuGroup}>
              {renderItem(
                'headset-outline',
                'Ajuda e suporte',
                onNavigateToHelp,
              )}
            </View>

            {/* Sair */}
            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.7}
              onPress={() => navigate(onLogout)}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#DC2626"
              />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>

            <Text style={styles.version}>
              PetVitaliz · Sua saúde, nosso cuidado.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,42,0.48)',
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '88%',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  handle: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D7DDE7',
    alignSelf: 'center',
    marginBottom: 18,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#17233F',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingBottom: 12,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 17,
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderColor: '#E9EDF4',
    marginBottom: 25,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EAB308',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 13,
  },

  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17233F',
  },

  userEmail: {
    fontSize: 12,
    color: '#718096',
    marginTop: 3,
  },

  viewProfile: {
    fontSize: 12,
    fontWeight: '600',
    color: '#183C98',
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#94A3B8',
    marginBottom: 12,
  },

  shortcuts: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },

  shortcut: {
    flex: 1,
    padding: 13,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    backgroundColor: '#FFFFFF',
  },

  shortcutIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  shortcutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#17233F',
  },

  shortcutSubtitle: {
    fontSize: 10,
    color: '#8994A6',
    marginTop: 4,
  },

  menuGroup: {
    borderWidth: 1,
    borderColor: '#E9EDF4',
    borderRadius: 15,
    paddingHorizontal: 12,
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 57,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F6',
  },

  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  menuItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: '#FFF5F5',
    marginTop: 2,
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },

  version: {
    textAlign: 'center',
    fontSize: 10,
    color: '#A0A9B8',
    marginTop: 18,
  },
});