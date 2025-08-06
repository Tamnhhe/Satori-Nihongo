import React from 'react';
import { ScrollView, Text, View, SafeAreaView } from 'react-native';
import { Card, Appbar, ProgressBar, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styles from './home-screen.styles';

function HomeScreen(props) {
  const { account } = props;
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
      { id: 1, name: 'Hiragana', icon: 'script-text', color: '#FF6B6B', lessons: 12 },
      { id: 2, name: 'Katakana', icon: 'format-text', color: '#4ECDC4', lessons: 10 },
      { id: 3, name: 'Kanji', icon: 'book-open-page-variant', color: '#45B7D1', lessons: 25 },
      { id: 4, name: 'Ngữ pháp', icon: 'book-alphabet', color: '#96CEB4', lessons: 18 },
      { id: 5, name: 'Từ vựng', icon: 'forum', color: '#FFEAA7', lessons: 30 },
      { id: 6, name: 'Hội thoại', icon: 'account-group', color: '#DDA0DD', lessons: 15 },
    ];

    return (
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Danh mục học tập
        </Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <Card key={category.id} style={styles.categoryCard} elevation={2}>
              <Card.Content style={{ alignItems: 'center', padding: 16 }}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <MaterialCommunityIcons name={category.icon} size={32} color="white" />
                </View>
                <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
                  {category.name}
                </Text>
                <Text style={[styles.categoryLessons, { color: theme.colors.onSurfaceVariant }]}>
                  {category.lessons} bài học
                </Text>
              </Card.Content>
            </Card>
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
