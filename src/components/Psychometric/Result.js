import { useState } from "react"
import { Modal } from "antd"
import PageHeader from "../PageHeader"
import { Brain, Briefcase, ChevronRight,Compass,Users } from "lucide-react"
import Info from "./AcademicSelfEfficacy/Info"
import MBTIInfo from "./MBTI/Info"
import CareerInfo from "./CareerMaturity/Info"
import RiasecInfo from "./Riasec/Info"

export default function PsychometricTestsPage() {
  const [openTest, setOpenTest] = useState(null)

  const tests = [
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
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md cursor-pointer group transition"
              >
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