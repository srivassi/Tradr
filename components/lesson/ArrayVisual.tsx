import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import type { QuestionArrayData, ArrayHighlight } from '../../types';

interface Props {
  arrayData: QuestionArrayData;
}

const CELL = 44;
const CELL_GAP = 6;

const HL: Record<ArrayHighlight, { bg: string; border: string; text: string }> = {
  primary:  { bg: '#DDF4FF', border: colors.navy,    text: colors.navy },
  secondary:{ bg: '#FFF8E1', border: '#F59E0B',      text: '#92400E' },
  window:   { bg: '#F0FBE4', border: colors.primary, text: '#166534' },
  match:    { bg: '#D7FFB8', border: colors.primary, text: colors.primaryDark },
  inactive: { bg: colors.surface, border: colors.border, text: colors.textSecondary },
};

export default function ArrayVisual({ arrayData }: Props) {
  return (
    <View style={styles.card}>
      {arrayData.title && <Text style={styles.title}>{arrayData.title}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {arrayData.elements.map((el, i) => {
            const hl = HL[el.highlight ?? 'inactive'];
            return (
              <View key={i} style={styles.col}>
                <Text style={[styles.pointer, { color: el.pointer ? hl.border : 'transparent' }]}>
                  {el.pointer ?? '.'}
                </Text>
                <View style={[styles.cell, { backgroundColor: hl.bg, borderColor: hl.border }]}>
                  <Text style={[styles.val, { color: hl.text }]}>{el.value}</Text>
                </View>
                <Text style={styles.idx}>{i}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.navy + '40',
    marginBottom: spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  title: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: CELL_GAP,
    alignItems: 'flex-end',
    paddingBottom: 4,
  },
  col: { alignItems: 'center', gap: 3 },
  pointer: { fontSize: 10, fontWeight: '800', letterSpacing: 0.2 },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  val: { fontSize: typography.sm, fontWeight: '800' },
  idx: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },
});
