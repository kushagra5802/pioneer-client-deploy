import {
  Building2,
  CalendarClock,
  MapPin,
  Medal,
  Sparkles,
} from "lucide-react";
import { Select } from "antd";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import PageHeader from "../PageHeader";
import useAxiosInstance from "../../lib/useAxiosInstance";
import {
  buildInterestEvents,
  readWelcomeProfile,
  targetExams,
} from "../../data/studentExperience";
import indianCitiesByState from "../../assets/data/Indian_Cities_In_States.json";

const institutions = [
  {
    name: "District Innovation & Skill Centre",
    type: "Skill Institution",
    distance: "2.4 km away",
    cityName: "New Delhi",
  },
  {
    name: "City Central Library",
    type: "Learning Hub",
    distance: "3.8 km away",
    cityName: "Mumbai",
  },
  {
    name: "Regional Science College",
    type: "Higher Education",
    distance: "6.1 km away",
    cityName: "Bengaluru",
  },
];

const nationalCompetitions = [
  {
    title: "India Youth Innovation Challenge",
    level: "National",
    deadline: "18 May 2026",
    cityName: "New Delhi",
  },
  {
    title: "National Essay & Policy Bowl",
    level: "National",
    deadline: "25 May 2026",
    cityName: "Mumbai",
  },
  {
    title: "STEM HackSprint for Schools",
    level: "Regional + National",
    deadline: "02 Jun 2026",
    cityName: "Bengaluru",
  },
];

export default function ExploreCityHub() {
  const axios = useAxiosInstance();
  const welcomeProfile = readWelcomeProfile();
  const [selectedCity, setSelectedCity] = useState("");

  const cityOptions = useMemo(
    () =>
      Array.from(new Set(Object.values(indianCitiesByState).flat()))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    []
  );

  const { data: exploreResponse } = useQuery(
    [
      "explore-city-content",
      (welcomeProfile?.interests || []).join(","),
      selectedCity,
    ],
    async () => {
      const res = await axios.get("/api/student-experience", {
        params: {
          contentScope: "EXPLORE_CITY",
          interest: (welcomeProfile?.interests || []).join(","),
          cityName: selectedCity || undefined,
          activeOnly: true,
        },
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const exploreRecords = useMemo(
    () => exploreResponse?.data || [],
    [exploreResponse]
  );

  const nearbyEvents = useMemo(() => {
    const apiEvents = exploreRecords
      .filter((item) => item.contentType === "NEARBY_EVENT")
      .map((event) => ({
        title: event.title,
        category: event.categoryLabel,
        date: event.dateLabel,
        location: event.locationLabel,
        cityName: event.cityName,
      }));

    return apiEvents.length
      ? apiEvents
      : selectedCity
      ? []
      : buildInterestEvents(welcomeProfile?.interests).map((event) => ({
          ...event,
          cityName: "All Cities",
        }));
  }, [exploreRecords, selectedCity, welcomeProfile?.interests]);

  const institutionCards = useMemo(() => {
    const apiInstitutions = exploreRecords
      .filter((item) => item.contentType === "INSTITUTION")
      .map((institution) => ({
        name: institution.title,
        type: institution.categoryLabel || "Institution",
        distance: institution.distanceLabel || institution.locationLabel,
        cityName: institution.cityName,
      }));

    return apiInstitutions.length
      ? apiInstitutions
      : selectedCity
      ? []
      : institutions;
  }, [exploreRecords, selectedCity]);

  const competitionCards = useMemo(() => {
    const apiCompetitions = exploreRecords
      .filter((item) => item.contentType === "COMPETITION")
      .map((item) => ({
        title: item.title,
        level: item.categoryLabel,
        deadline: item.dateLabel,
        cityName: item.cityName,
      }));

    return apiCompetitions.length
      ? apiCompetitions
      : selectedCity
      ? []
      : [...nationalCompetitions, ...targetExams.slice(0, 1)];
  }, [exploreRecords, selectedCity]);

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHeader name="Explore My City/District" />

      <main className="p-8">
        <div className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
            Localized Hub
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-slate-900">
                Discover nearby events, institutions, and opportunities in your
                district.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                Based on your onboarding preferences, we curate local happenings
                and national competitions so students can act quickly on relevant
                opportunities.
              </p>
            </div>

            <div className="min-w-[260px]">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Filter by City
              </label>
              <Select
                showSearch
                allowClear
                value={selectedCity || undefined}
                placeholder="Search city"
                optionFilterProp="label"
                onChange={(value) => setSelectedCity(value || "")}
                options={cityOptions.map((city) => ({
                  value: city,
                  label: city,
                }))}
                className="mt-3 w-full"
                style={{ height: 54 }}
              />
              <p className="mt-2 text-xs text-slate-500">
                Leave blank to view opportunities from all cities.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <section className="rounded-[28px] bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-white/10 p-3 text-indigo-200">
                  <CalendarClock size={20} />
                </span>
                <h2 className="text-xl font-bold">Nearby Events</h2>
              </div>
              <Sparkles className="text-indigo-200" size={20} />
            </div>

            <div className="mt-6 grid gap-4">
              {nearbyEvents.length ? (
                nearbyEvents.map((event) => (
                  <article
                    key={`${event.title}-${event.date}`}
                    className="rounded-3xl bg-white/10 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
                          {event.category}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold">{event.title}</h3>
                      </div>
                      <p className="text-sm font-semibold text-slate-300">
                        {event.date}
                      </p>
                    </div>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300">
                      <MapPin size={16} />
                      {event.location}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
                      City: {event.cityName || "All Cities"}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-3xl bg-white/10 p-5 text-sm text-slate-300">
                  No nearby events found for the selected city.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                <Building2 size={20} />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Nearby Institutions
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {institutionCards.length ? (
                institutionCards.map((institution) => (
                  <div
                    key={institution.name}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                      {institution.type}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {institution.name}
                    </h3>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {institution.distance}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500">
                    City: {institution.cityName || "All Cities"}
                  </p>
                </div>
                ))
              ) : (
                <p className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                  No institutions found for the selected city.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[28px] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <Medal size={20} />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Competitions & Events
            </h2>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {competitionCards.length ? (
              competitionCards.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {item.level || item.tag}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                <p className="mt-4 text-sm font-semibold text-indigo-600">
                  Deadline: {item.deadline || item.date}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  City: {item.cityName || "All Cities"}
                </p>
              </article>
              ))
            ) : (
              <p className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 xl:col-span-3">
                No competitions or events found for the selected city.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
