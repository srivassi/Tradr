import { Text, Platform } from 'react-native';
import type { TextStyle, StyleProp } from 'react-native';

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
  codeStyle?: StyleProp<TextStyle>;
}

export default function FormattedText({ text, style, codeStyle }: Props) {
  const parts = text.split(/`([^`]+)`/);

  return (
    <Text style={style}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text
            key={i}
            style={[
              { fontFamily: MONO, fontSize: 13, color: '#D6336C', backgroundColor: '#FFF0F3' },
              codeStyle,
            ]}
          >
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
