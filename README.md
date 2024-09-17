IP http://18.142.160.167:8119/

DockerFile
# Use Bun as the build environment
FROM oven/bun:1 as builder

WORKDIR /usr/src/app

COPY package.json bun.lockb* ./

RUN bun install
COPY . .
RUN bun run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]


1. Build bun Production และ โยนใส่ nginx

2. ตั้งค่า Nginx ให้ใช้รับ Port 8119
server {
    listen       8119;
    server_name  localhost;
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}

3.ตั้งชื่อ Repository
Docker Hub ชื่อ 
ohmfordevdocker/fe.react.bun:0.1

4.ทำการ Build และ Push
docker buildx build -t ohmfordevdocker/fe.react.bun:0.1 . --push 


5.สร้าง Instance EC2

6.ติดตั้ง Docker 
7.ทำการ Login 

8. รันคำสั่ง sudo docker run -d -p 8119:8119 --name product-app ohmfordevdocker/fe.react.bun:0.1
