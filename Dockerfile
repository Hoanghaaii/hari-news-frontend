# Giai đoạn này chỉ dùng để build code ra các file tĩnh
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Sửa 'build' thành 'dist' nếu framework của bạn build ra thư mục 'dist'
RUN npm run build