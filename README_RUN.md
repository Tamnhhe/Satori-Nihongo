# Hướng dẫn chạy dự án Satori-Nihongo

## 1. Yêu cầu hệ thống

- Node.js >= 14.x (client), >= 22.x (backend)
- npm >= 6.x
- JDK 21
- Docker (nếu dùng database qua docker)

## 2. Chạy Backend

### Bước 1: Build backend

```bash
cd backend
./mvnw clean install
```

- Hoặc trên Windows:

```powershell
cd backend
mvnw.cmd clean install
```

### Bước 2: Chạy ứng dụng backend

```bash
./mvnw spring-boot:run
```

- Hoặc trên Windows:

```powershell
mvnw.cmd spring-boot:run
```

Backend sẽ chạy ở địa chỉ: http://localhost:8080/

## 3. Chạy Client (React Native)

```bash
cd client
npm install
npx expo start
```

- Để chạy trên Android:

```bash
npm run android
```

- Để chạy trên iOS (yêu cầu máy Mac):

```bash
npm run ios
```

- Để chạy trên web:

```bash
npm run web
```

## 4. Cấu hình kết nối API

- Sửa file `client/app/config/app-config.js`:
  - Thay đổi `apiUrl` thành IP máy tính của bạn (ví dụ: `http://192.168.x.x:8080/`)
  - Đảm bảo thiết bị di động và máy tính cùng mạng LAN.

## 5. Một số lệnh hữu ích

- Format code: `npm run prettier-format`
- Kiểm tra lint: `npm run lint`
- Chạy test backend: `npm run test` (trong thư mục backend)
- Chạy test client: `npm run test` (trong thư mục client)

---

Nếu gặp lỗi, kiểm tra lại các bước cài đặt, quyền truy cập mạng, hoặc liên hệ quản trị dự án.
