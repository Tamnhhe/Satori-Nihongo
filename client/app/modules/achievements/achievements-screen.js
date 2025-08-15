import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Trophy, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './achievements-screen.styles';

const achievements = [
  {
    id: 1,
    title: 'Hiragana Master',
    description: 'Hoàn thành bảng chữ cái Hiragana',
    timeAgo: '2 ngày trước',
    icon: '📝',
    bgColor: '#F59E0B',
    isUnlocked: true,
  },
  {
    id: 2,
    title: 'Từ vựng cơ bản',
    description: '100 từ vựng đầu tiên',
    timeAgo: '1 tuần trước',
    icon: '📚',
    bgColor: '#3B82F6',
    isUnlocked: true,
  },
  {
    id: 3,
    title: 'Kiên trì',
    description: 'Học 7 ngày liên tiếp',
    timeAgo: '2 ngày trước',
    icon: '📅',
    bgColor: '#10B981',
    isUnlocked: true,
  },
  {
    id: 4,
    title: 'Katakana Master',
    description: 'Hoàn thành bảng chữ cái Katakana',
    timeAgo: 'Chưa mở khóa',
    icon: '🔒',
    bgColor: '#9CA3AF',
    isUnlocked: false,
  },
  {
    id: 5,
    title: 'Người bạn mới',
    description: 'Tham gia 10 buổi học',
    timeAgo: '3 ngày trước',
    icon: '⭐',
    bgColor: '#8B5CF6',
    isUnlocked: true,
  },
  {
    id: 6,
    title: 'Siêu chăm',
    description: 'Học 20 ngày liên tiếp',
    timeAgo: 'Chưa mở khóa',
    icon: '🔒',
    bgColor: '#9CA3AF',
    isUnlocked: false,
  },
];

function AchievementsScreen(_props) {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Tất cả');

  const tabs = ['Tất cả', 'Mới đạt được', 'Chưa mở khóa'];

  const filteredAchievements = achievements.filter((achievement) => {
    if (activeTab === 'Mới đạt được') {
      return (
        achievement.isUnlocked &&
        achievement.timeAgo.includes('ngày trước') &&
        !achievement.timeAgo.includes('tuần')
      );
    }
    if (activeTab === 'Chưa mở khóa') {
      return !achievement.isUnlocked;
    }
    return true;
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinueLearning = () => {
    // Navigate to home or lessons
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Trophy size={20} color="#F59E0B" />
            <Text style={styles.headerTitleText}>Thành tựu của bạn</Text>
          </View>

          <View style={styles.headerAvatar}>
            <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.avatarGradient}>
              <Text style={styles.avatarEmoji}>👨‍💼</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Progress Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Tiến độ học tập</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>47</Text>
                <Text style={styles.statLabel}>Giờ học</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValueOrange}>23</Text>
                <Text style={styles.statLabel}>Thành tựu</Text>
              </View>
            </View>

            {/* JLPT Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>JLPT N5 → N4</Text>
                <Text style={styles.progressPercent}>68%</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBar, { width: '68%' }]} />
              </View>
              <Text style={styles.progressSubtext}>Còn 245 từ vựng để đạt N4</Text>
            </View>
          </View>

          {/* Encouragement Card */}
          <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.encouragementCard}>
            <View style={styles.encouragementContent}>
              <View style={styles.encouragementLeft}>
                <View style={styles.encouragementHeader}>
                  <Star size={16} color="#ffffff" />
                  <Text style={styles.encouragementSubtext}>Bạn đang tiến gần đến mức</Text>
                </View>
                <Text style={styles.encouragementTitle}>N4</Text>
                <Text style={styles.encouragementDescription}>Chỉ còn 32% nữa thôi</Text>
              </View>
              <View style={styles.encouragementIcon}>
                <Text style={styles.targetEmoji}>🎯</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab ? styles.activeTab : styles.inactiveTab]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab ? styles.activeTabText : styles.inactiveTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Achievements Grid */}
          <View style={styles.achievementsSection}>
            <Text style={styles.achievementsTitle}>Huy hiệu thành tựu</Text>

            <View style={styles.achievementsGrid}>
              {filteredAchievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[styles.achievementCard, !achievement.isUnlocked && styles.lockedCard]}
                >
                  <View style={[styles.achievementIcon, { backgroundColor: achievement.bgColor }]}>
                    <Text style={styles.achievementEmoji}>
                      {achievement.isUnlocked ? achievement.icon : '🔒'}
                    </Text>
                  </View>

                  <Text style={styles.achievementTitle}>{achievement.title}</Text>

                  <Text style={styles.achievementDescription}>{achievement.description}</Text>

                  <Text
                    style={[
                      styles.achievementTime,
                      achievement.isUnlocked ? styles.unlockedTime : styles.lockedTime,
                    ]}
                  >
                    {achievement.timeAgo}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Continue Learning Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueLearning}
            activeOpacity={0.8}
          >
            <Text style={styles.playIcon}>▶</Text>
            <Text style={styles.continueButtonText}>Tiếp tục học</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (_state) => ({
  // Add any state you need here
});

const mapDispatchToProps = (_dispatch) => ({
  // Add any actions you need here
});

export default connect(mapStateToProps, mapDispatchToProps)(AchievementsScreen);
