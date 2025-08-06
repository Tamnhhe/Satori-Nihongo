/**
 * Japanese Learning Screen
 * Main screen for displaying character charts and vocabulary
 */

import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Text, useTheme, SegmentedButtons, FAB } from 'react-native-paper';
import {
  HiraganaChart,
  KatakanaChart,
  KanjiChart,
} from '../../shared/components/learning/character-charts';
import {
  VocabularyChart,
  GrammarChart,
} from '../../shared/components/learning/vocabulary-grammar-charts';
import {
  hiraganaData,
  katakanaData,
  basicKanjiData,
  basicVocabularyData,
  grammarPatterns,
} from '../../shared/data/japanese-learning-data';

const JapaneseLearningScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const categoryFromParams = route?.params?.categoryKey || 'hiragana';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromParams);

  // Handle character press for pronunciation
  const handleCharacterPress = (character) => {
    let message = '';

    if (character.sound) {
      // For Hiragana/Katakana
      message =
        `${character.character}\n\n` +
        `Romanji: ${character.romanji}\n` +
        `Phát âm: ${character.sound}\n\n` +
        `Tip: Hãy luyện tập viết và phát âm chữ này nhiều lần!`;
    } else if (character.meaning) {
      // For Kanji
      message =
        `${character.character}\n\n` +
        `Đọc âm: ${character.romanji}\n` +
        `Nghĩa: ${character.meaning}\n` +
        `Cấp độ: ${character.level}\n\n` +
        `Hãy nhớ cách viết và nghĩa của chữ Hán này!`;
    }

    Alert.alert('Chi tiết chữ cái', message, [
      { text: 'Đóng', style: 'cancel' },
      {
        text: 'Luyện tập',
        onPress: () => {
          console.log('Practice character:', character);
          // Navigate to practice screen (future feature)
        },
      },
    ]);
  };

  // Handle vocabulary press
  const handleVocabularyPress = (word) => {
    const message =
      `${word.japanese}\n\n` +
      `Romanji: ${word.romanji}\n` +
      `Nghĩa: ${word.meaning}\n` +
      `Danh mục: ${word.category}\n\n` +
      `Hãy luyện tập phát âm và nhớ nghĩa của từ này!`;

    Alert.alert('Chi tiết từ vựng', message, [
      { text: 'Đóng', style: 'cancel' },
      {
        text: 'Thêm vào flashcard',
        onPress: () => {
          console.log('Add to flashcard:', word);
          // Add to flashcard (future feature)
        },
      },
    ]);
  };

  // Handle grammar pattern press
  const handleGrammarPress = (pattern) => {
    const message =
      `Mẫu câu: ${pattern.pattern}\n\n` +
      `Romanji: ${pattern.romanji}\n` +
      `Nghĩa: ${pattern.meaning}\n` +
      `Cấp độ: ${pattern.level}\n\n` +
      `Ví dụ:\n${pattern.example}\n${pattern.exampleRomanji}\n${pattern.exampleMeaning}`;

    Alert.alert('Chi tiết ngữ pháp', message, [
      { text: 'Đóng', style: 'cancel' },
      {
        text: 'Xem thêm ví dụ',
        onPress: () => {
          console.log('More examples for pattern:', pattern);
          // Show more examples (future feature)
        },
      },
    ]);
  };

  // Categories for segmented buttons
  const categories = [
    { value: 'hiragana', label: 'Hiragana' },
    { value: 'katakana', label: 'Katakana' },
    { value: 'kanji', label: 'Kanji' },
    { value: 'vocabulary', label: 'Từ vựng' },
    { value: 'grammar', label: 'Ngữ pháp' },
  ];

  // Render content based on selected category
  const renderContent = () => {
    switch (selectedCategory) {
      case 'hiragana':
        return <HiraganaChart data={hiraganaData} onCharacterPress={handleCharacterPress} />;
      case 'katakana':
        return <KatakanaChart data={katakanaData} onCharacterPress={handleCharacterPress} />;
      case 'kanji':
        return <KanjiChart data={basicKanjiData} onCharacterPress={handleCharacterPress} />;
      case 'vocabulary':
        return <VocabularyChart data={basicVocabularyData} onWordPress={handleVocabularyPress} />;
      case 'grammar':
        return <GrammarChart data={grammarPatterns} onPatternPress={handleGrammarPress} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View
        style={{
          padding: 16,
          backgroundColor: theme.colors.surface,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.onSurface,
            textAlign: 'center',
          }}
        >
          Học chữ cái tiếng Nhật
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          Bấm vào từng chữ để xem chi tiết và cách phát âm
        </Text>
      </View>

      {/* Category Selector */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <SegmentedButtons
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          buttons={categories}
          style={{ elevation: 2 }}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {renderContent()}
      </ScrollView>

      {/* Floating Action Button for Quick Actions */}
      <FAB
        icon="school"
        label="Luyện tập"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.primary,
        }}
        onPress={() => {
          Alert.alert('Luyện tập', 'Chọn chế độ luyện tập:', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Quiz nhanh', onPress: () => console.log('Quick quiz') },
            { text: 'Flashcard', onPress: () => console.log('Flashcard') },
            { text: 'Viết chữ', onPress: () => console.log('Writing practice') },
          ]);
        }}
      />
    </SafeAreaView>
  );
};

export default JapaneseLearningScreen;
