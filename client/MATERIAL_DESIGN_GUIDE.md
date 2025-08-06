# Material Design Icons với React Native Paper 🌈

## Tổng Quan

Dự án này đã được cấu hình để sử dụng **react-native-paper** với **Material Community Icons** để cung cấp trải nghiệm Material Design chuẩn Google.

## Cấu Hình Đã Thực Hiện

### 1. Cài Đặt Dependencies

```json
{
  "react-native-paper": "^5.14.5",
  "react-native-vector-icons": "^10.3.0"
}
```

### 2. Theme Configuration

- File: `app/shared/themes/material-theme.js`
- Cung cấp Material Design 3 theme với colors, fonts, và styling chuẩn Google

### 3. App Configuration

- File: `App.js` - Đã wrap ứng dụng với `PaperProvider`

## Sử Dụng Icons trong Bottom Navigator

### Tab Navigator với Material Icons

File: `app/navigation/tab-navigator.js`

```javascript
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const getTabBarIcon = (route, focused, color, size) => {
  let iconName;

  switch (route.name) {
    case 'HomeTab':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Schedule':
      iconName = focused ? 'calendar' : 'calendar-outline';
      break;
    case 'MyLesson':
      iconName = focused ? 'book-open-page-variant' : 'book-open-page-variant-outline';
      break;
    case 'Profile':
      iconName = focused ? 'account' : 'account-outline';
      break;
  }

  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};
```

## Components có sẵn Icons tích hợp

### 1. Buttons

```javascript
import { Button } from 'react-native-paper';

<Button icon="play" mode="contained">Bắt đầu học</Button>
<Button icon="pause" mode="outlined">Tạm dừng</Button>
<Button icon="refresh" mode="text">Làm lại</Button>
```

### 2. Appbar

```javascript
import { Appbar } from 'react-native-paper';

<Appbar.Header>
  <Appbar.Content title="Satori Nihongo" />
  <Appbar.Action icon="magnify" onPress={() => {}} />
  <Appbar.Action icon="bell-outline" onPress={() => {}} />
</Appbar.Header>;
```

### 3. Icon Buttons

```javascript
import { IconButton } from 'react-native-paper';

<IconButton icon="heart-outline" size={24} onPress={() => {}} />
<IconButton icon="bookmark-outline" size={24} onPress={() => {}} />
<IconButton icon="share-variant" size={24} onPress={() => {}} />
```

### 4. Cards

```javascript
import { Card, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

<Card>
  <Card.Title
    title="Bài học Hiragana"
    subtitle="Học chữ cái Hiragana cơ bản"
    left={(props) => <MaterialCommunityIcons name="script-text" {...props} size={40} />}
    right={(props) => <IconButton {...props} icon="dots-vertical" />}
  />
  <Card.Actions>
    <Button icon="play">Học ngay</Button>
    <Button icon="bookmark-outline">Lưu</Button>
  </Card.Actions>
</Card>;
```

### 5. Chips

```javascript
import { Chip } from 'react-native-paper';

<Chip icon="school" onPress={() => {}}>Cơ bản</Chip>
<Chip icon="trophy" onPress={() => {}}>Nâng cao</Chip>
<Chip icon="star" onPress={() => {}}>Yêu thích</Chip>
```

### 6. List Items

```javascript
import { List } from 'react-native-paper';

<List.Item
  title="Từ vựng hàng ngày"
  description="50 từ vựng thông dụng"
  left={(props) => <List.Icon {...props} icon="forum" />}
  right={(props) => <List.Icon {...props} icon="chevron-right" />}
/>;
```

### 7. Floating Action Button

```javascript
import { FAB } from 'react-native-paper';

<FAB.Group
  open={fabOpen}
  icon={fabOpen ? 'close' : 'plus'}
  actions={[
    { icon: 'plus', label: 'Thêm bài học', onPress: () => {} },
    { icon: 'calendar-plus', label: 'Thêm lịch học', onPress: () => {} },
    { icon: 'book-plus', label: 'Tạo flashcard', onPress: () => {} },
  ]}
  onStateChange={({ open }) => setFabOpen(open)}
/>;
```

## Icons Phù Hợp cho App Học Tiếng Nhật

### Danh Mục Học Tập

- `script-text` - Hiragana
- `format-text` - Katakana
- `book-open-page-variant` - Kanji
- `book-alphabet` - Ngữ pháp
- `forum` - Từ vựng
- `account-group` - Hội thoại

### Chức Năng Học Tập

- `play` - Bắt đầu học
- `pause` - Tạm dừng
- `refresh` - Làm lại
- `check` - Hoàn thành
- `close` - Đóng
- `arrow-right` - Tiếp tục

### Điều Hướng

- `home` / `home-outline` - Trang chủ
- `calendar` / `calendar-outline` - Lịch học
- `book-open-page-variant` - Bài học
- `account` / `account-outline` - Cá nhân

### Hành Động

- `heart` / `heart-outline` - Yêu thích
- `bookmark` / `bookmark-outline` - Lưu
- `share-variant` - Chia sẻ
- `download` - Tải xuống
- `magnify` - Tìm kiếm
- `bell` / `bell-outline` - Thông báo

## Lợi Ích của Material Design

1. **Consistency**: Giao diện nhất quán theo chuẩn Google
2. **Accessibility**: Hỗ trợ tốt cho người dùng khuyết tật
3. **Performance**: Icons được tối ưu hóa
4. **Theming**: Dễ dàng thay đổi theme sáng/tối
5. **Rich Components**: Nhiều component có sẵn với icons tích hợp

## Cách Sử Dụng Theme

```javascript
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>Hello</Text>
    </View>
  );
};
```

## Demo Component

Xem file `app/shared/components/MaterialDesignDemo.js` để xem các ví dụ chi tiết về cách sử dụng tất cả các component với icons.
