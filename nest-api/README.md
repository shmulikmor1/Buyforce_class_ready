# BuyForce – מדריך הרצה לצוות (Development)

הפרויקט מורכב משני חלקים:
- nest-api – צד שרת (NestJS + PostgreSQL)
- client – צד לקוח (Next.js)

הפרויקט עובד עם PostgreSQL ו־JWT.
אין שימוש ב־MongoDB.

---

## דרישות מוקדמות

לפני התחלה ודאו שמותקנים:
- Node.js (גרסת LTS מומלצת)
- Git
- PostgreSQL  
  (אפשר התקנה מקומית או הרצה באמצעות Docker – לבחירתכם)

---
## PostgreSQL באמצעות Docker (Development)

במקום התקנה מקומית של PostgreSQL, ניתן להריץ את בסיס הנתונים באמצעות Docker.
זו הדרך המומלצת לצוות כדי למנוע בעיות גרסאות והגדרות.

הקוד לא משתנה – רק דרך הרצת ה־DB.

הוראות מלאות נמצאות בקובץ:
docs/docker-postgres.md


## שלב 1 – שכפול הפרויקט

```bash
git clone <REPO_URL>
cd BuyForce_project
# .................................................................................................
שלב 2 – התקנת חבילות
Backend (Nest)

cd nest-api
npm install


Frontend (Next)

cd ../client
npm install

# ....................................................................................................

שלב 3 – הגדרת משתני סביבה
Backend – קובץ nest-api/.env

יש ליצור קובץ .env בתוך תיקיית nest-api
(הקובץ לא עולה ל־Git):


DB_HOST=localhost
DB_PORT=5438
DB_USER=postgres
DB_PASSWORD=123456
DB_DATABASE=BuyForce_sql


#JWT
PORT=4000
JWT_SECRET=dev_SECRET_9f3b2a1c7d8e4f6b0c5a2e9d3f1b7c8

הערות:

ערכי ה־DB צריכים להתאים ל־PostgreSQL המקומי או לקונטיינר.

JWT_SECRET חובה לצורך התחברות.





Frontend – קובץ client/.env.local

יש ליצור קובץ client/.env.local:


NEXT_PUBLIC_API_URL=http://localhost:4000

# .................................................................................................

שלב 4 – הרצת הפרויקט
הרצת ה־Backend

cd nest-api
npm run start:dev

השרת יעלה בכתובת:
http://localhost:4000



הרצת ה־Frontend

cd ../client
npm run dev


האתר יעלה בכתובת:
http://localhost:3000

# ..................................
# משתמשים והרשאות (MVP)

# לכל משתמש יש שדה is_admin.

# משתמש רגיל:

# יכול להתחבר

# יכול לצפות במוצרים

# אדמין בלבד:

# /admin/products

# /admin/groups

# גישה לעמודי Admin חסומה אוטומטית למשתמשים שאינם אדמין.

API – בדיקות מהירות (Postman)

# מוצרים ציבוריים
GET http://localhost:4000/api/products


# מוצרים – אדמין בלבד
GET / POST / PUT / DELETE
http://localhost:4000/api/admin/products
Authorization: Bearer <TOKEN>


# קבוצות – אדמין בלבד
GET / POST / PUT / DELETE
http://localhost:4000/api/admin/groups
Authorization: Bearer <TOKEN>


# .....................................................................................................

# הערות חשובות לצוות

# אין להשתמש ב־MongoDB.

# PostgreSQL יכול לרוץ:

# מקומית על המחשב

# או באמצעות Docker (מומלץ למי שלא רוצה התקנה מקומית)

# אין צורך ב־Docker להרצת ה־Backend או ה־Frontend עצמם.

# התיקיות הבאות לא עולות ל־Git:

# node_modules

# .env

# .next

# dist

# התיקיות BACKEND ו־express-api אינן קיימות ואינן רלוונטיות לפרויקט.


# ........................................................................................................

# סיום

# אם ה־Backend וה־Frontend רצים,
# והתחברות + אדמין עובדים – הפרויקט מוכן לעבודה.
