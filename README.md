IP http://18.142.160.167:8119/

DockerFile
**ใช้ image oven/bun:1 เป็นฐานในการสร้างขั้นตอนการ build และตั้งชื่อขั้นตอนนี้ว่า builder.**
**oven/bun:1 เป็น Docker image ที่ติดตั้ง Bun (เครื่องมือจัดการแพ็คเกจ) ซึ่งจะใช้ในการติดตั้ง dependencies และสร้างโปรเจกต์**
FROM oven/bun:1 as builder

**ตั้งค่าไดเรกทอรีทำงานเป็น /usr/src/app ใน container**
WORKDIR /usr/src/app

**คัดลอกไฟล์ package.json และ bun.lockb (หรือ bun.lockb.* ถ้ามีหลายไฟล์) จากเครื่องโฮสต์ไปยัง container ในไดเรกทอรี /usr/src/app.**
COPY package.json bun.lockb* ./

**รันคำสั่ง bun install เพื่อทำการติดตั้ง dependencies ที่ระบุใน package.json และ bun.lockb บน container.**
RUN bun install

**คัดลอกไฟล์และโฟลเดอร์ทั้งหมดจากเครื่องโฮสต์ไปยัง container ที่ /usr/src/app.**
COPY . .

**รันสคริปต์ build ที่กำหนดใน package.json เพื่อคอมไพล์โค้ดและสร้าง artifacts ที่ต้องการ.**
RUN bun run build

**เป็น image สำหรับติดตั้ง Nginx (เว็บเซิร์ฟเวอร์)**
FROM nginx:alpine

**คัดลอกไฟล์ nginx.conf จากเครื่องโฮสต์ไปยัง /etc/nginx/conf.d/default.conf ใน container.**
COPY nginx.conf /etc/nginx/conf.d/default.conf

**คัดลอกไฟล์ที่สร้างขึ้นจากขั้นตอน builder (โดยใช้ชื่อ builder) จากไดเรกทอรี /usr/src/app/dist ไปยัง /usr/share/nginx/html ใน image ของ Nginx.**
**ไฟล์ในไดเรกทอรี /usr/share/nginx/html จะถูกให้บริการโดย Nginx.**
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

**-g "daemon off;" เป็นการตั้งค่าให้ Nginx ทำงานใน foreground, ซึ่งจำเป็นสำหรับการทำงานใน container.**
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
