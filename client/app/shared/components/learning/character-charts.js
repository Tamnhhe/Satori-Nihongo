/**
 * Japanese Character Chart Component
 * Displays Hiragana, Katakana, Kanji characters in a grid layout
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Card, useTheme, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Character Item Component
const CharacterItem = ({ character, romanji, sound, meaning, level, onPress, theme }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 12,
      margin: 4,
      minWidth: 80,
      minHeight: 100,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }}
  >
    {/* Main Character */}
    <Text
      style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 4,
      }}
    >
      {character}
    </Text>

    {/* Romanji */}
    <Text
      style={{
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        fontWeight: '500',
        marginBottom: 2,
      }}
    >
      {romanji}
    </Text>

    {/* Sound (for Hiragana/Katakana) */}
    {sound && (
      <Text
        style={{
          fontSize: 10,
          color: theme.colors.onSurfaceVariant,
          fontStyle: 'italic',
        }}
      >
        {sound}
      </Text>
    )}

    {/* Meaning (for Kanji) */}
    {meaning && (
      <Text
        style={{
          fontSize: 10,
          color: theme.colors.secondary,
          textAlign: 'center',
          marginTop: 4,
        }}
      >
        {meaning}
      </Text>
    )}

    {/* Level indicator for Kanji */}
    {level && (
      <Chip
        mode="outlined"
        compact
        style={{
          marginTop: 4,
          height: 20,
        }}
        textStyle={{ fontSize: 8 }}
      >
        {level}
      </Chip>
    )}
  </TouchableOpacity>
);

// Hiragana Chart Component
export const HiraganaChart = ({ data, onCharacterPress }) => {
  const theme = useTheme();

  return (
    <Card style={{ margin: 16, backgroundColor: theme.colors.surface }} elevation={4}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <MaterialCommunityIcons
            name="script-text"
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
            Bảng chữ cái Hiragana
          </Text>
        </View>

        <Text
          style={{
            color: theme.colors.onSurfaceVariant,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          Chữ cái cơ bản của tiếng Nhật, dùng cho từ thuần Nhật
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {data.map((item, index) => (
            <CharacterItem
              key={index}
              character={item.character}
              romanji={item.romanji}
              sound={item.sound}
              onPress={() => onCharacterPress?.(item)}
              theme={theme}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

// Katakana Chart Component
export const KatakanaChart = ({ data, onCharacterPress }) => {
  const theme = useTheme();

  return (
    <Card style={{ margin: 16, backgroundColor: theme.colors.surface }} elevation={4}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <MaterialCommunityIcons
            name="format-text"
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
            Bảng chữ cái Katakana
          </Text>
        </View>

        <Text
          style={{
            color: theme.colors.onSurfaceVariant,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          Dùng cho từ ngoại lai và từ đồng âm
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {data.map((item, index) => (
            <CharacterItem
              key={index}
              character={item.character}
              romanji={item.romanji}
              sound={item.sound}
              onPress={() => onCharacterPress?.(item)}
              theme={theme}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

// Kanji Chart Component
export const KanjiChart = ({ data, onCharacterPress }) => {
  const theme = useTheme();

  return (
    <Card style={{ margin: 16, backgroundColor: theme.colors.surface }} elevation={4}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
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
            Chữ Hán cơ bản (Kanji)
          </Text>
        </View>

        <Text
          style={{
            color: theme.colors.onSurfaceVariant,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          Chữ Hán được sử dụng trong tiếng Nhật
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {data.map((item, index) => (
            <CharacterItem
              key={index}
              character={item.character}
              romanji={item.romanji}
              meaning={item.meaning}
              level={item.level}
              onPress={() => onCharacterPress?.(item)}
              theme={theme}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

export default {
  HiraganaChart,
  KatakanaChart,
  KanjiChart,
};
