// Mock data cho testing
export const mockLessons = [
  {
    id: 1,
    title: 'Hiragana - Bảng chữ cái cơ bản',
    content:
      'Học các ký tự Hiragana từ あ đến そ. Bao gồm cách viết, phát âm và cách ghi nhớ hiệu quả. Đây là bước đầu tiên trong việc học tiếng Nhật.',
    videoUrl: 'https://www.youtube.com/watch?v=6p9Il_j0zjc',
    slideUrl: 'https://docs.google.com/presentation/d/1234567890',
    course: {
      id: 1,
      title: 'Tiếng Nhật sơ cấp',
    },
  },
  {
    id: 2,
    title: 'Katakana - Bảng chữ cái cho từ ngoại lai',
    content:
      'Khám phá bảng chữ Katakana, được sử dụng để viết từ ngoại lai và tên riêng từ nước ngoài. Học cách phân biệt với Hiragana.',
    videoUrl: 'https://www.youtube.com/watch?v=s6DKRgtVLGA',
    slideUrl: null,
    course: {
      id: 1,
      title: 'Tiếng Nhật sơ cấp',
    },
  },
  {
    id: 3,
    title: 'Giới thiệu bản thân - 自己紹介',
    content:
      'Học cách giới thiệu bản thân bằng tiếng Nhật. Bao gồm: tên, tuổi, quê quán, sở thích và nghề nghiệp.',
    videoUrl: null,
    slideUrl: 'https://docs.google.com/presentation/d/0987654321',
    course: {
      id: 2,
      title: 'Giao tiếp hàng ngày',
    },
  },
  {
    id: 4,
    title: 'Số đếm và thời gian - 数字と時間',
    content:
      'Học cách đếm số từ 1-100 và cách nói giờ trong tiếng Nhật. Thực hành với các ví dụ thực tế.',
    videoUrl: 'https://www.youtube.com/watch?v=XYZ123',
    slideUrl: 'https://docs.google.com/presentation/d/1111222233',
    course: {
      id: 2,
      title: 'Giao tiếp hàng ngày',
    },
  },
  {
    id: 5,
    title: 'Văn hóa Nhật Bản - 日本の文化',
    content:
      'Tìm hiểu về văn hóa truyền thống Nhật Bản: lễ hội, ẩm thực, kiến trúc và phong tục tập quán.',
    videoUrl: 'https://www.youtube.com/watch?v=ABC789',
    slideUrl: null,
    course: {
      id: 3,
      title: 'Văn hóa Nhật Bản',
    },
  },
  {
    id: 6,
    title: 'Kanji cơ bản - 基本漢字',
    content: 'Học 50 ký tự Kanji cơ bản nhất, bao gồm: 人、山、川、火、水、木、金、土、日、月...',
    videoUrl: null,
    slideUrl: null,
    course: {
      id: 1,
      title: 'Tiếng Nhật sơ cấp',
    },
  },
  {
    id: 7,
    title: 'Động từ thể ます - です/ます form',
    content:
      'Học cách chia động từ thể lịch sự ます và cách sử dụng trong câu khẳng định, phủ định, quá khứ.',
    videoUrl: 'https://www.youtube.com/watch?v=DEF456',
    slideUrl: 'https://docs.google.com/presentation/d/5555666677',
    course: {
      id: 1,
      title: 'Tiếng Nhật sơ cấp',
    },
  },
  {
    id: 8,
    title: 'Mua sắm tại Nhật - 買い物',
    content:
      'Học từ vựng và câu giao tiếp khi mua sắm: hỏi giá, thử đồ, thanh toán, yêu cầu giảm giá.',
    videoUrl: 'https://www.youtube.com/watch?v=GHI789',
    slideUrl: 'https://docs.google.com/presentation/d/8888999900',
    course: {
      id: 2,
      title: 'Giao tiếp hàng ngày',
    },
  },
];

export const mockSchedules = [
  {
    id: 1,
    date: '2025-08-07T00:00:00.000Z',
    startTime: '2025-08-07T09:00:00.000Z',
    endTime: '2025-08-07T10:30:00.000Z',
    location: 'Phòng A1',
    course: {
      id: 1,
      title: 'Tiếng Nhật sơ cấp',
    },
  },
  {
    id: 2,
    date: '2025-08-08T00:00:00.000Z',
    startTime: '2025-08-08T14:00:00.000Z',
    endTime: '2025-08-08T15:30:00.000Z',
    location: 'Online',
    course: {
      id: 2,
      title: 'Giao tiếp hàng ngày',
    },
  },
  {
    id: 3,
    date: '2025-08-10T00:00:00.000Z',
    startTime: '2025-08-10T10:00:00.000Z',
    endTime: '2025-08-10T11:30:00.000Z',
    location: 'Phòng B2',
    course: {
      id: 3,
      title: 'Văn hóa Nhật Bản',
    },
  },
];
