This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Database ER Diagram
**Student Attributes:** id(primary key), email, name, password(not required now), bio, profile_picture\
**Course Attributes:** course_id(primary key), title, description, teacher_id (foreign key references Teacher), category, price (optional), and many other fields\
**Teacher Attributes:** teacher_id(primary key), name, email, bio, profile_picture (optional), expertise(composite)\
**Enrollment Attributes:** enrollment_id (primary key), student_id (foreign key references Student), course_id (foreign key references Course), start_date, completion_date (optional)\
**Feedback Attributes:** feedback_id (primary key), student_id (foreign key references Student), course_id (foreign key references Course), rating, comment, date\
**Comment Attributes:** comment_id (primary key), enrollment_id (foreign key references Enrollment), content, date, course_id (foreign key references Course), reply_of(foreign key references Comment)

Student <------> Course\
Teacher <------- Course\
FeedBack ------- Student\
FeedBack ------> Course\
Student <------> Comment

