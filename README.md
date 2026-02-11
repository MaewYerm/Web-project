# Beef Warehouse Management System 
(ระบบจัดการคลังชิ้นเนื้อโคขุน)

# Introduction

This project comprises HTML, CSS, JavaScript, and Node.js components. All the code is part of the Web Technology course in Computer Engineering at the University of Phayao in Thailand.

สมาชิกกลุ่ม
- 67021411 นายกิตติกร นิยมสัจจะวาที Full Stack
- 67021422 นายกิตติทัต อาสาไพร Backend
- 67021433 นายกิตติธรา ไชยเมือง Frontend
- 67022041 นางสาวภัทรภร บุญอินปั๋น Frontend

## Project Structure
- front-end: UI และ client side
- back-end: Node.js server และ API

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express

## Program Requirement
- Node.js
- Github
- MySQL Workbench
- MySQL Server

*หมายเหตุ* หาก Import database ด้วย HeidiSQL จะไม่สามารถ Import ได้เนื่องจากไฟล์มีการเก็บข้อมูลรูปภาพอยู่ในแบบ binary ด้วย
- Visual Studio Code

## Set UP Project (ขั้นตอนการติดตั้ง)
Install dependencies for project

1. install package
```
npm init -y
```
```
npm i express ejs mysql2 dotenv express-session nodemon bcrypt multer
```
2. run website
```
npm run dev
```
หรือ
```
node index.js
```
3. open web browser
```
localhost:3000
```

# วิธีการ Import Database
1. สร้าง database
```
CREATE DATABASE project_web;
```
2. ใช้คำสั่ง Import
```
mysql -u root -p project_web < D:\BEEF PROJECT\Web Project\database\project_web_final.sql
```

หรือ 

1. เปิด MySQL Workbench
2. เชื่อมต่อไปที่ localhost
3. ไปที่เมนู
```
Server → Data Import
```
4. เลือก
```
Import from Self-Contained File
```
5. กดปุ่ม ... แล้วเลือกไฟล์ .sql ของโปรเจค
6. เลือก
```
Default Target Schema
```
* ถ้ายังไม่มีฐานข้อมูล ให้กด New แล้วตั้งชื่อ database ก่อน
7. กดปุ่ม Start Import
8. เมื่อเสร็จแล้ว กด Refresh ที่ฝั่ง SCHEMAS จะเห็นตารางถูกสร้างเรียบร้อย

# การตั้งค่าไฟล์ .env
ตรวจสอบให้แน่ใจว่าไฟล์ .env ในโปรเจคตรงกับฐานข้อมูลที่ Import แล้ว
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=0816517386Kk@
DB_NAME=project_web
```
* ชื่อ DB_NAME ต้องตรงกับชื่อ database ที่สร้างไว้ใน MySQL
* DB_PASSWORD ต้องตรงกับใน MySQL ของตนเอง

```
user และ password สำหรับทดลองเข้าใช้งาน

role : admin
username : admin
password : admin

role : staff
username : euang
password : 123
```
