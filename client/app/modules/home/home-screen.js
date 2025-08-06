import React from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, Appbar, ProgressBar, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styles from './home-screen.styles';

function HomeScreen(props) {
  const { account, navigation } = props;
  const theme = useTheme();

  // Component cho Header với Material Design
  const Header = () => (
    <Appbar.Header elevated={true} style={{ backgroundColor: theme.colors.surface }}>
      <Appbar.Content
        title={`Xin chào ${account?.login || 'Bạn'}!`}
        titleStyle={{ color: theme.colors.onSurface }}
      />
      <Appbar.Action icon="magnify" onPress={() => {}} iconColor={theme.colors.onSurface} />
      <Appbar.Action icon="bell-outline" onPress={() => {}} iconColor={theme.colors.onSurface} />
    </Appbar.Header>
  );

  // Component cho Tiến độ học tập với Material Design
  const ProgressSection = () => (
    <Card style={[styles.progressSection, { backgroundColor: theme.colors.surface }]} elevation={2}>
      <Card.Content>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Tiến độ học tập
        </Text>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressLabel, { color: theme.colors.onSurfaceVariant }]}>
            Bài học đã hoàn thành
          </Text>
          <Text style={[styles.progressValue, { color: theme.colors.primary }]}>15/50</Text>
        </View>
        <ProgressBar
          progress={0.3}
          color={theme.colors.primary}
          style={{ height: 8, borderRadius: 4, marginVertical: 10 }}
        />
        <Text style={[styles.progressPercent, { color: theme.colors.onSurfaceVariant }]}>
          30% hoàn thành
        </Text>
      </Card.Content>
    </Card>
  );

  // Component cho Categories với Material Design Icons
  const CategoriesSection = () => {
    const categories = [
      {
        id: 1,
        name: 'Hiragana',
        icon: 'script-text',
        color: '#FF6B6B',
        gradientColors: ['#FF6B6B', '#FF8E8E'],
        lessons: 12,
        category: 'hiragana',
        description: 'Bảng chữ cái cơ bản',
      },
      {
        id: 2,
        name: 'Katakana',
        icon: 'format-text',
        color: '#4ECDC4',
        gradientColors: ['#4ECDC4', '#6FE0D6'],
        lessons: 10,
        category: 'katakana',
        description: 'Bảng chữ cái ngoại lai',
      },
      {
        id: 3,
        name: 'Kanji',
        icon: 'book-open-page-variant',
        color: '#45B7D1',
        gradientColors: ['#45B7D1', '#6AC5E1'],
        lessons: 25,
        category: 'kanji',
        description: 'Chữ Hán cơ bản',
      },
      {
        id: 4,
        name: 'Ngữ pháp',
        icon: 'book-alphabet',
        color: '#96CEB4',
        gradientColors: ['#96CEB4', '#A8D8C4'],
        lessons: 18,
        category: 'grammar',
        description: 'Cấu trúc câu',
      },
      {
        id: 5,
        name: 'Từ vựng',
        icon: 'forum',
        color: '#FFEAA7',
        gradientColors: ['#FFEAA7', '#FFEFBB'],
        lessons: 30,
        category: 'vocabulary',
        description: 'Từ vựng cơ bản',
      },
      {
        id: 6,
        name: 'Hội thoại',
        icon: 'account-group',
        color: '#DDA0DD',
        gradientColors: ['#DDA0DD', '#E8B4E8'],
        lessons: 15,
        category: 'conversation',
        description: 'Giao tiếp hàng ngày',
      },
    ];

    const handleCategoryPress = (category) => {
      // Navigate to Japanese Learning Screen with specific category
      navigation.navigate('JapaneseLearning', {
        category: category.name,
        categoryKey: category.category,
      });
    };

    return (
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Danh mục học tập
        </Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
              style={{
                width: '48%',
                marginHorizontal: 6,
                marginBottom: 12,
              }}
            >
              <Card
                style={[styles.categoryCard, { backgroundColor: theme.colors.surface }]}
                elevation={3}
                mode="elevated"
              >
                <Card.Content style={{ alignItems: 'center', padding: 16 }}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <MaterialCommunityIcons name={category.icon} size={28} color="white" />
                  </View>
                  <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
                    {category.name}
                  </Text>
                  <Text style={[styles.categoryLessons, { color: theme.colors.onSurfaceVariant }]}>
                    {category.description}
                  </Text>
                  <View
                    style={{
                      backgroundColor: theme.colors.primaryContainer,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginTop: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: theme.colors.onPrimaryContainer,
                        fontWeight: '600',
                      }}
                    >
                      {category.lessons} bài học
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProgressSection />
        <CategoriesSection />
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => ({ account: state.account.account });
const mapDispatchToProps = (_dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
