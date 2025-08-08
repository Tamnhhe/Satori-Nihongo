# Home Screen UI Improvements

## Những cải thiện đã thực hiện cho giao diện màn Home

### 1. Categories Layout

- **Grid Layout**: Cải thiện layout 2 cột với khoảng cách đều đặn
- **Card Design**: Bo tròn góc nhiều hơn (16px), shadow mượt mà hơn
- **Spacing**: Khoảng cách hợp lý giữa các card bằng margin
- **Touch Feedback**: activeOpacity 0.8 cho phản hồi tốt hơn

### 2. Visual Enhancements

- **Colors**: Cập nhật màu sắc để dễ nhìn hơn
- **Typography**: Font weight và size phù hợp hơn
- **Icons**: Size icon phù hợp với container
- **Descriptions**: Thêm mô tả ngắn gọn cho từng danh mục

### 3. Category Information

- **Badge**: Hiển thị số bài học trong badge nhỏ với background primaryContainer
- **Description**: Thêm mô tả ngắn gọn (ví dụ: "Bảng chữ cái cơ bản")
- **Icon Size**: Giảm size icon từ 32 xuống 28 để cân bằng hơn

### 4. Material Design 3

- **Cards**: Sử dụng mode="elevated" cho Material Design 3
- **Colors**: Sử dụng theme colors từ Material Design
- **Elevation**: Tăng elevation lên 8 cho depth tốt hơn

### 5. Responsive Design

- **Width**: Categories card sử dụng 48% width với margin để tạo khoảng cách
- **Padding**: Giảm padding để tận dụng không gian tốt hơn
- **Background**: Cập nhật background color sang #f8fafc để mềm mại hơn

## Code Structure

### HomeScreen Categories

```javascript
const categories = [
  {
    id: 1,
    name: "Hiragana",
    icon: "script-text",
    color: "#FF6B6B",
    description: "Bảng chữ cái cơ bản",
    lessons: 12,
    category: "hiragana",
  },
  // ... other categories
];
```

### Improved Card Layout

```javascript
<TouchableOpacity
  style={{
    width: "48%",
    marginHorizontal: 6,
    marginBottom: 12,
  }}
>
  <Card
    style={[styles.categoryCard, { backgroundColor: theme.colors.surface }]}
    elevation={3}
    mode="elevated"
  >
    <Card.Content style={{ alignItems: "center", padding: 16 }}>
      {/* Icon with gradient background */}
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <MaterialCommunityIcons name={category.icon} size={28} color="white" />
      </View>

      {/* Category name */}
      <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
        {category.name}
      </Text>

      {/* Description */}
      <Text
        style={[
          styles.categoryLessons,
          { color: theme.colors.onSurfaceVariant },
        ]}
      >
        {category.description}
      </Text>

      {/* Lesson count badge */}
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
            fontWeight: "600",
          }}
        >
          {category.lessons} bài học
        </Text>
      </View>
    </Card.Content>
  </Card>
</TouchableOpacity>
```

## Navigation Integration

Khi người dùng bấm vào một danh mục, app sẽ chuyển đến `JapaneseLearningScreen` với:

- `category`: Tên danh mục (để hiển thị trong header)
- `categoryKey`: Key để xác định nội dung hiển thị

```javascript
navigation.navigate("JapaneseLearning", {
  category: category.name,
  categoryKey: category.category,
});
```

## Files Modified

- `home-screen.js`: Cập nhật UI components và navigation
- `home-screen.styles.js`: Cải thiện styles cho layout đẹp hơn
- `home-stack.js`: Thêm navigation stack cho Home và Japanese Learning

## Result

Giao diện màn Home giờ đây:

- Dễ nhìn và hiện đại hơn
- Layout cân bằng với khoảng cách hợp lý
- Material Design 3 compliant
- Touch feedback tốt
- Navigation mượt mà đến màn học tập
