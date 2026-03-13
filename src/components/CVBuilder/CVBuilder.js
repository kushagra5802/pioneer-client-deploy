import { useState } from 'react';
import PageHeader from '../PageHeader';
import { Download, CheckCircle } from 'lucide-react';

export default function CVBuilder() {
  const [fullName, setFullName] = useState('Aryan Sharma');
  const [studentClass, setStudentClass] = useState('12th Grade (Science)');
  const [academicAchievements, setAcademicAchievements] = useState('');
  const [coCurricularAchievements, setCoCurricularAchievements] = useState('');

  const autoSkills = [
    {
      id: 'skill-1',
      title: 'Critical Thinking',
      grade: 'Grade A',
    },
  ];

  const handleDownloadCV = () => {
    // Later: connect to backend / docx generator
    console.log({
      fullName,
      studentClass,
      academicAchievements,
      coCurricularAchievements,
      autoSkills,
    });

    alert('CV downloaded successfully! (demo)');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="CV Builder" />

      <main className="p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">

          {/* Header */}
          <h2 className="text-2xl font-bold mb-6">
            Create Your Professional CV
          </h2>

          {/* Name & Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 bg-slate-50"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Class
              </label>
              <input
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 bg-slate-50"
                placeholder="Enter class"
              />
            </div>
          </div>

          {/* Academic Achievements */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Academic Achievements
            </label>
            <textarea
              value={academicAchievements}
              onChange={(e) => setAcademicAchievements(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-4 py-3 bg-slate-50"
              placeholder="E.g., Secured 95% in 10th Board Exams..."
            />
          </div>

          {/* Co-Curricular Achievements */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Co-Curricular Achievements
            </label>
            <textarea
              value={coCurricularAchievements}
              onChange={(e) => setCoCurricularAchievements(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-4 py-3 bg-slate-50"
              placeholder="E.g., Captain of School Debate Team..."
            />
          </div>

          {/* Auto Added Skills */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="text-blue-600" size={20} />
              <h3 className="font-semibold text-blue-700">
                Auto-Added Skills
              </h3>
            </div>

            <p className="text-sm text-blue-700 mb-3">
              The following skill courses from Project Pioneer will be automatically appended to your CV:
            </p>

            <ul className="list-disc ml-6 text-sm text-blue-800">
              {autoSkills.map((skill) => (
                <li key={skill.id}>
                  {skill.title} ({skill.grade})
                </li>
              ))}
            </ul>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownloadCV}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold"
          >
            <Download size={18} />
            Download CV (.docx)
          </button>
        </div>
      </main>
    </div>
  );
}
