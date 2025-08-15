# Cập nhật Home Screen - Hiển thị dữ liệu thật từ Database

## Các thay đổi đã thực hiện

### 1. ✅ Navigation Fix

- **Trước**: Nút "Xem thêm" ở section Bài học navigate tới `'Lessons'`
- **Sau**: Nút "Xem thêm" ở section Bài học navigate tới `'MyLesson'`

### 2. ✅ Hiển thị dữ liệu thật từ Database

**Logic mới cho Lessons:**

- **Ưu tiên 1**: Dữ liệu thật từ database (API response)
- **Ưu tiên 2**: Empty state nếu database trống
- **Không còn**: Mock data cho lessons

**Logic cho Schedules (giữ nguyên):**

- Dữ liệu thật từ API nếu có
- Mock data nếu API fail (để demo)

### 3. ✅ Cải thiện xử lý dữ liệu

```javascript
// Kiểm tra dữ liệu thật từ API
if (lessonsResponse.ok && lessonsResponse.data) {
  const lessons = lessonsResponse.data?.content || lessonsResponse.data || [];

  if (lessons.length > 0) {
    // Sử dụng dữ liệu thật từ database
    setLessonsData(sortedLessons);
  } else {
    // Database trống → hiển thị empty state
    setLessonsData([]);
  }
}
```

### 4. ✅ Empty State được cải thiện

- Thông báo rõ ràng: "Chưa có bài học nào trong database"
- Hướng dẫn: "Vui lòng thêm bài học từ trang quản trị"

### 5. ✅ Debug Panel nâng cao

```javascript
<Text>Lessons count: {lessonsData.length} (from database only)</Text>
<Text>First lesson ID: {lessonsData[0]?.id || 'N/A'}</Text>
<Text>API URL: {API.create().axiosInstance?.defaults?.baseURL || 'N/A'}</Text>
```

## Luồng hoạt động mới

### Lessons Section:

1. **Gọi API**: `getAllLessons({ page: 0, size: 5 })`
2. **Kiểm tra response**:
   - ✅ OK + có data → Hiển thị bài học đầu tiên từ DB
   - ✅ OK + rỗng → Hiển thị "Chưa có bài học trong database"
   - ❌ Lỗi → Hiển thị "Chưa có bài học trong database"
3. **Sắp xếp**: Ưu tiên bài chưa hoàn thành, sau đó theo ID
4. **Hiển thị**: Bài học đầu tiên trong danh sách đã sắp xếp

### Navigation:

- **"Xem thêm" Lịch học** → `Schedule` screen
- **"Xem thêm" Bài học** → `MyLesson` screen
- **Tap lesson card** → `LessonDetail` screen với `lessonId`

## Kết quả

### ✅ Khi Database có dữ liệu:

- Hiển thị bài học đầu tiên từ database
- Thông tin đầy đủ: title, level, duration, status
- Navigation hoạt động đúng

### ✅ Khi Database trống:

- Hiển thị icon BookOpen
- Text: "Chưa có bài học nào trong database"
- Hướng dẫn thêm dữ liệu

### ✅ Khi API lỗi:

- Không hiển thị mock data
- Hiển thị empty state với thông báo phù hợp

## API Expected Response

### Lessons API Structure:

```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "Bài 1: Hiragana cơ bản",
      "name": "Hiragana cơ bản",
      "level": "N5",
      "difficulty": "Cơ bản",
      "duration": "30",
      "estimatedTime": "30",
      "completed": false,
      "status": "available"
    }
  ]
}
```

hoặc với pagination:

```json
{
  "ok": true,
  "data": {
    "content": [...lessons],
    "totalElements": 10
  }
}
```

## Notes

- Debug panel chỉ hiển thị trong development mode (`__DEV__`)
- Console logs giúp debug API response trong development
- Empty state khuyến khích admin thêm dữ liệu vào database
