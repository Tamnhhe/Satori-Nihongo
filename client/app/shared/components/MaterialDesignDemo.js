import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Button,
  FAB,
  IconButton,
  Chip,
  Card,
  List,
  Text,
  useTheme,
  Divider,
  Surface,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MaterialDesignDemo = () => {
  const theme = useTheme();
  const [fabOpen, setFabOpen] = useState(false);

  const actions = [
    {
      icon: 'plus',
      label: 'Thêm bài học',
      onPress: () => console.log('Thêm bài học'),
    },
    {
      icon: 'calendar-plus',
      label: 'Thêm lịch học',
      onPress: () => console.log('Thêm lịch học'),
    },
    {
      icon: 'book-plus',
      label: 'Tạo flashcard',
      onPress: () => console.log('Tạo flashcard'),
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Surface style={{ margin: 16, padding: 16, borderRadius: 12 }} elevation={2}>
        <Text variant="headlineSmall" style={{ marginBottom: 16, color: theme.colors.onSurface }}>
          Material Design Components với Icons
        </Text>

        {/* Buttons với icons */}
        <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.primary }}>
          Buttons với Material Icons
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <Button icon="play" mode="contained" onPress={() => {}}>
            Bắt đầu học
          </Button>
          <Button icon="pause" mode="outlined" onPress={() => {}}>
            Tạm dừng
          </Button>
          <Button icon="refresh" mode="text" onPress={() => {}}>
            Làm lại
          </Button>
        </View>

        <Divider style={{ marginVertical: 16 }} />

        {/* Icon Buttons */}
        <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.primary }}>
          Icon Buttons
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <IconButton icon="heart-outline" size={24} onPress={() => {}} />
          <IconButton icon="bookmark-outline" size={24} onPress={() => {}} />
          <IconButton icon="share-variant" size={24} onPress={() => {}} />
          <IconButton icon="download" size={24} onPress={() => {}} />
        </View>

        <Divider style={{ marginVertical: 16 }} />

        {/* Chips với icons */}
        <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.primary }}>
          Chips với Icons
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <Chip icon="school" onPress={() => {}}>
            Cơ bản
          </Chip>
          <Chip icon="trophy" onPress={() => {}}>
            Nâng cao
          </Chip>
          <Chip icon="star" onPress={() => {}}>
            Yêu thích
          </Chip>
        </View>

        <Divider style={{ marginVertical: 16 }} />

        {/* Cards với icons */}
        <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.primary }}>
          Cards với Icons
        </Text>
        <Card style={{ marginBottom: 16 }} elevation={2}>
          <Card.Title
            title="Bài học Hiragana"
            subtitle="Học chữ cái Hiragana cơ bản"
            left={(props) => <MaterialCommunityIcons name="script-text" {...props} size={40} />}
            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
          />
          <Card.Actions>
            <Button icon="play" onPress={() => {}}>
              Học ngay
            </Button>
            <Button icon="bookmark-outline" onPress={() => {}}>
              Lưu
            </Button>
          </Card.Actions>
        </Card>

        <Divider style={{ marginVertical: 16 }} />

        {/* List Items với icons */}
        <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.primary }}>
          List Items với Icons
        </Text>
        <List.Section>
          <List.Item
            title="Từ vựng hàng ngày"
            description="50 từ vựng thông dụng"
            left={(props) => <List.Icon {...props} icon="forum" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Ngữ pháp cơ bản"
            description="Các cấu trúc câu đơn giản"
            left={(props) => <List.Icon {...props} icon="book-alphabet" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Luyện nghe"
            description="Bài tập nghe hiểu"
            left={(props) => <List.Icon {...props} icon="headphones" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>
      </Surface>

      {/* Floating Action Button */}
      <FAB.Group
        open={fabOpen}
        visible={true}
        icon={fabOpen ? 'close' : 'plus'}
        actions={actions}
        onStateChange={({ open }) => setFabOpen(open)}
        style={{ position: 'absolute', bottom: 16, right: 16 }}
      />
    </ScrollView>
  );
};

export default MaterialDesignDemo;
