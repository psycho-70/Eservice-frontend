# Frontend Setup Instructions

## Environment Configuration

1. Create a `.env.local` file in the root directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Backend Integration

The frontend is now configured to work with your Node.js backend:

### Default Admin User
- **Email**: `adminsdk@gmail.com`
- **Password**: `123456`

### Features Implemented

1. **Authentication**
   - Sign in page connects to your backend API
   - JWT token storage in localStorage
   - Automatic redirect to admin dashboard on successful login
   - Auth guard protection for admin routes

2. **Admin Dashboard**
   - QR form modal (click "+ جديد QR" button)
   - Verification form modal (click green "إضافة + بيانات التحقق" button)
   - Bulk delete functionality with checkboxes
   - QR code download and PDF download
   - Logout functionality

3. **User Document Verification Page** (Separate Route)
   - Standalone public page at `/document-verify`
   - Search by reference number functionality
   - Displays user information in two-panel layout
   - PDF download functionality
   - Professional header and footer design
   - RTL layout for Arabic content
   - No admin integration - completely separate

4. **API Endpoints Used**
   - `POST /api/users/login` - User authentication
   - `POST /api/qr-forms` - Create QR form
   - `GET /api/qr-forms` - Fetch all forms
   - `PUT /api/qr-forms/:id/verification` - Update verification data
   - `DELETE /api/qr-forms/:id` - Delete form
   - `GET /api/qr-forms/:id/download` - Download PDF file
   - Backend URL configurable via environment variable

## Running the Application

1. Start your Node.js backend on port 5000
2. Run the Next.js frontend:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000`
4. Sign in with the default admin credentials

## File Structure

- `src/app/(auth)/signin/page.tsx` - Sign in page with backend integration
- `src/app/admin/layout.tsx` - Admin layout with auth protection
- `src/app/admin/form-data/page.tsx` - Main admin page with modals
- `src/app/admin/form-data/VerificationFormModal.tsx` - Verification form component
- `src/app/document-verify/page.tsx` - Standalone user verification page

## Testing the User Verification Page

1. **Create a QR form** in the admin dashboard
2. **Add verification data** using the green button
3. **Visit the user verification page**: `http://localhost:3000/document-verify`
4. **Enter the reference number** to search for the document
5. **View the document information** and download PDF if available

## Separate Systems

- **Admin Portal**: `http://localhost:3000/admin` - For administrators only
- **User Verification**: `http://localhost:3000/document-verify` - For public document verification
