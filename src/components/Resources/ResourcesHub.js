import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarDays,
  Download,
  FileText,
  Globe,
  GraduationCap,
  MapPin,
  Tag,
  X,
} from "lucide-react";

import PageHeader from "../PageHeader";
import useAxiosInstance from "../../lib/useAxiosInstance";

const fallbackResources = [
  {
    _id: "resource-1",
    title: "Career Roadmap Workbook",
    subtitle: "A practical worksheet for stream and goal planning",
    description:
      "<p>Compare streams, courses, and long-term goals with a structured workbook designed for students and mentors.</p><ul><li>Reflection prompts</li><li>Goal setting sections</li><li>Course planning guide</li></ul>",
    categoryLabel: "Downloadable Guides",
    dateLabel: "Workbook · Class 9-12 · 8 min read",
    gradeCategories: [],
    interestTags: [],
    locationLabel: "",
    cityName: "",
    actionLabel: "Download PDF",
    actionLink: "#",
    mediaFiles: [],
  },
  {
    _id: "resource-2",
    title: "New-Age Careers Atlas",
    subtitle: "Explore emerging industries and future pathways",
    description:
      "<p>Discover fast-growing careers across AI, sustainability, design, healthcare, and public policy.</p>",
    categoryLabel: "Career Awareness Material",
    dateLabel: "Career awareness · Class 11-12 · 6 min read",
    gradeCategories: [],
    interestTags: [],
    locationLabel: "",
    cityName: "",
    actionLabel: "View Library",
    actionLink: "#",
    mediaFiles: [],
  },
];

const iconMap = {
  "Downloadable Guides": <FileText size={20} />,
  "Educational Content": <BookOpenCheck size={20} />,
  "Career Awareness Material": <Globe size={20} />,
};

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncateText = (value = "", maxLength = 180) =>
  value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;

const formatValue = (value, fallback) => {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : fallback;
  }

  return value || fallback;
};

function ResourceMetaItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function ResourceModal({ resource, onClose }) {
  if (!resource) return null;

  const mediaFiles = resource.mediaFiles || [];
  const primaryMedia = mediaFiles[0];
  const isPrimaryVideo = primaryMedia?.mimetype?.startsWith("video");
  // const metadataItems = [
  //   {
  //     label: "Category",
  //     value: formatValue(resource.categoryLabel, "Career Awareness Material"),
  //     icon: <Tag size={16} />,
  //   },
  //   {
  //     label: "Date",
  //     value: formatValue(resource.dateLabel, "Not set"),
  //     icon: <CalendarDays size={16} />,
  //   },
  //   {
  //     label: "Grades",
  //     value: formatValue(resource.gradeCategories, "All"),
  //     icon: <GraduationCap size={16} />,
  //   },
  //   {
  //     label: "Interests",
  //     value: formatValue(resource.interestTags, "All"),
  //     icon: <Tag size={16} />,
  //   },
  //   {
  //     label: "Location",
  //     value: formatValue(resource.locationLabel, "Not set"),
  //     icon: <MapPin size={16} />,
  //   },
  //   {
  //     label: "City",
  //     value: formatValue(resource.cityName, "All Cities"),
  //     icon: <MapPin size={16} />,
  //   },
  //   {
  //     label: "Action",
  //     value: formatValue(resource.actionLabel, "Not set"),
  //     icon: <ArrowUpRight size={16} />,
  //   },
  // ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        <div className="bg-slate-900 px-8 py-7 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                {formatValue(resource.categoryLabel, "Resource")}
              </p>
              <h2 className="mt-3 text-3xl font-bold">{resource.title}</h2>
              {resource.subtitle && (
                <p className="mt-2 text-sm text-slate-300">{resource.subtitle}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {primaryMedia && (
            <div className="mb-8 overflow-hidden rounded-[24px] bg-slate-100">
              <div className="aspect-[16/8]">
                {isPrimaryVideo ? (
                  <video
                    src={primaryMedia.publicUrl}
                    className="h-full w-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={primaryMedia.publicUrl}
                    alt={primaryMedia.name || resource.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {metadataItems.map((item) => (
              <ResourceMetaItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
              />
            ))}
          </div> */}

            <div className="mt-8 rounded-[24px] bg-slate-50 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Description
              </h3>
              <div
                className="mt-4 text-sm leading-7 text-slate-700 [&_a]:text-indigo-600 [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-semibold [&_u]:underline [&_ul]:mb-4"
                dangerouslySetInnerHTML={{ __html: resource.description || "<p>No description available.</p>" }}
              />
            </div>

          {mediaFiles.length > 1 && (
            <div className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Media Gallery
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {mediaFiles.slice(1).map((file, index) => {
                  const isVideo = file?.mimetype?.startsWith("video");

                  return (
                    <div
                      key={file.guid || file.key || index}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                    >
                      <div className="aspect-video bg-slate-100">
                        {isVideo ? (
                          <video
                            src={file.publicUrl}
                            className="h-full w-full object-cover"
                            controls
                          />
                        ) : (
                          <img
                            src={file.publicUrl}
                            alt={file.name || resource.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {resource.actionLabel && resource.actionLink && (
            <a
              href={resource.actionLink}
              target={resource.actionLink?.startsWith("http") ? "_blank" : "_self"}
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {resource.actionLabel.toLowerCase().includes("download") ? (
                <Download size={16} />
              ) : (
                <ArrowUpRight size={16} />
              )}
              {resource.actionLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResourcesHub() {
  const axios = useAxiosInstance();
  const [selectedResource, setSelectedResource] = useState(null);

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
    const records = resourcesResponse?.data?.length
      ? resourcesResponse.data
      : fallbackResources;

    const grouped = records.reduce((acc, item) => {
      const sectionTitle = item.categoryLabel || "Resource Library";

      if (!acc[sectionTitle]) acc[sectionTitle] = [];
      acc[sectionTitle].push(item);
      return acc;
    }, {});

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
            Explore downloadable guides, rich learning content, and career
            awareness material from one student-friendly hub.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Every resource can include rich text, images or videos, and detailed
            metadata so students can quickly understand what is relevant to them.
          </p>
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
                <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {section.items.map((item) => {
                  const previewText = truncateText(stripHtml(item.description), 380);
                  const primaryMedia = item.mediaFiles?.[0];
                  const isVideo = primaryMedia?.mimetype?.startsWith("video");

                  return (
                    <article
                      key={item._id || item.title}
                      className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50"
                    >
                      {primaryMedia && (
                        <div className="aspect-[16/8] bg-slate-200">
                          {isVideo ? (
                            <video
                              src={primaryMedia.publicUrl}
                              className="h-full w-full object-cover"
                              controls
                            />
                          ) : (
                            <img
                              src={primaryMedia.publicUrl}
                              alt={primaryMedia.name || item.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600">
                            {formatValue(item.categoryLabel, "Career awareness material")}
                          </span>
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                            {formatValue(item.dateLabel, "Not set")}
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-slate-900">
                          {item.title}
                        </h3>

                        {item.subtitle && (
                          <p className="mt-2 text-sm font-medium text-slate-500">
                            {item.subtitle}
                          </p>
                        )}

                        {/* <div className="mt-5 grid gap-3 md:grid-cols-2">
                          <ResourceMetaItem
                            icon={<GraduationCap size={16} />}
                            label="Grades"
                            value={formatValue(item.gradeCategories, "All")}
                          />
                          <ResourceMetaItem
                            icon={<Tag size={16} />}
                            label="Interests"
                            value={formatValue(item.interestTags, "All")}
                          />
                          <ResourceMetaItem
                            icon={<MapPin size={16} />}
                            label="Location"
                            value={formatValue(item.locationLabel, "Not set")}
                          />
                          <ResourceMetaItem
                            icon={<MapPin size={16} />}
                            label="City"
                            value={formatValue(item.cityName, "All Cities")}
                          />
                        </div> */}

                        <p className="mt-5 text-sm leading-7 text-slate-600">
                          {previewText || "No description available."}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedResource(item)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Read More
                          </button>

                          {item.actionLabel && item.actionLink && (
                            <a
                              href={item.actionLink}
                              target={item.actionLink?.startsWith("http") ? "_blank" : "_self"}
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                              {item.actionLabel.toLowerCase().includes("download") ? (
                                <Download size={16} />
                              ) : (
                                <ArrowUpRight size={16} />
                              )}
                              {item.actionLabel}
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <ResourceModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
}
