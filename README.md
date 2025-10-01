# IQ Labs Backend (Node.js + Express + MongoDB)

## Setup
1. Unzip project
2. `npm install`
3. Ensure MongoDB is running and `.env` has correct `MONGO_URI`
4. `npm run dev` or `npm start`
5. Admin login: use `.env` ADMIN_EMAIL and ADMIN_PASSWORD

## Notes
- Admin routes require `Authorization: Bearer <token>`
- Uploads saved under `/uploads`
- Generate PDF reports available under `/reports`



