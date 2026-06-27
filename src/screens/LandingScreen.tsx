import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Landing'>;
};

export default function LandingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.topbar}>
          <Text style={styles.logo}>
            Killa <Text style={styles.logoAccent}>Vet</Text>
          </Text>
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>🐾 Clínica</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.imageWrapper}>
            <View style={styles.circleBg} />
            <Image
              source={require('../../assets/killa.png')}
              style={styles.dogImage}
              resizeMode="contain"
            />
            <View style={[styles.floatingDot, styles.dot1]}>
              <Text style={styles.floatingEmoji}>❤️</Text>
            </View>
            <View style={[styles.floatingDot, styles.dot2]}>
              <Text style={styles.floatingEmoji}>⭐</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            {'Bienvenido a\n'}<Text style={styles.heroBrand}>Killa Vet</Text>
          </Text>
          <Text style={styles.heroSub}>
            Tu clínica veterinaria de confianza para el cuidado integral de tus mascotas
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>90+</Text>
            <Text style={styles.statLabel}>Mascotas{'\n'}felices</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>5</Text>
            <Text style={styles.statLabel}>Años de{'\n'}experiencia</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>14</Text>
            <Text style={styles.statLabel}>Citas{'\n'}agendadas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>24/7</Text>
            <Text style={styles.statLabel}>Atención de{'\n'}emergencia</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('RegisterPatient')}
            activeOpacity={0.82}
          >
            <Text style={styles.btnPrimaryIcon}>🗓️</Text>
            <Text style={styles.btnPrimaryText}>Agendar una cita</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.82}
          >
            <Text style={styles.btnOutlineText}>Acceso veterinario  →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contáctanos</Text>

          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📞</Text>
            <View>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>(01) 954-321-987</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>✉️</Text>
            <View>
              <Text style={styles.contactLabel}>Correo</Text>
              <Text style={styles.contactValue}>contacto@killavet.com</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>🕐</Text>
            <View>
              <Text style={styles.contactLabel}>Horario</Text>
              <Text style={styles.contactValue}>Lun – Dom · 8:00 a.m. – 10:00 p.m.</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📍</Text>
            <View>
              <Text style={styles.contactLabel}>Dirección</Text>
              <Text style={styles.contactValue}>Calle Los Perritos 456, Lima, Perú</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const anchoTarjeta = (width - spacing.lg * 2 - spacing.sm) / 2;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 48,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDeep,
  },
  logoAccent: {
    color: colors.primary,
  },
  topBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  topBadgeText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  imageWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  circleBg: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primaryLight,
  },
  dogImage: {
    width: 165,
    height: 165,
    zIndex: 1,
  },
  floatingDot: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },
  dot1: { top: 8, right: 8 },
  dot2: { bottom: 16, left: 8 },
  floatingEmoji: { fontSize: 16 },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDeep,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 10,
  },
  heroBrand: {
    color: colors.primary,
  },
  heroSub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: anchoTarjeta,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNum: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  btnPrimaryIcon: { fontSize: 18 },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnOutlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  contactCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDeep,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  contactIcon: { fontSize: 18, marginTop: 1 },
  contactLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 13,
    color: colors.primaryDeep,
    fontWeight: '600',
  },
});
