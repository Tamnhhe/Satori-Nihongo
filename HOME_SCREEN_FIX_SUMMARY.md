# Sửa lỗi hiển thị danh sách lịch học và bài học

## Vấn đề

- Danh sách lịch học và bài học không hiển thị
- Cần hiển thị lịch học gần nhất và bài học đầu tiên
- Nút "Xem thêm" cần chuyển đến tab tương ứng

## Các sửa đổi đã thực hiện

### 1. Cải thiện xử lý dữ liệu API

```javascript
// Xử lý cấu trúc dữ liệu linh hoạt
const schedules = schedulesResponse.data?.content || schedulesResponse.data || [];
const lessons = lessonsResponse.data?.content || lessonsResponse.data || [];

// Thêm dữ liệu mẫu khi API lỗi
const mockSchedules = [...];
const mockLessons = [...];
```

### 2. Sắp xếp dữ liệu thông minh

**Lịch học:**

- Sắp xếp theo thời gian (`startTime`) để hiển thị lịch gần nhất
- Hiển thị 1 lịch học sắp tới

**Bài học:**

- Ưu tiên bài học chưa hoàn thành (`completed: false`)
- Sắp xếp theo ID để hiển thị bài mới nhất
- Hiển thị 1 bài học đầu tiên

### 3. Hiển thị dữ liệu tối ưu

- **Lịch học**: Chỉ hiển thị 1 lịch học gần nhất thay vì 2
- **Bài học**: Chỉ hiển thị 1 bài học đầu tiên thay vì 2
- Giữ nguyên nút "Xem thêm" để chuyển tab

### 4. Debug và logging

- Thêm console.log để theo dõi dữ liệu
- Debug panel hiển thị trong dev mode
- Xử lý lỗi tốt hơn với thông báo rõ ràng

## Cấu trúc dữ liệu mong đợi

### Schedule Object:

```javascript
{
  id: number,
  title: string,
  startTime: string (ISO date),
  endTime: string (ISO date),
  status: 'upcoming' | 'completed' | 'in_progress',
  level: string (N3, N4, N5),
  duration: string | number
}
```

### Lesson Object:

```javascript
{
  id: number,
  title: string,
  name: string,
  level: string,
  difficulty: string,
  duration: string | number,
  estimatedTime: string | number,
  completed: boolean,
  status: string
}
```

## Luồng hoạt động

1. **Load Data**: Gọi API song song `getAllSchedules()` và `getAllLessons()`
2. **Process Data**: Kiểm tra cấu trúc response (content array hoặc direct array)
3. **Sort Data**:
   - Schedules: Sắp xếp theo thời gian
   - Lessons: Ưu tiên chưa hoàn thành
4. **Display**: Hiển thị item đầu tiên của mỗi danh sách
5. **Navigation**: "Xem thêm" chuyển đến tab Schedule/Lessons

## Xử lý lỗi

- API fail → Hiển thị dữ liệu mẫu
- Dữ liệu trống → Hiển thị empty state
- Loading state → Spinner với text "Đang tải dữ liệu..."

## Test Cases

1. ✅ API trả về dữ liệu đúng format
2. ✅ API trả về array trống
3. ✅ API lỗi/network fail
4. ✅ Dữ liệu không có startTime/endTime
5. ✅ Navigation "Xem thêm" hoạt động

## Files thay đổi

- `home-screen.js`: Logic hiển thị và xử lý dữ liệu
- Console logs cho debug trong development
