# Inner Circle - Investor Management System

## 🚀 Client Presentation Guide (Read Before Tomorrow)

This system has been enhanced for high-stakes client presentation. It currently supports two modes:

### 1. Local Mode (XAMPP + Node.js)
Ideal for local development and offline demos.
- **Backend**: `/backend` folder (Express API + MySQL).
- **Database**: XAMPP MySQL (db: `inner_circle`).
- **Start**: Run `node backend/server.js` and `npm run dev` in the root.

### 2. Vercel Cloud Mode (Deployment Ready)
To host the app on Vercel for your client:
1. **GitHub**: Push this entire project to a private GitHub repository.
2. **Vercel**: Import the project to Vercel.
3. **Environment Variables**: In the Vercel project settings, add:
   - `VITE_API_URL`: Use the URL of your hosted backend.
4. **Cloud Backend Options**:
   - **Recommended**: Move back to **Supabase** for the Cloud version. (Supabase is infinitely easier for Vercel deployments).
   - If you stick to Node.js, you must host the `/backend` folder on a service like **Render** or **Railway**.

## 💎 Features Implemented for the Showcase

1. **Premium Dashboard Visuals**:
   - **Real AUM Growth**: The Admin chart is now dynamic and calculates growth from transaction history.
   - **Live Analytics**: AUM, Investor Count, and Profit YTD are calculated instantly from the database.
2. **Operational Efficiency**:
   - **Bulk Profit Distribution**: New "Operations" page allowing admins to distribute percentage-based profits to all active investors at once.
   - **Add Investor Modal**: Fully designed registration workflow for adding new clients and injecting initial capital.
3. **Responsive Aesthetics**:
   - **Dark/Light Mode**: Smooth theme switching using shared CSS variables.
   - **Vibrant Badges**: Improved status and transaction type coloring.
4. **Data Consistency**:
   - Full JWT-based authentication.
   - Consistent balance tracking across deposits, profits, and withdrawals.

## 🔑 Demo Credentials
- **Admin**: `trader@p3l.com` / `Guyesa_10333`
- **Investor**: `razak@innercircle.com` / `guyesa10333`

---

### 🛡️ Pre-Presentation Checklist
1. [ ] Ensure **MySQL** is running in XAMPP.
2. [ ] Ensure **Node Backend** is running (`node backend/server.js`).
3. [ ] If deploying to Vercel, ensure you've set the correct `VITE_API_URL`.
