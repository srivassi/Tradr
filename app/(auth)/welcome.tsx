import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pip from '../../components/pip/Pip';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.top}>
          <Text style={styles.logo}>mastr</Text>
          <Text style={styles.tagline}>Master finance. Ace interviews.</Text>
        </View>

        <View style={styles.middle}>
          <View style={styles.pipContainer}>
            <Pip level={1} mood="idle" size={160} />
          </View>
          <View style={styles.tracks}>
            <View style={styles.trackPill}>
              <Text style={styles.trackIcon}>📈</Text>
              <Text style={styles.trackLabel}>Tradr</Text>
            </View>
            <Text style={styles.trackSep}>+</Text>
            <View style={styles.trackPill}>
              <Text style={styles.trackIcon}>💻</Text>
              <Text style={styles.trackLabel}>Codr</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.btnGreen}
            onPress={() => router.push('/(auth)/onboarding')}
            activeOpacity={0.8}
            accessibilityLabel="Create an account"
          >
            <Text style={styles.btnGreenText}>Get started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnGhost}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
            accessibilityLabel="Log in to existing account"
          >
            <Text style={styles.btnGhostText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 24 },

  top: {
    alignItems: 'center',
    paddingTop: 48,
  },
  logo: {
    fontSize: 52,
    fontWeight: '900',
    color: '#58CC02',
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 16,
    color: '#AFAFAF',
    marginTop: 8,
    textAlign: 'center',
  },

  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  pipContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tracks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  trackIcon:  { fontSize: 18 },
  trackLabel: { fontSize: 15, fontWeight: '800', color: '#3C3C3C' },
  trackSep:   { fontSize: 18, fontWeight: '900', color: '#AFAFAF' },

  bottom: {
    paddingBottom: 24,
  },
  btnGreen: {
    backgroundColor: '#58CC02',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#58A700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  btnGreenText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  btnGhost: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnGhostText: {
    color: '#AFAFAF',
    fontSize: 14,
    fontWeight: '600',
  },
});
