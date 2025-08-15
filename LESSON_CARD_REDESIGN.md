# Cập nhật thiết kế Lesson Card trên Home Screen

## Thay đổi đã thực hiện

### ✅ **Thiết kế mới cho Lesson Card**

**Trước:**

- Hiển thị theo format thời gian như Schedule
- Badge status đơn giản
- Layout giống Schedule card

**Sau:**

- Thiết kế chi tiết như màn hình Lessons chính
- Hiển thị title, description, duration, type
- Progress bar cho tiến độ học tập
- Status icon (Play, CheckCircle, Lock)

### 📱 **Components mới được thêm**

1. **Status Icons:**

   ```javascript
   const getStatusIcon = (status) => {
     switch (status?.toLowerCase()) {
       case "completed":
         return <CheckCircle />;
       case "available":
         return <Play icon trong circle blue />;
       case "locked":
         return <Lock />;
     }
   };
   ```

2. **Lesson Meta Info:**

   - Duration với Clock icon
   - Type với FileText icon
   - Layout horizontal với gap

3. **Progress Section:**
   - Progress label và phần trăm
   - Progress bar với màu orange
   - Chỉ hiển thị khi không phải 'locked'

### 🎨 **Layout Structure mới**

```
LessonCard
├── LessonCardContent (row, flex-start)
│   ├── LessonInfo (flex: 1)
│   │   ├── Title
│   │   ├── Description
│   │   ├── Meta (Clock + FileText)
│   │   └── Progress (nếu không locked)
│   └── StatusIcon (Play/Check/Lock)
```

### 🔧 **Styles mới thêm vào**

```javascript
// New styles added:
lockedCard: { opacity: 0.6 }
lessonDescription: { color: '#6B7280', fontSize: 14 }
lessonMeta: { flexDirection: 'row', gap: 16 }
metaItem: { flexDirection: 'row', alignItems: 'center' }
progressSection: { marginTop: 8 }
progressBarContainer: { height: 4, backgroundColor: '#E5E7EB' }
progressBar: { backgroundColor: '#FB923C' }
statusIconContainer: { marginLeft: 16, flexShrink: 0 }
playIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#3B82F6' }
```

## 📊 **Data Mapping từ Database**

```javascript
// Các field được sử dụng:
{
  title: 'Lesson title',
  description: 'Lesson description',
  duration: 'Duration in minutes',
  type: 'Video + Slide',
  status: 'completed' | 'available' | 'locked',
  progress: 0-100,
  completed: boolean
}
```

## 🎯 **Logic xử lý Status**

1. **Completed**: Hiển thị CheckCircle xanh + progress 100%
2. **Available**: Hiển thị Play button xanh + progress hiện tại
3. **Locked**: Hiển thị Lock xám + không có progress bar + opacity 0.6

## 🚀 **Features**

### ✅ **Responsive Design**

- Card adapts to content length
- Icons properly aligned
- Progress bar smooth animations

### ✅ **Interactive States**

- TouchableOpacity với navigation
- Disabled state cho locked lessons
- Visual feedback cho different statuses

### ✅ **Data Integration**

- Sử dụng dữ liệu thật từ database API
- Fallback values cho missing fields
- Empty state khi không có data

## 🔄 **Backward Compatibility**

- Giữ nguyên API calls và data fetching
- Vẫn navigate đến 'LessonDetail' với lessonId
- Vẫn hiển thị empty state khi database trống
- Debug panel vẫn hoạt động

## 📱 **Visual Improvements**

1. **Typography**: Title bold, description lighter
2. **Spacing**: Consistent margins và paddings
3. **Colors**: Orange progress, blue play button, green completed
4. **Icons**: Lucide icons với proper sizing
5. **Progress**: Smooth visual representation

Home screen giờ hiển thị lesson cards với thiết kế đẹp, chi tiết và professional như màn hình Lessons chính! 🎨
