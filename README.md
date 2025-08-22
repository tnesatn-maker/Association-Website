# TNESA — CCTV System Integrator Directory

React + Firebase (Auth, Firestore, Storage). Features:
- Public installer directory with search/filter
- Star ratings
- Badges: Silver/Gold/Platinum + Verified
- Member dashboard to edit profile and upload certificate
- Admin panel to verify and assign badges

## Quick Start
1. Create a Firebase project and enable Email/Password and Google sign-in.
2. Create Firestore & Storage.
3. Copy `.env.example` to `.env` and fill values from Firebase console.
4. Install & run:
   ```bash
   npm install
   npm run dev
   ```

## Environment
Create `.env` in the project root:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Admin Access
- Set custom claim `admin: true` on an account (via Firebase Admin SDK) or add field `isAdmin: true` in Firestore for UI.
- Update Firestore security rules accordingly (see src/utils/firestoreRules.txt).

## Notes
- Average rating on list page is stored as `avgRating` field if you choose to maintain it with Cloud Functions or you can compute client-side.
- For production, consider indexing and pagination on directory.
