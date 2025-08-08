/**
 * Vocabulary and Grammar Components
 * Displays vocabulary words and grammar patterns
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Card, useTheme, Chip, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Vocabulary Item Component
const VocabularyItem = ({ japanese, romanji, meaning, category, onPress, theme }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      marginHorizontal: 4,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    }}
  >
    <View
      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}
    >
      <View style={{ flex: 1 }}>
        {/* Japanese Text */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.primary,
            marginBottom: 4,
          }}
        >
          {japanese}
        </Text>

        {/* Romanji */}
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            fontStyle: 'italic',
            marginBottom: 6,
          }}
        >
          {romanji}
        </Text>

        {/* Meaning */}
        <Text
          style={{
            fontSize: 16,
            color: theme.colors.onSurface,
            fontWeight: '500',
          }}
        >
          {meaning}
        </Text>
      </View>

      {/* Category Chip */}
      <Chip
        mode="outlined"
        compact
        style={{
          marginLeft: 8,
        }}
        textStyle={{ fontSize: 10 }}
      >
        {category}
      </Chip>
    </View>
  </TouchableOpacity>
);

// Grammar Pattern Item Component
const GrammarPatternItem = ({
  pattern,
  romanji,
  meaning,
  example,
  exampleRomanji,
  exampleMeaning,
  level,
  onPress,
  theme,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      marginHorizontal: 4,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.secondary,
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        {/* Pattern */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.secondary,
            marginBottom: 4,
          }}
        >
          {pattern}
        </Text>

        {/* Romanji */}
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            fontStyle: 'italic',
            marginBottom: 6,
          }}
        >
          {romanji}
        </Text>

        {/* Meaning */}
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.onSurface,
            fontWeight: '500',
          }}
        >
          {meaning}
        </Text>
      </View>

      {/* Level Chip */}
      <Chip
        mode="outlined"
        compact
        style={{
          marginLeft: 8,
        }}
        textStyle={{ fontSize: 10 }}
      >
        {level}
      </Chip>
    </View>

    {/* Example Section */}
    <Divider style={{ marginVertical: 8 }} />
    <View style={{ backgroundColor: theme.colors.background, padding: 8, borderRadius: 8 }}>
      <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
        Ví dụ:
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: theme.colors.primary,
          marginBottom: 2,
        }}
      >
        {example}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.onSurfaceVariant,
          fontStyle: 'italic',
          marginBottom: 2,
        }}
      >
        {exampleRomanji}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.colors.onSurface,
        }}
      >
        {exampleMeaning}
      </Text>
    </View>
  </TouchableOpacity>
);

// Vocabulary Chart Component
export const VocabularyChart = ({ data, onWordPress }) => {
  const theme = useTheme();

  // Group vocabulary by category
  const groupedVocabulary = data.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <Card style={{ margin: 16, backgroundColor: theme.colors.surface }} elevation={4}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <MaterialCommunityIcons
            name="forum"
            size={24}
            color={theme.colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.colors.onSurface,
            }}
          >
            Từ vựng cơ bản
          </Text>
        </View>

        <Text
          style={{
            color: theme.colors.onSurfaceVariant,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          Những từ vựng thiết yếu trong tiếng Nhật
        </Text>

        {Object.entries(groupedVocabulary).map(([category, words]) => (
          <View key={category} style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: theme.colors.secondary,
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              {category}
            </Text>
            {words.map((item, index) => (
              <VocabularyItem
                key={`${category}-${index}`}
                japanese={item.japanese}
                romanji={item.romanji}
                meaning={item.meaning}
                category={item.category}
                onPress={() => onWordPress?.(item)}
                theme={theme}
              />
            ))}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

// Grammar Chart Component
export const GrammarChart = ({ data, onPatternPress }) => {
  const theme = useTheme();

  return (
    <Card style={{ margin: 16, backgroundColor: theme.colors.surface }} elevation={4}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <MaterialCommunityIcons
            name="book-alphabet"
            size={24}
            color={theme.colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.colors.onSurface,
            }}
          >
            Ngữ pháp cơ bản
          </Text>
        </View>

        <Text
          style={{
            color: theme.colors.onSurfaceVariant,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          Các mẫu câu và ngữ pháp thường dùng
        </Text>

        {data.map((item, index) => (
          <GrammarPatternItem
            key={index}
            pattern={item.pattern}
            romanji={item.romanji}
            meaning={item.meaning}
            example={item.example}
            exampleRomanji={item.exampleRomanji}
            exampleMeaning={item.exampleMeaning}
            level={item.level}
            onPress={() => onPatternPress?.(item)}
            theme={theme}
          />
        ))}
      </Card.Content>
    </Card>
  );
};

export default {
  VocabularyChart,
  GrammarChart,
};
