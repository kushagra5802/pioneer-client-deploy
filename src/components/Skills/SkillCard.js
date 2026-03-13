import { ChevronRight } from 'lucide-react';

export default function SkillCard({
  skill,
  weeks,
  modules,
  selectedWeek,
  onWeekSelect,
  onTakeAssessment,
}) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 mb-6 shadow-lg">
        <div className="text-blue-100 text-sm font-semibold uppercase mb-2">
          Skill of the Month
        </div>
        <h2 className="text-3xl font-bold text-white mb-6">
          {skill.title}
        </h2>

        <div className="flex gap-3">
          {weeks.map((week) => (
            <button
              key={week.id}
              onClick={() => onWeekSelect(week.week_number)}
              className={`text-sm px-4 py-2 rounded-lg font-medium ${
                selectedWeek === week.week_number
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 text-white'
              }`}
            >
              Week {week.week_number}
            </button>
          ))}
        </div>
      </div>

      {modules.map((module) => (
        <div
          key={module.id}
          className="bg-white rounded-2xl p-8 shadow-md"
        >
          <h3 className="text-xl font-bold mb-4">
            {module.title}
          </h3>
          <p className="mb-6 text-md">{module.description}</p>

          <div className="flex justify-end">
            <button
              onClick={onTakeAssessment}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm"
            >
              Take Weekly Assessment
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
