// Mock data: students who apply to CCAs.
// - id is used as studentId in applications.js and notifications.js
// - "stu-01" is the student we pretend is logged in (see currentUser.js)
// In CA2 this becomes the Student table in the database.
export const studentData = [
  { id: "stu-01", name: "Lee Jihao", email: "25012345@myrp.edu.sg", course: "Diploma in Information Technology" },
  { id: "stu-02", name: "Tan Wei Ming", email: "25023456@myrp.edu.sg", course: "Diploma in Business" },
  { id: "stu-03", name: "Nur Aisyah", email: "25034567@myrp.edu.sg", course: "Diploma in Applied Science" },
  { id: "stu-04", name: "Lim Jia Hui", email: "25045678@myrp.edu.sg", course: "Diploma in Engineering" },
  { id: "stu-05", name: "Arjun Kumar", email: "25056789@myrp.edu.sg", course: "Diploma in Sports and Exercise Sciences" },
  { id: "stu-06", name: "Chloe Ng", email: "25067890@myrp.edu.sg", course: "Diploma in Media Production and Design" },
];

// Find one student by id (returns undefined if not found)
export function getStudentById(id) {
  return studentData.find((student) => student.id === id);
}