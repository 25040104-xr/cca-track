// Mock data: users of CCATrack.
// - "stu-01" is the student we pretend is logged in (see CURRENT_STUDENT_ID in applicationService.js)
// - role is "student" or "exco" (login with roles will be added in CA2)
// Names, emails and courses are made up for the prototype.
// In CA2 this becomes the Student (user) table in the database.
export const studentData = [
  {
    id: "stu-01",
    name: "Tan Mei Ling",
    email: "26010001@myrp.edu.sg",
    course: "Diploma in Information Technology",
    role: "student",
  },
  {
    id: "stu-02",
    name: "Muhammad Irfan",
    email: "26010002@myrp.edu.sg",
    course: "Diploma in Business Management",
    role: "student",
  },
  {
    id: "stu-03",
    name: "Priya Nair",
    email: "26010003@myrp.edu.sg",
    course: "Diploma in Psychology Studies",
    role: "student",
  },
  {
    id: "stu-04",
    name: "Lim Jun Wei",
    email: "26010004@myrp.edu.sg",
    course: "Diploma in Engineering Systems",
    role: "student",
  },
  {
    id: "stu-05",
    name: "Chloe Wong",
    email: "26010005@myrp.edu.sg",
    course: "Diploma in Mass Communication",
    role: "student",
  },
  {
    id: "stu-06",
    name: "Daniel Ong",
    email: "26010006@myrp.edu.sg",
    course: "Diploma in Sports and Exercise Sciences",
    role: "student",
  },
  {
    id: "exco-01",
    name: "Ng Hui Min",
    email: "25010099@myrp.edu.sg",
    course: "Diploma in Information Technology",
    role: "exco",
  },
];
