import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { colors, spacing, typography } from '../../constants/theme';
import type { CandlePoint, QuestionChartData } from '../../types';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - spacing.lg * 2 - 32;
const CHART_H = 160;

// ─── Custom candlestick renderer ────────────────────────────────────────────

function CandlestickView({ data }: { data: CandlePoint[] }) {
  const allPrices = data.flatMap((c) => [c.high, c.low]);
  const minY = Math.min(...allPrices);
  const maxY = Math.max(...allPrices);
  const range = maxY - minY || 1;

  const slotW = CHART_W / data.length;
  const candleW = Math.max(4, Math.min(16, slotW - 6));

  function toY(v: number) {
    return CHART_H - ((v - minY) / range) * CHART_H;
  }

  return (
    <View style={{ width: CHART_W, height: CHART_H }}>
      {data.map((c, i) => {
        const bull = c.close >= c.open;
        const col = bull ? colors.bullGreen : colors.bearRed;
        const cx = i * slotW + slotW / 2;
        const bodyTop = toY(Math.max(c.open, c.close));
        const bodyH = Math.max(2, toY(Math.min(c.open, c.close)) - bodyTop);
        const highY = toY(c.high);
        const lowY = toY(c.low);
        return (
          <View key={i}>
            {/* wick */}
            <View style={{
              position: 'absolute',
              left: cx - 1,
              top: highY,
              width: 2,
              height: lowY - highY,
              backgroundColor: col,
            }} />
            {/* body */}
            <View style={{
              position: 'absolute',
              left: cx - candleW / 2,
              top: bodyTop,
              width: candleW,
              height: bodyH,
              backgroundColor: col,
              borderRadius: 2,
            }} />
          </View>
        );
      })}
    </View>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

interface Props {
  chartData: QuestionChartData;
}

export default function ChartQuestion({ chartData }: Props) {
  return (
    <View style={styles.card}>
      {chartData.title && <Text style={styles.chartTitle}>{chartData.title}</Text>}
      <View style={styles.chartWrap}>
        {chartData.type === 'candlestick' && chartData.candleData ? (
          <CandlestickView data={chartData.candleData} />
        ) : chartData.type === 'line' && chartData.lineData ? (
          <LineChart
            data={chartData.lineData}
            width={CHART_W}
            height={CHART_H}
            color={colors.navy}
            thickness={2.5}
            dataPointsColor={colors.navy}
            dataPointsRadius={3}
            yAxisColor={colors.border}
            xAxisColor={colors.border}
            yAxisTextStyle={styles.axisText}
            initialSpacing={8}
            endSpacing={8}
            noOfSections={4}
            rulesType="dashed"
            rulesColor={colors.border}
            curved
            hideDataPoints={chartData.lineData.length > 12}
            showReferenceLine1={!!chartData.referenceLines?.[0]}
            referenceLine1Position={chartData.referenceLines?.[0]?.value}
            referenceLine1Config={
              chartData.referenceLines?.[0]
                ? {
                    color: chartData.referenceLines[0].color,
                    thickness: 2,
                    type: 'dashed',
                    dashWidth: 6,
                    dashGap: 4,
                    labelText: chartData.referenceLines[0].label,
                    labelTextStyle: {
                      color: chartData.referenceLines[0].color,
                      fontSize: 10,
                      fontWeight: '700',
                    },
                  }
                : undefined
            }
            showReferenceLine2={!!chartData.referenceLines?.[1]}
            referenceLine2Position={chartData.referenceLines?.[1]?.value}
            referenceLine2Config={
              chartData.referenceLines?.[1]
                ? {
                    color: chartData.referenceLines[1].color,
                    thickness: 2,
                    type: 'dashed',
                    dashWidth: 6,
                    dashGap: 4,
                    labelText: chartData.referenceLines[1].label,
                    labelTextStyle: {
                      color: chartData.referenceLines[1].color,
                      fontSize: 10,
                      fontWeight: '700',
                    },
                  }
                : undefined
            }
          />
        ) : null}
      </View>

      {chartData.referenceLines && chartData.referenceLines.length > 0 && (
        <View style={styles.legend}>
          {chartData.referenceLines.map((ref) => (
            <View key={ref.label} style={styles.legendItem}>
              <View style={[styles.legendDash, { backgroundColor: ref.color }]} />
              <Text style={[styles.legendLabel, { color: ref.color }]}>{ref.label}</Text>
            </View>
          ))}
        </View>
      )}
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
  chartTitle: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chartWrap: { alignItems: 'center' },
  axisText:  { color: colors.textSecondary, fontSize: 10 },
  legend:     { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDash: { width: 16, height: 2, borderRadius: 1 },
  legendLabel:{ fontSize: 11, fontWeight: '700' },
});
