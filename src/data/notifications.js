// Mock data: notifications sent to students when their application status changes.
// In CA2, the backend creates one of these automatically every time an exco updates a status.
export const notificationData = [
  {
    id: "noti-01",
    studentId: "stu-01",
    applicationId: "app-04",
    message: "Your application to Photo Republic has been received. Expect a reply by 21 Nov.",
    read: false,
    createdAt: "2026-11-16",
  },
  {
    id: "noti-02",
    studentId: "stu-01",
    applicationId: "app-03",
    message: "Student Council has scheduled your interview: Mon 24 Nov, 5pm at the Student Lounge.",
    read: false,
    createdAt: "2026-11-14",
  },
  {
    id: "noti-03",
    studentId: "stu-01",
    applicationId: "app-05",
    message: "Badminton has updated your application: Not Selected. Thank you for trying out!",
    read: true,
    createdAt: "2026-11-13",
  },
  {
    id: "noti-04",
    studentId: "stu-01",
    applicationId: "app-01",
    message: "Congratulations! You have been accepted into Chinese Ensemble.",
    read: true,
    createdAt: "2026-11-10",
  },
  {
    id: "noti-05",
    studentId: "stu-01",
    applicationId: "app-01",
    message: "Chinese Ensemble has scheduled your trial: Fri 7 Nov, 6pm at the Music Room.",
    read: true,
    createdAt: "2026-11-05",
  },
  {
    id: "noti-06",
    studentId: "stu-02",
    applicationId: "app-11",
    message: "Chinese Ensemble has scheduled your trial: Fri 7 Nov, 6pm at the Music Room.",
    read: false,
    createdAt: "2026-11-05",
  },
];
