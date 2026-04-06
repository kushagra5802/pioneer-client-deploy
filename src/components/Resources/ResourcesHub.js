import { useMemo } from "react";
import { useQuery } from "react-query";
import {
  ArrowUpRight,
  BookOpenCheck,
  Download,
  FileText,
  Globe,
} from "lucide-react";
import PageHeader from "../PageHeader";
import useAxiosInstance from "../../lib/useAxiosInstance";

const resourceSections = [
  {
    title: "Downloadable Guides",
    icon: <FileText size={20} />,
    items: [
      {
        title: "Career Roadmap Workbook",
        meta: "PDF Guide - 12 pages",
        description:
          "A structured reflection workbook to compare streams, courses, and long-term goals.",
        actionLabel: "Download PDF",
      },
      {
        title: "Scholarship Application Checklist",
        meta: "PDF Template - Updated 2026",
        description:
          "Track documents, deadlines, and essay requirements across scholarship rounds.",
        actionLabel: "Download PDF",
      },
    ],
  },
  {
    title: "Educational Content",
    icon: <BookOpenCheck size={20} />,
    items: [
      {
        title: "Choosing the Right Stream After Grade 10",
        meta: "Interactive Reading Module",
        description:
          "Compare science, commerce, humanities, and emerging interdisciplinary paths.",
        actionLabel: "Open Module",
      },
      {
        title: "Skill-Building Starter Kit",
        meta: "Curated Video + Reading List",
        description:
          "Explore communication, digital fluency, and problem-solving resources.",
        actionLabel: "Explore Content",
      },
    ],
  },
  {
    title: "Career Awareness Material",
    icon: <Globe size={20} />,
    items: [
      {
        title: "New-Age Careers Atlas",
        meta: "Career Discovery Library",
        description:
          "Discover AI, sustainability, design, health-tech, and public policy careers.",
        actionLabel: "View Library",
      },
      {
        title: "Parent & Mentor Conversation Guide",
        meta: "Printable Discussion Sheet",
        description:
          "A guided framework to discuss aspirations and realistic preparation plans.",
        actionLabel: "Download Guide",
      },
    ],
  },
];

export default function ResourcesHub() {
  const axios = useAxiosInstance();

  const { data: resourcesResponse } = useQuery(
    "resource-content",
    async () => {
      const res = await axios.get("/api/student-experience", {
        params: {
          contentScope: "RESOURCES",
          contentType: "RESOURCE",
          activeOnly: true,
        },
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const sections = useMemo(() => {
    const records = resourcesResponse?.data || [];

    if (!records.length) return resourceSections;

    const grouped = records.reduce((acc, item) => {
      const sectionTitle = item.categoryLabel || "Resource Library";
      if (!acc[sectionTitle]) acc[sectionTitle] = [];

      acc[sectionTitle].push({
        title: item.title,
        meta: item.dateLabel || item.distanceLabel || "Curated Resource",
        description: item.description,
        actionLabel: item.actionLabel || "Open Resource",
        actionLink: item.actionLink,
      });

      return acc;
    }, {});

    const iconMap = {
      "Downloadable Guides": <FileText size={20} />,
      "Educational Content": <BookOpenCheck size={20} />,
      "Career Awareness Material": <Globe size={20} />,
    };

    return Object.entries(grouped).map(([title, items]) => ({
      title,
      icon: iconMap[title] || <FileText size={20} />,
      items,
    }));
  }, [resourcesResponse]);

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHeader name="Resources" />

      <main className="p-8">
        <div className="rounded-[28px] bg-slate-900 p-8 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
            Resource Library
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold">
            Download guides, explore study content, and build career awareness
            from one hub.
          </h1>
        </div>

        <div className="mt-6 grid gap-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[28px] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  {section.icon}
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {section.title}
                </h2>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {section.items.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.meta}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                    <a
                      href={item.actionLink || "#"}
                      target={item.actionLink?.startsWith("http") ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      {item.actionLabel.toLowerCase().includes("download") ? (
                        <Download size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                      {item.actionLabel}
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
