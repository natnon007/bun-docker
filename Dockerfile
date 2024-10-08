# ใช้ image oven/bun:1 เป็นฐานในการสร้างขั้นตอนการ build และตั้งชื่อขั้นตอนนี้ว่า builder.
# oven/bun:1 เป็น Docker image ที่ติดตั้ง Bun (เครื่องมือจัดการแพ็คเกจ) ซึ่งจะใช้ในการติดตั้ง dependencies และสร้างโปรเจกต์
FROM oven/bun:1 as builder

# ตั้งค่าไดเรกทอรีทำงานเป็น /usr/src/app ใน container
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และ bun.lockb (หรือ bun.lockb.* ถ้ามีหลายไฟล์) จากเครื่องโฮสต์ไปยัง container ในไดเรกทอรี /usr/src/app.
COPY package.json bun.lockb* ./

# รันคำสั่ง bun install เพื่อทำการติดตั้ง dependencies ที่ระบุใน package.json และ bun.lockb บน container.
RUN bun install

# คัดลอกไฟล์และโฟลเดอร์ทั้งหมดจากเครื่องโฮสต์ไปยัง container ที่ /usr/src/app.
COPY . .

# รันสคริปต์ build ที่กำหนดใน package.json เพื่อคอมไพล์โค้ดและสร้าง artifacts ที่ต้องการ.
RUN bun run build

# เป็น image สำหรับติดตั้ง Nginx (เว็บเซิร์ฟเวอร์)
FROM nginx:alpine

# # คัดลอกไฟล์ nginx.conf จากเครื่องโฮสต์ไปยัง /etc/nginx/conf.d/default.conf ใน container.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ที่สร้างขึ้นจากขั้นตอน builder (โดยใช้ชื่อ builder) จากไดเรกทอรี /usr/src/app/dist ไปยัง /usr/share/nginx/html ใน image ของ Nginx.
# ไฟล์ในไดเรกทอรี /usr/share/nginx/html จะถูกให้บริการโดย Nginx.
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# -g "daemon off;" เป็นการตั้งค่าให้ Nginx ทำงานใน foreground, ซึ่งจำเป็นสำหรับการทำงานใน container.
CMD ["nginx", "-g", "daemon off;"]

# สรุป
# ขั้นตอนแรก (builder) ใช้เพื่อสร้างโปรเจกต์และติดตั้ง dependencies ด้วย Bun.
# ขั้นตอนที่สอง (nginx:alpine) ใช้เพื่อให้บริการไฟล์ที่สร้างขึ้นจากขั้นตอนแรกโดยใช้ Nginx.
# Dockerfile นี้มีวัตถุประสงค์เพื่อสร้างแอปพลิเคชันที่ใช้ Bun ในการจัดการ dependencies และการสร้างโปรเจกต์, และ Nginx สำหรับการให้บริการไฟล์ static ใน production environment.