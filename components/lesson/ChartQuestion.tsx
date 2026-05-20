import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { CandlestickChart, LineChart } from 'react-native-gifted-charts';

import { colors, spacing, typography } from '../../constants/theme';
import type { QuestionChartData } from '../../types';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - spacing.lg * 2 - 32; // padding inside card

interface Props {
  chartData: QuestionChartData;
}

export default function ChartQuestion({ chartData }: Props) {
  return (
    <View style={styles.card}>
      {chartData.title && <Text style={styles.chartTitle}>{chartData.title}</Text>}
      <View style={styles.chartWrap}>
        {chartData.type === 'candlestick' && chartData.candleData ? (
          <CandlestickChart
            data={chartData.candleData}
            width={CHART_W}
            candleWidth={24}
            candleInBetweenSpace={10}
            bullColor={colors.bullGreen}
            bearColor={colors.bearRed}
            lineColor={colors.textSecondary}
            wickColor={colors.textSecondary}
            yAxisColor={colors.border}
            xAxisColor={colors.border}
            yAxisTextStyle={styles.axisText}
            initialSpacing={8}
            endSpacing={8}
            hideDataPoints
            noOfSections={4}
            rulesType="dashed"
            rulesColor={colors.border}
          />
        ) : chartData.type === 'line' && chartData.lineData ? (
          <LineChart
            data={chartData.lineData}
            width={CHART_W}
            height={160}
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
            // Reference lines for support / resistance
            showReferenceLine1={chartData.referenceLines !== undefined && chartData.referenceLines.length >= 1}
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
            showReferenceLine2={chartData.referenceLines !== undefined && chartData.referenceLines.length >= 2}
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

      {/* Legend for reference lines */}
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
  },
  chartWrap: {
    alignItems: 'center',
  },
  axisText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDash: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
});
