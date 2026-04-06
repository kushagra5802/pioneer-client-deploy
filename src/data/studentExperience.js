export const gradeCategories = [
  { value: "8", label: "Grade 8" },
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

export const interestOptions = [
  { value: "sports", label: "Sports" },
  { value: "arts", label: "Arts" },
  { value: "hobbies", label: "Hobbies" },
];

export const targetExams = [
  {
    title: "CUET",
    tag: "University Pathway",
    date: "May 2026",
    detail: "Central universities entrance preparation tracker and mock plan.",
  },
  {
    title: "JEE",
    tag: "Engineering",
    date: "January 2027",
    detail: "Build your 90-day physics and mathematics concept sprint.",
  },
  {
    title: "NEET",
    tag: "Medical",
    date: "May 2027",
    detail: "Strengthen biology revision, test cadence, and NCERT coverage.",
  },
];

export const upcomingEventsByInterest = {
  sports: [
    {
      title: "District Athletics Camp",
      category: "Sports",
      date: "12 Apr 2026",
      location: "City Stadium",
    },
    {
      title: "Inter-School Badminton League",
      category: "Sports",
      date: "22 Apr 2026",
      location: "Indoor Sports Complex",
    },
  ],
  arts: [
    {
      title: "Youth Art Portfolio Workshop",
      category: "Arts",
      date: "16 Apr 2026",
      location: "District Art Centre",
    },
    {
      title: "Creative Writing Showcase",
      category: "Arts",
      date: "27 Apr 2026",
      location: "Town Library Auditorium",
    },
  ],
  hobbies: [
    {
      title: "Robotics Hobby Maker Day",
      category: "Hobbies",
      date: "18 Apr 2026",
      location: "Innovation Lab",
    },
    {
      title: "Photography Story Walk",
      category: "Hobbies",
      date: "30 Apr 2026",
      location: "Heritage City Route",
    },
  ],
};

const welcomeProfileKey = "studentWelcomeProfile";

export const readWelcomeProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(welcomeProfileKey) || "null");
  } catch (error) {
    return null;
  }
};

export const saveWelcomeProfile = (profile) => {
  localStorage.setItem(welcomeProfileKey, JSON.stringify(profile));
};

export const getStudentName = (user) =>
  user?.personalInfo?.fullName || user?.name || "Aryan Sharma";

export const getInitialGrade = (user) => {
  const classGrade = user?.academicInfo?.classGrade;
  return classGrade ? String(classGrade).replace(/\D/g, "") || "12" : "12";
};

export const isSeniorGrade = (grade) => ["11", "12"].includes(String(grade));

export const buildInterestEvents = (interests = []) => {
  const selectedInterests = interests.length ? interests : ["sports", "arts"];
  return selectedInterests.flatMap(
    (interest) => upcomingEventsByInterest[interest] || []
  );
};
