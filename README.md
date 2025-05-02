# Doctor Consultation Platform

This is a **Doctor Consultation Platform** built using [Next.js](https://nextjs.org). The platform allows users to search for doctors, filter them based on various criteria, and add new doctor profiles to the system. It is designed to provide a seamless experience for both patients and administrators.

## Features

- **Doctor Listing**: View a list of doctors with their details such as name, specialty, experience, and fees.
- **Filters**: Filter doctors based on specialty, location, experience, consultation mode (online or hospital), fees, and language.
- **Add Doctor**: Add new doctor profiles to the system via a form.
- **Dynamic Updates**: The page dynamically updates as you interact with filters or add new doctors.
- **Responsive Design**: Fully responsive UI for desktop and mobile devices.

## Technologies Used

- **Frontend**: [Next.js](https://nextjs.org), React, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Database**: MongoDB (via Mongoose)
- **HTTP Client**: Axios

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Package manager: npm, yarn, or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Princekashish/Doctor-s-listing.git
   cd Doctor-s-listing
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## API Endpoints

### Add Doctor

- **Endpoint**: `/api/add-doctor`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Dr. John Doe",
    "specialty": "General Physician",
    "experience": 10,
    "location": "New York",
    "clinic": "Health Clinic",
    "fee": 500,
    "onlineFee": 400,
    "visitFee": 600,
    "qualifications": "MBBS, MD"
  }
  ```
- **Response**:
  - Success: `201 Created`
  - Error: `400 Bad Request`

## Folder Structure

```
.
├── src
│   ├── app
│   │   ├── page.tsx          # Main page for doctor consultation
│   │   ├── api
│   │   │   └── add-doctor
│   │   │       └── route.ts  # API route for adding doctors
│   ├── models
│   │   └── Doctor.ts         # Mongoose schema for Doctor
│   ├── lib
│   │   └── dbConnect.ts      # MongoDB connection utility
├── public                    # Static assets
├── styles                    # Global styles
├── .env.local                # Environment variables
└── README.md                 # Project documentation
```

## How to Use

1. **Search for Doctors**:
   - Use the filters on the left sidebar to narrow down your search.
   - Doctors will be displayed dynamically based on the selected filters.

2. **Add a Doctor**:
   - Click the "Add Doctor" button.
   - Fill in the required details in the popup form.
   - Submit the form to add the doctor to the database.

3. **View Doctor Details**:
   - Each doctor card displays their name, specialty, experience, and fees.
   - Additional details like clinic and qualifications are also shown.

## Deployment

The easiest way to deploy this Next.js app is to use [Vercel](https://vercel.com). Follow these steps:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import your project.
3. Set up the environment variables in the Vercel dashboard.
4. Deploy your app with a single click.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
