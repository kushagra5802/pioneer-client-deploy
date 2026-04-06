import { useMemo, useRef, useState } from "react";
import generatePDF, { Margin, Resolution } from "react-to-pdf";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Download,
  FileCheck2,
  GraduationCap,
  Palette,
  User,
} from "lucide-react";
import PageHeader from "../PageHeader";

const steps = [
  { id: 1, title: "Personal Info", icon: <User size={16} /> },
  { id: 2, title: "Academics", icon: <GraduationCap size={16} /> },
  { id: 3, title: "Achievements", icon: <Award size={16} /> },
  { id: 4, title: "Preview", icon: <Palette size={16} /> },
  { id: 5, title: "Download", icon: <FileCheck2 size={16} /> },
];

const themeOptions = [
  { name: "Indigo", primary: "#4F46E5", accent: "#EEF2FF" },
  { name: "Slate", primary: "#0F172A", accent: "#F1F5F9" },
  { name: "Emerald", primary: "#059669", accent: "#ECFDF5" },
];

const layoutOptions = ["Classic", "Modern", "Compact"];

const readStudentProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("users") || "null");
  } catch (error) {
    return null;
  }
};

const getInitialCvData = () => {
  const student = readStudentProfile();

  const fullName = student?.personalInfo?.fullName || "";
  const email = student?.contactInfo?.studentEmail || "";
  const phone = student?.contactInfo?.mobileNumber || "";
  const city = student?.addressInfo?.city || "";
  const state = student?.addressInfo?.state || "";
  const location = [city, state].filter(Boolean).join(", ");
  const classGrade = student?.academicInfo?.classGrade
    ? `${student.academicInfo.classGrade}${student?.academicInfo?.section ? ` - Section ${student.academicInfo.section}` : ""}`
    : "";

  return {
    fullName,
    email,
    phone,
    location,
    classGrade,
    schoolName: "",
    boardScores: "",
    subjects: "",
    academicAchievements: "",
    coCurricularAchievements: "",
    careerObjective: "",
    theme: themeOptions[0],
    layoutStyle: "Modern",
  };
};

export default function CVBuilder() {
  const previewRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);
  const [cvData, setCvData] = useState(() => getInitialCvData());

  const updateField = (field, value) => {
    setCvData((current) => ({ ...current, [field]: value }));
  };

  const exportOptions = useMemo(
    () => ({
      filename: `${cvData.fullName.replace(/\s+/g, "-") || "student"}-cv.pdf`,
      method: "save",
      resolution: Resolution.HIGH,
      page: {
        margin: Margin.SMALL,
        format: "A4",
        orientation: "portrait",
      },
      canvas: {
        mimeType: "image/png",
        qualityRatio: 1,
      },
      overrides: {
        pdf: {
          compress: true,
        },
        canvas: {
          scale: 2,
          useCORS: true,
        },
      },
    }),
    [cvData.fullName]
  );

  const renderInput = (label, field, placeholder, type = "text") => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={cvData[field]}
        onChange={(event) => updateField(field, event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white"
        placeholder={placeholder}
      />
    </label>
  );

  const renderTextArea = (label, field, placeholder) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <textarea
        rows={4}
        value={cvData[field]}
        onChange={(event) => updateField(field, event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white"
        placeholder={placeholder}
      />
    </label>
  );

  const renderPreviewCard = () => (
    <div
      ref={previewRef}
      className={`overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm ${
        cvData.layoutStyle === "Compact" ? "max-w-2xl" : "max-w-3xl"
      }`}
    >
      <div
        className={`p-8 ${
          cvData.layoutStyle === "Classic" ? "" : "flex items-start gap-8"
        }`}
        style={{ background: cvData.theme.accent }}
      >
        <div className="flex-1">
          <input
            value={cvData.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className="w-full bg-transparent text-4xl font-bold outline-none"
            style={{ color: cvData.theme.primary }}
          />
          <input
            value={cvData.classGrade}
            onChange={(event) => updateField("classGrade", event.target.value)}
            className="mt-3 w-full bg-transparent text-sm font-semibold uppercase tracking-[0.16em] text-slate-600 outline-none"
          />
          <textarea
            value={cvData.careerObjective}
            onChange={(event) => updateField("careerObjective", event.target.value)}
            rows={3}
            className="mt-4 w-full resize-none bg-transparent text-sm leading-6 text-slate-700 outline-none"
            placeholder="Add your career objective or professional summary"
          />
        </div>
        <div
          className={`rounded-3xl bg-white/80 p-5 text-sm text-slate-700 ${
            cvData.layoutStyle === "Classic" ? "mt-6" : "min-w-[220px]"
          }`}
        >
          <p className="font-semibold">{cvData.email}</p>
          <p className="mt-2">{cvData.phone}</p>
          <p className="mt-2">{cvData.location}</p>
        </div>
      </div>

      <div
        className={`grid gap-6 p-8 ${
          cvData.layoutStyle === "Modern" ? "lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        <section className="rounded-3xl bg-slate-50 p-6">
          <h3
            className="text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: cvData.theme.primary }}
          >
            Academics
          </h3>
          <p className="mt-4 text-xl font-bold text-slate-900">
            {cvData.schoolName || "Add your school name"}
          </p>
          <p className="mt-2 text-sm text-slate-700">
            {cvData.boardScores || "Add your board scores or academic summary"}
          </p>
          <p className="mt-2 text-sm text-slate-700">
            {cvData.subjects || "Add your core subjects"}
          </p>
        </section>

        <section className="rounded-3xl bg-slate-50 p-6">
          <h3
            className="text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: cvData.theme.primary }}
          >
            Achievements
          </h3>
          <textarea
            value={cvData.academicAchievements}
            onChange={(event) =>
              updateField("academicAchievements", event.target.value)
            }
            rows={3}
            className="mt-4 w-full resize-none bg-transparent text-sm leading-6 text-slate-700 outline-none"
            placeholder="Add academic achievements"
          />
          <div className="my-4 h-px bg-slate-200" />
          <textarea
            value={cvData.coCurricularAchievements}
            onChange={(event) =>
              updateField("coCurricularAchievements", event.target.value)
            }
            rows={3}
            className="w-full resize-none bg-transparent text-sm leading-6 text-slate-700 outline-none"
            placeholder="Add co-curricular achievements"
          />
        </section>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="grid gap-5 lg:grid-cols-2">
            {renderInput("Full Name", "fullName", "Enter your full name")}
            {renderInput("Contact Number", "phone", "Enter phone number")}
            {renderInput("Email Address", "email", "Enter email", "email")}
            {renderInput("Class / Grade", "classGrade", "Example: 12th Grade")}
            <div className="lg:col-span-2">
              {renderInput("Location", "location", "City, State")}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid gap-5">
            {renderInput("School Details", "schoolName", "School name")}
            {renderInput("Board Scores", "boardScores", "Board marks or GPA")}
            {renderInput("Subjects", "subjects", "List major subjects")}
          </div>
        );
      case 3:
        return (
          <div className="grid gap-5">
            {renderTextArea(
              "Academic Achievements",
              "academicAchievements",
              "Mention academic awards, Olympiads, research, or project work"
            )}
            {renderTextArea(
              "Co-curricular Activities",
              "coCurricularAchievements",
              "Mention leadership, clubs, sports, arts, volunteering, or competitions"
            )}
            {renderTextArea(
              "Career Objective",
              "careerObjective",
              "Write a concise professional summary"
            )}
          </div>
        );
      case 4:
        return (
          <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
            <div className="rounded-[24px] bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Customize CV
              </p>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-700">Colors</p>
                <div className="mt-3 grid gap-3">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => updateField("theme", theme)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold ${
                        cvData.theme.name === theme.name
                          ? "border-indigo-500 bg-white text-slate-900"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {theme.name}
                      <span
                        className="h-5 w-5 rounded-full"
                        style={{ background: theme.primary }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-slate-700">
                  Layout Style
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {layoutOptions.map((layout) => (
                    <button
                      key={layout}
                      type="button"
                      onClick={() => updateField("layoutStyle", layout)}
                      className={`rounded-full px-5 py-3 text-sm font-semibold ${
                        cvData.layoutStyle === layout
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-8 text-xs leading-6 text-slate-500">
                Tip: Edit your name, objective, and achievement text directly in
                the live preview card on the right.
              </p>
            </div>

            {renderPreviewCard()}
          </div>
        );
      case 5:
        return (
          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            {renderPreviewCard()}
            <div className="rounded-[24px] bg-slate-900 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
                Export CV
              </p>
              <h2 className="mt-4 text-3xl font-bold">
                Download your polished CV as a professional PDF.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                The preview on the left is rendered exactly into the exported PDF
                with your selected color theme and layout style.
              </p>
              <button
                type="button"
                onClick={() => generatePDF(previewRef, exportOptions)}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-indigo-600"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHeader name="CV Builder" />

      <main className="p-8">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                5-Step Guided Wizard
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Create Your Professional CV
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
                    activeStep === step.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {step.icon}
                  {step.id}. {step.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">{renderStepContent()}</div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => setActiveStep((step) => Math.max(1, step - 1))}
              disabled={activeStep === 1}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep((step) => Math.min(5, step + 1))}
              disabled={activeStep === 5}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next Step
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
