# Hướng dẫn triển khai Satori-Nihongo lên VPS Linux

## Tổng quan dự án
- **Backend**: Spring Boot 3.4.5 + Java 21 + MySQL 9.2.0
- **Frontend**: React Native/Expo
- **Kiến trúc**: JHipster monolithic application
- **Database**: MySQL
- **Containerization**: Docker support

## 1. Yêu cầu hệ thống

### Minimum requirements:
- **CPU**: 2 cores
- **RAM**: 4GB (khuyến nghị 8GB)
- **Storage**: 20GB free space
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **Network**: Có kết nối internet

### Cổng cần mở:
- **22**: SSH
- **80**: HTTP
- **443**: HTTPS
- **8080**: Application (internal)
- **3306**: MySQL (internal)

---

## 2. Cài đặt môi trường cơ bản

### 2.1. Cập nhật hệ thống
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL/Rocky Linux
sudo dnf update -y
```

### 2.2. Cài đặt các công cụ cơ bản
```bash
# Ubuntu/Debian
sudo apt install -y curl wget git unzip vim htop tree

# CentOS/RHEL/Rocky Linux
sudo dnf install -y curl wget git unzip vim htop tree
```

### 2.3. Tạo user cho application (tùy chọn)
```bash
sudo adduser satori
sudo usermod -aG sudo satori
sudo su - satori
```

---

## 3. Cài đặt Java 21

### 3.1. Ubuntu/Debian
```bash
sudo apt install openjdk-21-jdk -y
```

### 3.2. CentOS/RHEL/Rocky Linux
```bash
sudo dnf install java-21-openjdk java-21-openjdk-devel -y
```

### 3.3. Kiểm tra cài đặt
```bash
java -version
javac -version
echo $JAVA_HOME
```

### 3.4. Cấu hình JAVA_HOME (nếu cần)
```bash
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$PATH:$JAVA_HOME/bin' >> ~/.bashrc
source ~/.bashrc
```

---

## 4. Cài đặt Maven

### 4.1. Cài đặt từ package manager
```bash
# Ubuntu/Debian
sudo apt install maven -y

# CentOS/RHEL/Rocky Linux
sudo dnf install maven -y
```

### 4.2. Kiểm tra cài đặt
```bash
mvn -version
```

---

## 5. Cài đặt Node.js & NPM

### 5.1. Cài đặt Node.js 22.x
```bash
# Cài NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Hoặc cho CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs
```

### 5.2. Sử dụng NVM (khuyến nghị)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22.15.0
nvm use 22.15.0
nvm alias default 22.15.0
```

### 5.3. Kiểm tra cài đặt
```bash
node -v
npm -v
```

---

## 6. Cài đặt MySQL

### 6.1. Cài đặt MySQL Server
```bash
# Ubuntu/Debian
sudo apt install mysql-server -y

# CentOS/RHEL/Rocky Linux
sudo dnf install mysql-server -y
```

### 6.2. Khởi động và enable MySQL
```bash
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Ubuntu/Debian
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 6.3. Bảo mật MySQL
```bash
sudo mysql_secure_installation
```

Trả lời các câu hỏi:
- **Validate password plugin**: Y
- **Password strength**: 2 (Strong)
- **New root password**: Nhập password mạnh
- **Remove anonymous users**: Y
- **Disallow root login remotely**: Y
- **Remove test database**: Y
- **Reload privilege tables**: Y

### 6.4. Tạo database và user
```bash
sudo mysql -u root -p
```

```sql
-- Trong MySQL shell
CREATE DATABASE onlinesatoriplatform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'satoriuser'@'localhost' IDENTIFIED BY 'SatoriUser@2025!';
GRANT ALL PRIVILEGES ON onlinesatoriplatform.* TO 'satoriuser'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
EXIT;
```

### 6.5. Test kết nối database
```bash
mysql -u satoriuser -p onlinesatoriplatform
```

---

## 7. Cài đặt Docker & Docker Compose (Tùy chọn)

### 7.1. Cài đặt Docker
```bash
# Gỡ cài đặt cũ (nếu có)
sudo apt remove docker docker-engine docker.io containerd runc

# Cài Docker từ repository chính thức
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào group docker
sudo usermod -aG docker $USER
newgrp docker
```

### 7.2. Cài đặt Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 7.3. Khởi động Docker
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### 7.4. Kiểm tra cài đặt
```bash
docker --version
docker-compose --version
docker run hello-world
```

---

## 8. Cài đặt Nginx

### 8.1. Cài đặt Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL/Rocky Linux
sudo dnf install nginx -y
```

### 8.2. Khởi động Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 8.3. Kiểm tra Nginx
```bash
curl localhost
# Hoặc mở browser: http://your-server-ip
```

---

## 9. Triển khai ứng dụng

### 9.1. Clone repository
```bash
cd /opt
sudo git clone https://github.com/yourusername/Satori-Nihongo.git
sudo chown -R $USER:$USER Satori-Nihongo
cd Satori-Nihongo
```

### 9.2. Cấu hình environment variables
```bash
cd backend
cp .env.example .env
nano .env
```

Cập nhật file `.env`:
```bash
# Database Configuration
DB_PASSWORD=SatoriUser@2025!

# Mail Configuration (Gmail SMTP)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password_here

# Server Configuration
SERVER_PORT=8080
SERVER_HOST=0.0.0.0

# Security
JWT_SECRET=your_jwt_secret_key_here_minimum_256_bits_long

# Environment
SPRING_PROFILES_ACTIVE=prod
```

### 9.3. Cấu hình application-prod.yml
```bash
nano src/main/resources/config/application-prod.yml
```

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/onlinesatoriplatform?useUnicode=true&characterEncoding=utf8&useSSL=false&useLegacyDatetimeCode=false&createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true
    username: satoriuser
    password: SatoriUser@2025!
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: false
  
  liquibase:
    change-log: classpath:config/liquibase/master.xml
  
  profiles:
    active: prod
  
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

server:
  port: 8080
  address: 0.0.0.0
  compression:
    enabled: true
    mime-types: text/html,text/xml,text/plain,text/css,text/javascript,application/javascript,application/json
    min-response-size: 1024

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always

logging:
  level:
    ROOT: INFO
    com.satori.platform: INFO
    org.springframework.security: WARN
  file:
    name: /opt/Satori-Nihongo/logs/application.log
  logback:
    rollingpolicy:
      max-file-size: 10MB
      max-history: 30

jhipster:
  security:
    authentication:
      jwt:
        secret: ${JWT_SECRET:your_jwt_secret_key_here_minimum_256_bits_long}
        token-validity-in-seconds: 86400
        token-validity-in-seconds-for-remember-me: 2592000
```

### 9.4. Tạo thư mục logs
```bash
sudo mkdir -p /opt/Satori-Nihongo/logs
sudo chown -R $USER:$USER /opt/Satori-Nihongo/logs
```

### 9.5. Build ứng dụng
```bash
cd /opt/Satori-Nihongo/backend

# Clean và build
./mvnw clean
./mvnw dependency:go-offline -ntp
./mvnw clean package -Pprod -DskipTests -ntp

# Kiểm tra file JAR được tạo
ls -la target/*.jar
```

### 9.6. Test chạy ứng dụng
```bash
java -jar target/online-satori-platform-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

Kiểm tra:
- Application startup logs
- Health check: `curl localhost:8080/management/health`
- API: `curl localhost:8080/api/account`

Nhấn `Ctrl+C` để dừng.

---

## 10. Tạo systemd service

### 10.1. Tạo service file
```bash
sudo nano /etc/systemd/system/satori-backend.service
```

```ini
[Unit]
Description=Satori Nihongo Backend Application
Documentation=https://github.com/yourusername/Satori-Nihongo
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/opt/Satori-Nihongo/backend
Environment=JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
Environment=SPRING_PROFILES_ACTIVE=prod
ExecStart=/usr/bin/java -Xmx1024m -Xms512m -jar target/online-satori-platform-0.0.1-SNAPSHOT.jar
ExecStop=/bin/kill -15 $MAINPID
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=satori-backend

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/opt/Satori-Nihongo/logs

[Install]
WantedBy=multi-user.target
```

### 10.2. Enable và start service
```bash
sudo systemctl daemon-reload
sudo systemctl enable satori-backend
sudo systemctl start satori-backend
```

### 10.3. Kiểm tra status
```bash
sudo systemctl status satori-backend
sudo journalctl -u satori-backend -f
```

### 10.4. Các lệnh quản lý service
```bash
# Dừng service
sudo systemctl stop satori-backend

# Khởi động lại
sudo systemctl restart satori-backend

# Xem logs
sudo journalctl -u satori-backend --since "1 hour ago"

# Xem logs theo thời gian thực
sudo journalctl -u satori-backend -f
```

---

## 11. Cấu hình Nginx Reverse Proxy

### 11.1. Tạo Nginx config
```bash
sudo nano /etc/nginx/sites-available/satori-nihongo
```

```nginx
upstream satori_backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Main application
    location / {
        proxy_pass http://satori_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Health check endpoint
    location /management/health {
        proxy_pass http://satori_backend;
        proxy_set_header Host $host;
        access_log off;
    }

    # Static files (if served by Spring Boot)
    location /static/ {
        proxy_pass http://satori_backend;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API endpoints
    location /api/ {
        proxy_pass http://satori_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support (if needed)
    location /websocket/ {
        proxy_pass http://satori_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Logs
    access_log /var/log/nginx/satori_access.log;
    error_log /var/log/nginx/satori_error.log;
}
```

### 11.2. Enable site và test config
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/satori-nihongo /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 11.3. Kiểm tra
```bash
curl -H "Host: your-domain.com" localhost
curl your-domain.com/management/health
```

---

## 12. Cài đặt SSL với Let's Encrypt

### 12.1. Cài đặt Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL/Rocky Linux
sudo dnf install certbot python3-certbot-nginx -y
```

### 12.2. Tạo SSL certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Trả lời các câu hỏi:
- Email address: your-email@domain.com
- Agree to terms: Y
- Share email: N (tùy chọn)
- Redirect HTTP to HTTPS: 2 (Yes)

### 12.3. Test SSL renewal
```bash
sudo certbot renew --dry-run
```

### 12.4. Cấu hình auto-renewal
```bash
sudo crontab -e
```

Thêm dòng:
```bash
0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

---

## 13. Cấu hình tường lửa (UFW)

### 13.1. Cài đặt và cấu hình UFW
```bash
# Cài đặt UFW (nếu chưa có)
sudo apt install ufw -y

# Reset rules
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow essential services
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow MySQL chỉ từ localhost (optional)
sudo ufw allow from 127.0.0.1 to any port 3306

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

---

## 14. Monitoring và Logging

### 14.1. Cài đặt log rotation
```bash
sudo nano /etc/logrotate.d/satori-backend
```

```bash
/opt/Satori-Nihongo/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        systemctl reload satori-backend
    endscript
}
```

### 14.2. Cài đặt htop và netstat
```bash
sudo apt install htop net-tools -y
```

### 14.3. Script monitoring
```bash
sudo nano /opt/monitor-satori.sh
```

```bash
#!/bin/bash

echo "=== Satori Nihongo Monitoring $(date) ==="
echo

echo "1. System Resources:"
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"% used"}'
echo "Memory Usage:"
free -h
echo "Disk Usage:"
df -h /
echo

echo "2. Service Status:"
sudo systemctl status satori-backend --no-pager -l
echo

echo "3. Application Health:"
curl -s http://localhost:8080/management/health | jq . || echo "Health check failed"
echo

echo "4. Recent Logs:"
sudo journalctl -u satori-backend --since "10 minutes ago" --no-pager
echo

echo "5. Network Connections:"
sudo netstat -tlnp | grep :8080
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

```bash
sudo chmod +x /opt/monitor-satori.sh
```

### 14.4. Crontab cho monitoring (tùy chọn)
```bash
crontab -e
```

Thêm:
```bash
# Health check mỗi 5 phút
*/5 * * * * curl -s http://localhost:8080/management/health > /dev/null || echo "$(date): Health check failed" >> /opt/Satori-Nihongo/logs/health.log
```

---

## 15. Backup và khôi phục

### 15.1. Tạo script backup database
```bash
sudo nano /opt/backup-database.sh
```

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/opt/backups"
DB_NAME="onlinesatoriplatform"
DB_USER="satoriuser"
DB_PASS="SatoriUser@2025!"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/satori_db_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
echo "Starting database backup at $(date)"
mysqldump -u $DB_USER -p$DB_PASS --single-transaction --routines --triggers $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Database backup completed: $BACKUP_FILE"
    
    # Compress backup
    gzip $BACKUP_FILE
    echo "Backup compressed: $BACKUP_FILE.gz"
    
    # Remove backups older than 7 days
    find $BACKUP_DIR -name "satori_db_backup_*.sql.gz" -mtime +7 -delete
    echo "Old backups cleaned up"
else
    echo "Database backup failed"
    exit 1
fi
```

```bash
sudo chmod +x /opt/backup-database.sh
```

### 15.2. Tạo script backup application
```bash
sudo nano /opt/backup-application.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/opt/backups"
APP_DIR="/opt/Satori-Nihongo"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/satori_app_backup_$DATE.tar.gz"

mkdir -p $BACKUP_DIR

echo "Starting application backup at $(date)"

# Backup application files (exclude target, node_modules, logs)
tar -czf $BACKUP_FILE \
    --exclude="$APP_DIR/backend/target" \
    --exclude="$APP_DIR/backend/node_modules" \
    --exclude="$APP_DIR/client/node_modules" \
    --exclude="$APP_DIR/logs" \
    $APP_DIR

if [ $? -eq 0 ]; then
    echo "Application backup completed: $BACKUP_FILE"
    
    # Remove backups older than 3 days
    find $BACKUP_DIR -name "satori_app_backup_*.tar.gz" -mtime +3 -delete
    echo "Old application backups cleaned up"
else
    echo "Application backup failed"
    exit 1
fi
```

```bash
sudo chmod +x /opt/backup-application.sh
```

### 15.3. Cấu hình crontab cho backup tự động
```bash
sudo crontab -e
```

```bash
# Daily database backup at 2 AM
0 2 * * * /opt/backup-database.sh >> /opt/Satori-Nihongo/logs/backup.log 2>&1

# Weekly application backup on Sunday at 3 AM
0 3 * * 0 /opt/backup-application.sh >> /opt/Satori-Nihongo/logs/backup.log 2>&1
```

### 15.4. Script khôi phục database
```bash
sudo nano /opt/restore-database.sh
```

```bash
#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    echo "Available backups:"
    ls -la /opt/backups/satori_db_backup_*.sql.gz
    exit 1
fi

BACKUP_FILE=$1
DB_NAME="onlinesatoriplatform"
DB_USER="satoriuser"
DB_PASS="SatoriUser@2025!"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "WARNING: This will restore database from $BACKUP_FILE"
echo "Current database will be DROPPED and recreated!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 1
fi

echo "Stopping application..."
sudo systemctl stop satori-backend

echo "Dropping and recreating database..."
mysql -u root -p -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "Restoring database..."
gunzip -c $BACKUP_FILE | mysql -u $DB_USER -p$DB_PASS $DB_NAME

if [ $? -eq 0 ]; then
    echo "Database restored successfully"
    echo "Starting application..."
    sudo systemctl start satori-backend
    sleep 10
    sudo systemctl status satori-backend
else
    echo "Database restore failed"
    exit 1
fi
```

```bash
sudo chmod +x /opt/restore-database.sh
```

---

## 16. Triển khai với Docker (Tùy chọn)

### 16.1. Tạo Dockerfile cho backend
```bash
cd /opt/Satori-Nihongo/backend
nano Dockerfile
```

```dockerfile
FROM openjdk:21-jre-slim

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -r satori && useradd -r -g satori satori

# Set working directory
WORKDIR /app

# Copy JAR file
COPY target/online-satori-platform-*.jar app.jar

# Change ownership
RUN chown -R satori:satori /app

# Switch to app user
USER satori

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/management/health || exit 1

# Run application
ENTRYPOINT ["java", "-Xmx1024m", "-Xms512m", "-jar", "app.jar"]
```

### 16.2. Tạo docker-compose.prod.yml
```bash
cd /opt/Satori-Nihongo
nano docker-compose.prod.yml
```

```yaml
version: '3.8'

services:
  app:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    image: satori-nihongo:latest
    container_name: satori-app
    restart: unless-stopped
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/onlinesatoriplatform?useUnicode=true&characterEncoding=utf8&useSSL=false&useLegacyDatetimeCode=false&createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME=satoriuser
      - SPRING_DATASOURCE_PASSWORD=SatoriUser@2025!
      - JAVA_OPTS=-Xmx1024m -Xms512m
    ports:
      - "8080:8080"
    volumes:
      - app-logs:/app/logs
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - satori-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/management/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  mysql:
    image: mysql:9.2.0
    container_name: satori-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: RootPassword@2025!
      MYSQL_DATABASE: onlinesatoriplatform
      MYSQL_USER: satoriuser
      MYSQL_PASSWORD: SatoriUser@2025!
    ports:
      - "127.0.0.1:3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./backend/src/main/docker/config/mysql:/etc/mysql/conf.d
    command: mysqld --lower_case_table_names=1 --skip-mysqlx --character_set_server=utf8mb4 --explicit_defaults_for_timestamp
    networks:
      - satori-network
    healthcheck:
      test: ["CMD-SHELL", "mysql -u$$MYSQL_USER -p$$MYSQL_PASSWORD -e 'SHOW DATABASES;' $$MYSQL_DATABASE"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  nginx:
    image: nginx:alpine
    container_name: satori-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - nginx-logs:/var/log/nginx
    depends_on:
      - app
    networks:
      - satori-network

volumes:
  mysql-data:
    driver: local
  app-logs:
    driver: local
  nginx-logs:
    driver: local

networks:
  satori-network:
    driver: bridge
```

### 16.3. Cấu hình Nginx cho Docker
```bash
mkdir -p nginx/conf.d
nano nginx/conf.d/satori.conf
```

```nginx
upstream satori_backend {
    server app:8080;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://satori_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 16.4. Deploy với Docker Compose
```bash
# Build và start services
docker-compose -f docker-compose.prod.yml up -d --build

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Stop và xóa volumes
docker-compose -f docker-compose.prod.yml down -v
```

---

## 17. Các lệnh hữu ích cho vận hành

### 17.1. Quản lý service
```bash
# Xem status tất cả services
sudo systemctl status satori-backend mysql nginx

# Restart tất cả services
sudo systemctl restart satori-backend nginx

# Xem logs realtime
sudo journalctl -u satori-backend -f

# Xem logs theo thời gian
sudo journalctl -u satori-backend --since "1 hour ago"
```

### 17.2. Database operations
```bash
# Kết nối database
mysql -u satoriuser -p onlinesatoriplatform

# Xem kích thước database
mysql -u satoriuser -p -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema='onlinesatoriplatform';"

# Backup database
/opt/backup-database.sh

# Restore database
/opt/restore-database.sh /opt/backups/satori_db_backup_YYYYMMDD_HHMMSS.sql.gz
```

### 17.3. Application operations
```bash
# Check application health
curl localhost:8080/management/health

# Check application info
curl localhost:8080/management/info

# Check metrics
curl localhost:8080/management/metrics

# Redeploy application
cd /opt/Satori-Nihongo/backend
git pull
./mvnw clean package -Pprod -DskipTests
sudo systemctl restart satori-backend
```

### 17.4. Nginx operations
```bash
# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/satori_access.log
sudo tail -f /var/log/nginx/satori_error.log
```

### 17.5. SSL operations
```bash
# Check SSL certificate
sudo certbot certificates

# Renew SSL certificate
sudo certbot renew

# Test SSL renewal
sudo certbot renew --dry-run
```

---

## 18. Troubleshooting

### 18.1. Application không start
```bash
# Check logs
sudo journalctl -u satori-backend -n 50

# Check Java version
java -version

# Check port availability
sudo netstat -tlnp | grep :8080

# Check database connection
mysql -u satoriuser -p onlinesatoriplatform
```

### 18.2. Database connection issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo journalctl -u mysql -n 50

# Test database connection
mysql -u satoriuser -p -h localhost onlinesatoriplatform

# Check MySQL config
sudo cat /etc/mysql/mysql.conf.d/mysqld.cnf
```

### 18.3. Nginx issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check port 80/443
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### 18.4. SSL issues
```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check certificate expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### 18.5. Performance issues
```bash
# Check system resources
htop
free -h
df -h

# Check Java heap
sudo journalctl -u satori-backend | grep -i "heap\|memory\|gc"

# Check database performance
mysql -u root -p -e "SHOW PROCESSLIST;"
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_%';"
```

---

## 19. Bảo mật nâng cao

### 19.1. Fail2ban cho SSH
```bash
sudo apt install fail2ban -y

sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 19.2. Cấu hình SSH security
```bash
sudo nano /etc/ssh/sshd_config
```

```bash
# Disable root login
PermitRootLogin no

# Change default port (optional)
Port 2222

# Disable password authentication (use key-based only)
PasswordAuthentication no
PubkeyAuthentication yes

# Limit users
AllowUsers ubuntu satori

# Disable X11 forwarding
X11Forwarding no
```

```bash
sudo systemctl restart ssh
```

### 19.3. Automatic security updates
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 20. Checklist triển khai

### ✅ Pre-deployment checklist:
- [ ] Server setup (Java, Maven, Node.js, MySQL, Nginx)
- [ ] Database created và user configured
- [ ] Application configuration files updated
- [ ] Environment variables set
- [ ] Firewall configured
- [ ] SSL certificate installed
- [ ] Backup scripts created
- [ ] Monitoring setup

### ✅ Deployment checklist:
- [ ] Code cloned từ repository
- [ ] Application built successfully
- [ ] Database schema created/updated
- [ ] Systemd service created và enabled
- [ ] Nginx reverse proxy configured
- [ ] SSL working properly
- [ ] Health checks passing
- [ ] Logs rotation configured

### ✅ Post-deployment checklist:
- [ ] Application accessible via domain
- [ ] API endpoints working
- [ ] Database operations working
- [ ] Email configuration working (if applicable)
- [ ] Backup scripts tested
- [ ] Monitoring alerts configured
- [ ] Performance baseline established
- [ ] Documentation updated

---

## 21. Liên hệ và hỗ trợ

### Tài liệu tham khảo:
- **Spring Boot**: https://spring.io/projects/spring-boot
- **JHipster**: https://www.jhipster.tech/
- **MySQL**: https://dev.mysql.com/doc/
- **Nginx**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/docs/

### Logs locations:
- **Application**: `/opt/Satori-Nihongo/logs/application.log`
- **System service**: `sudo journalctl -u satori-backend`
- **Nginx**: `/var/log/nginx/satori_*.log`
- **MySQL**: `/var/log/mysql/error.log`

### Important files:
- **Service config**: `/etc/systemd/system/satori-backend.service`
- **Nginx config**: `/etc/nginx/sites-available/satori-nihongo`
- **Application config**: `/opt/Satori-Nihongo/backend/src/main/resources/config/application-prod.yml`
- **Environment variables**: `/opt/Satori-Nihongo/backend/.env`

---

**Chúc bạn triển khai thành công! 🚀**
