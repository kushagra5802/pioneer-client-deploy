import { useState } from "react"
import { Modal } from "antd"
import PageHeader from "../PageHeader"
import { Brain, Briefcase, ChevronRight,Compass,Users,Compass as Disha, Target, LineChart, HeartPulse, Rocket, Milestone, GraduationCap, Lightbulb, Crown } from "lucide-react"
import Info from "./AcademicSelfEfficacy/Info"
import MBTIInfo from "./MBTI/Info"
import CareerInfo from "./CareerMaturity/Info"
import RiasecInfo from "./Riasec/Info"
import DISHAInfo from "./DISHA/Info"
import DISHA2Info from "./DISHA2/Info"
import DISHA3Info from "./DISHA3/Info"
import DISHA4Info from "./DISHA4/Info"
import DISHA5Info from "./DISHA5/Info"
import DISHAC10Info from "./DISHAC10/Info"
import DISHAC12Info from "./DISHAC12/Info"
import DISHA6Info from "./DISHA6/Info"
import DISHA7Info from "./DISHA7/Info"
import DISHA8Info from "./DISHA8/Info"

export default function PsychometricTestsPage() {
  const [openTest, setOpenTest] = useState(null)

  const tests = [
    {
      id: "disha",
      title: "DISHA — Career Direction (Flagship)",
      description:
        "The flagship Indian assessment combining your actual academic marks with aptitude, personality (OCEAN), interests (RIASEC), work values and situational judgment across 11 modules.",
      icon: Disha,
      featured: true,
    },
    {
      id: "disha2",
      title: "DISHA Test 2 — Interests & Motivations",
      description:
        "Maps what you enjoy, value and find meaningful — RIASEC activity preferences, 60 Indian career ratings, work values, career motivations, work-environment fit and situational judgment.",
      icon: Target,
      featured: true,
    },
    {
      id: "disha3",
      title: "DISHA Test 3 — Academic Performance",
      description:
        "Grounds everything in your real marks — Subject Strength Index, trends, learning styles, study habits, exam preparedness, stream recommendation and entrance-exam probability estimates.",
      icon: LineChart,
      featured: true,
    },
    {
      id: "disha4",
      title: "DISHA Test 4 — Emotional Intelligence",
      description:
        "Measures emotional intelligence, resilience, grit, empathy and cultural adaptability through 5 sections and 15 real Indian scenarios — the skills that sustain success under pressure.",
      icon: HeartPulse,
      featured: true,
    },
    {
      id: "disha5",
      title: "DISHA Test 5 — Future-Readiness",
      description:
        "Measures career adaptability (4Cs), growth mindset, decision-making style, learning agility, risk tolerance and AI-readiness — how well-equipped you are for India's 2030 career landscape.",
      icon: Rocket,
      featured: true,
    },
    {
      id: "disha6",
      title: "DISHA Test 6 — Creativity & Entrepreneurship",
      description:
        "8 open-ended creative tasks plus innovation mindset, entrepreneurial readiness, problem-solving style and design sensitivity — discover your Creative Quotient and startup potential.",
      icon: Lightbulb,
      featured: true,
    },
    {
      id: "disha7",
      title: "DISHA Test 7 — Leadership & Organisational Fit",
      description:
        "Leadership Potential Index, management aptitude, Belbin team-role profile, authority orientation, ethical leadership and organisational fit — where your leadership will thrive.",
      icon: Crown,
      featured: true,
    },
    {
      id: "disha8",
      title: "DISHA Test 8 — Life Values & Lifestyle Fit (Capstone)",
      description:
        "The final DISHA test: your core life values, work-life balance needs, lifestyle goals, money mindset and long-term satisfaction predictors — what kind of life do you actually want to live?",
      icon: Compass,
      featured: true,
    },
    {
      id: "dishac10",
      title: "DISHA — Stream Selection Test (Class 10 only)",
      description:
        "A focused 35–40 min assessment for Class 10 students choosing a stream — combining marks, aptitude, interests, values and real-life scenarios into a Science PCM / PCB, Commerce or Humanities recommendation.",
      icon: Milestone,
      featured: true,
    },
    {
      id: "dishac12",
      title: "DISHA — Career Selection Test (Class 12 only)",
      description:
        "A comprehensive 55–70 min assessment for Class 12 students finalising a career, college and entrance-exam path — 3-year academic trajectory, extended aptitude, full RIASEC, values, life design and Top 12 career recommendations.",
      icon: GraduationCap,
      featured: true,
    },
    {
      id: "academic-self-efficacy",
      title: "Academic Self-Efficacy",
      description:
        "Measure your confidence in academic abilities across 12 key dimensions including learning, memory, exam skills, and critical thinking.",
      icon: Brain,
    },
    {
        id: "mbti-personality",
        title: "MBTI Personality Test",
        description:
        "Discover your 4-letter personality type based on 70 scientifically structured forced-choice questions measuring E/I, S/N, T/F, and J/P.",
        icon: Users,
    },
    {
      id: "career-maturity",
      title: "Career Maturity Inventory",
      description:
        "Evaluate your readiness to make informed career decisions across four dimensions: concern, curiosity, confidence, and consultation.",
      icon: Briefcase,
    },
    {
      id: "riasec-test",
      title: "RIASEC Career Interest Test",
      description:
        "Discover your Holland Code personality type (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) and identify careers that match your interests.",
      icon: Compass,
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="Psychometric Tests" />

      <main className="p-8">
        <div className="max-w-8xl mx-auto">

          {/* Page Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Explore Psychometric Assessments
            </h1>
            <p className="text-slate-500 max-w-2xl">
              Discover scientifically designed assessments to evaluate your academic confidence,
              cognitive abilities, and career readiness.
            </p>
          </div>

          {/* Test Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test.id}
                onClick={() => setOpenTest(test.id)}
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md cursor-pointer group transition`}
              >
                {/* {test.featured && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-[#004877] rounded-full px-2 py-0.5 mb-3">
                    Flagship
                  </span>
                )} */}
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <test.icon className="w-6 h-6 text-indigo-600" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {test.title}
                </h3>

                <p className="text-slate-500 text-sm mb-4">
                  {test.description}
                </p>

                <button className="flex items-center gap-2 text-sm font-semibold text-indigo-500 uppercase tracking-wider group-hover:gap-3 transition-all">
                  Start Assessment
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* AntD Modal */}
      <Modal
        open={openTest === "disha"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHAInfo />
      </Modal>
      <Modal
        open={openTest === "disha2"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHA2Info />
      </Modal>
      <Modal
        open={openTest === "disha3"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHA3Info />
      </Modal>
      <Modal
        open={openTest === "disha4"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHA4Info />
      </Modal>
      <Modal
        open={openTest === "disha5"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHA5Info />
      </Modal>
      <Modal
        open={openTest === "disha6"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHA6Info />
      </Modal>
      <Modal
        open={openTest === "disha7"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHA7Info />
      </Modal>
      <Modal
        open={openTest === "disha8"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHA8Info />
      </Modal>
      <Modal
        open={openTest === "dishac10"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHAC10Info />
      </Modal>
      <Modal
        open={openTest === "dishac12"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: "92vh", overflowY: "auto", borderRadius: "50px" }}
        destroyOnClose
      >
        <DISHAC12Info />
      </Modal>
      <Modal
        open={openTest === "academic-self-efficacy"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="80%"
        style={{ top: 30 }}
        bodyStyle={{ padding: 0, maxHeight: "90vh", overflowY: "auto", borderRadius:"50px" }}
        destroyOnClose
      >
        <Info />
      </Modal>
      <Modal
        open={openTest === "mbti-personality"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="80%"
        style={{ top: 30 }}
        bodyStyle={{
            padding: 0,
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "50px",
        }}
        destroyOnClose
        >
        <MBTIInfo />
      </Modal>
      <Modal
        open={openTest === "career-maturity"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="80%"
        style={{ top: 30 }}
        bodyStyle={{
          padding: 0,
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "50px",
        }}
        destroyOnClose
      >
        <CareerInfo />
      </Modal>
      <Modal
        open={openTest === "riasec-test"}
        onCancel={() => setOpenTest(null)}
        footer={null}
        width="80%"
        style={{ top: 30 }}
        bodyStyle={{
          padding: 0,
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "50px",
        }}
        destroyOnClose
      >
        <RiasecInfo />
      </Modal>
    </div>
  )
}