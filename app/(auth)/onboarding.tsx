import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import { MARKETS } from '../../constants/markets';
import { LANGUAGES } from '../../constants/languages';
import type { MarketId, LanguageId, TrackId } from '../../types';

const MARKET_DESCRIPTIONS: Record<MarketId, string> = {
  india: 'Nifty 50, SENSEX, SEBI & RBI',
  eu:    'DAX, CAC 40, ECB & Euronext',
  us:    'S&P 500, NASDAQ, Fed & SEC',
};

const TRACKS: { id: TrackId; icon: string; label: string; sub: string }[] = [
  { id: 'tradr', icon: '📈', label: 'Tradr', sub: 'Master the markets — India 🇮🇳 · EU 🇪🇺 · US 🇺🇸' },
  { id: 'codr',  icon: '💻', label: 'Codr',  sub: 'Ace your interviews — Python 🐍 · Java ☕' },
];

export default function OnboardingScreen() {
  const [step, setStep]               = useState<0 | 1>(0);
  const [selectedTrack, setSelectedTrack]       = useState<TrackId | null>(null);
  const [selectedMarket, setSelectedMarket]     = useState<MarketId | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId | null>(null);

  const setTrack    = useUserStore((s) => s.setTrack);
  const setMarket   = useUserStore((s) => s.setMarket);
  const setLanguage = useUserStore((s) => s.setLanguage);

  function handleTrackContinue() {
    if (!selectedTrack) return;
    setTrack(selectedTrack);
    setStep(1);
  }

  function handleFinalContinue() {
    if (selectedTrack === 'tradr' && !selectedMarket) return;
    if (selectedTrack === 'codr'  && !selectedLanguage) return;

    if (selectedMarket)   setMarket(selectedMarket);
    if (selectedLanguage) setLanguage(selectedLanguage);
    router.push('/(auth)/signup');
  }

  if (step === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>What do you want to master?</Text>
          <Text style={styles.subtitle}>
            Pick a track — or do both. You can switch later.
          </Text>

          {TRACKS.map((track) => {
            const isSelected = selectedTrack === track.id;
            return (
              <TouchableOpacity
                key={track.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedTrack(track.id)}
                activeOpacity={0.8}
                accessibilityLabel={`Select ${track.label} track`}
              >
                <Text style={styles.trackIcon}>{track.icon}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {track.label}
                  </Text>
                  <Text style={styles.cardSub}>{track.sub}</Text>
                </View>
                {isSelected && <Text style={styles.tick}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnGreen, !selectedTrack && styles.btnDisabled]}
            onPress={handleTrackContinue}
            disabled={!selectedTrack}
            activeOpacity={0.8}
            accessibilityLabel="Continue to next step"
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Step 1 — market picker (Tradr) or language picker (Codr)
  if (selectedTrack === 'tradr') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(0)} activeOpacity={0.7}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Pick your market</Text>
          <Text style={styles.subtitle}>
            Every lesson, chart, and scenario will be tailored to it. You can change this later.
          </Text>

          {(Object.keys(MARKETS) as MarketId[]).map((id) => {
            const market = MARKETS[id];
            const isSelected = selectedMarket === id;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedMarket(id)}
                activeOpacity={0.8}
                accessibilityLabel={`Select ${market.label} market`}
              >
                <Text style={styles.flag}>{market.flag}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {market.label}
                  </Text>
                  <Text style={styles.cardSub}>{MARKET_DESCRIPTIONS[id]}</Text>
                </View>
                {isSelected && <Text style={styles.tick}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnGreen, !selectedMarket && styles.btnDisabled]}
            onPress={handleFinalContinue}
            disabled={!selectedMarket}
            activeOpacity={0.8}
            accessibilityLabel="Continue to sign up"
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Codr — language selection
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(0)} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Pick your language</Text>
        <Text style={styles.subtitle}>
          Questions and patterns will use your language's syntax. You can switch later.
        </Text>

        {(Object.keys(LANGUAGES) as LanguageId[]).map((id) => {
          const lang = LANGUAGES[id];
          const isSelected = selectedLanguage === id;
          return (
            <TouchableOpacity
              key={id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setSelectedLanguage(id)}
              activeOpacity={0.8}
              accessibilityLabel={`Select ${lang.label}`}
            >
              <Text style={styles.flag}>{lang.icon}</Text>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {lang.label}
                </Text>
                <Text style={styles.cardSub}>{lang.description}</Text>
              </View>
              {isSelected && <Text style={styles.tick}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnGreen, !selectedLanguage && styles.btnDisabled]}
          onPress={handleFinalContinue}
          disabled={!selectedLanguage}
          activeOpacity={0.8}
          accessibilityLabel="Continue to sign up"
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#FFFFFF' },
  scroll:        { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 12 },

  backBtn:  { marginBottom: 16 },
  backText: { fontSize: 15, color: '#AFAFAF', fontWeight: '600' },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3C3C3C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#AFAFAF',
    lineHeight: 20,
    marginBottom: 24,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#F7F7F7',
    minHeight: 80,
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: '#58CC02',
    backgroundColor: '#F0FBE4',
  },

  trackIcon: { fontSize: 36, marginRight: 16 },
  flag:      { fontSize: 36, marginRight: 16 },
  cardText:  { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C3C3C',
  },
  cardTitleSelected: { color: '#58CC02' },
  cardSub: {
    fontSize: 12,
    color: '#AFAFAF',
    marginTop: 2,
    lineHeight: 16,
  },
  tick: {
    fontSize: 20,
    color: '#58CC02',
    fontWeight: '700',
  },

  footer: {
    padding: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  btnGreen: {
    backgroundColor: '#58CC02',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#E5E5E5',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
