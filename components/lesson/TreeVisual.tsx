import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import type { QuestionTreeData, TreeNodeData, TreeHighlight } from '../../types';

const SCREEN_W = Dimensions.get('window').width;
const CONTAINER_W = SCREEN_W - spacing.lg * 2 - 32;
const NODE_R = 18;
const LEVEL_H = 54;

const HL: Record<TreeHighlight, { bg: string; border: string; text: string }> = {
  primary:  { bg: '#DDF4FF', border: colors.navy,    text: colors.navy },
  secondary:{ bg: '#FFF8E1', border: '#F59E0B',      text: '#92400E' },
  visited:  { bg: '#D7FFB8', border: colors.primary, text: '#166534' },
};
const DEFAULT_NODE = { bg: colors.surface, border: colors.border, text: colors.textPrimary };

interface FlatNode { x: number; y: number; value: string | number; highlight?: TreeHighlight; id: string }
interface FlatEdge { x1: number; y1: number; x2: number; y2: number }

function flatten(
  node: TreeNodeData,
  x: number,
  y: number,
  step: number,
  nodes: FlatNode[],
  edges: FlatEdge[],
  id: string,
) {
  nodes.push({ x, y, value: node.value, highlight: node.highlight, id });
  const cy = y + LEVEL_H;
  if (node.left) {
    const lx = x - step;
    edges.push({ x1: x, y1: y + NODE_R, x2: lx, y2: cy - NODE_R });
    flatten(node.left, lx, cy, step / 2, nodes, edges, id + 'L');
  }
  if (node.right) {
    const rx = x + step;
    edges.push({ x1: x, y1: y + NODE_R, x2: rx, y2: cy - NODE_R });
    flatten(node.right, rx, cy, step / 2, nodes, edges, id + 'R');
  }
}

interface Props {
  treeData: QuestionTreeData;
}

export default function TreeVisual({ treeData }: Props) {
  const flatNodes: FlatNode[] = [];
  const flatEdges: FlatEdge[] = [];
  flatten(treeData.root, CONTAINER_W / 2, NODE_R, CONTAINER_W / 4, flatNodes, flatEdges, 'r');

  const maxY = Math.max(...flatNodes.map((n) => n.y)) + NODE_R + 4;

  return (
    <View style={styles.card}>
      {treeData.title && <Text style={styles.title}>{treeData.title}</Text>}
      <View style={[styles.tree, { height: maxY }]}>
        {flatEdges.map((e, i) => {
          const dx = e.x2 - e.x1;
          const dy = e.y2 - e.y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: (e.x1 + e.x2) / 2 - len / 2,
                top: (e.y1 + e.y2) / 2 - 1,
                width: len,
                height: 2,
                backgroundColor: colors.border,
                transform: [{ rotate: `${angle}deg` }],
              }}
            />
          );
        })}
        {flatNodes.map((n) => {
          const hl = n.highlight ? HL[n.highlight] : DEFAULT_NODE;
          return (
            <View
              key={n.id}
              style={[
                styles.node,
                {
                  left: n.x - NODE_R,
                  top: n.y - NODE_R,
                  backgroundColor: hl.bg,
                  borderColor: hl.border,
                },
              ]}
            >
              <Text style={[styles.nodeText, { color: hl.text }]}>{n.value}</Text>
            </View>
          );
        })}
      </View>
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
  tree: { width: '100%' },
  node: {
    position: 'absolute',
    width: NODE_R * 2,
    height: NODE_R * 2,
    borderRadius: NODE_R,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeText: { fontSize: 13, fontWeight: '800' },
});
