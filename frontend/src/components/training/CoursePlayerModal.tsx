import React, { useState } from 'react';
import {
  X,
  FileCheck,
  Clock,
  CheckCircle2,
  Check,
  Zap,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import type { TrainingCourse } from '../../data/gemTrainingData';
import { GeMStarLogo } from '../common/GeMAssets';

interface CoursePlayerModalProps {
  course: TrainingCourse;
  onClose: () => void;
  onStartQuiz: () => void;
  onNavigateToSimulatedRoute?: (route: string) => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  onClose,
  onStartQuiz,
  onNavigateToSimulatedRoute,
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<number[]>([0]);

  const activeModule = course.modules[activeModuleIndex];
  const progressPercent = Math.round(
    ((completedModules.length) / course.modules.length) * 100
  );

  const handleNext = () => {
    if (activeModuleIndex < course.modules.length - 1) {
      const nextIdx = activeModuleIndex + 1;
      setActiveModuleIndex(nextIdx);
      if (!completedModules.includes(nextIdx)) {
        setCompletedModules((prev) => [...prev, nextIdx]);
      }
    } else {
      onStartQuiz();
    }
  };

  const handlePrev = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header Strip */}
        <div className="bg-[#062134] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#f37021]">
          <div className="flex items-center space-x-3">
            <GeMStarLogo className="w-8 h-8 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded">
                  {course.code}
                </span>
                <span className="text-xs text-gray-300 font-semibold">{course.categoryLabel}</span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white tracking-tight leading-snug">
                {course.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10 text-lg font-bold cursor-pointer transition flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 h-1.5 w-full">
          <div
            className="bg-[#f37021] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Body with Module Sidebar and Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Sidebar: Module Navigation */}
          <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 p-3.5 overflow-y-auto space-y-2 shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 text-xs">
              <span className="font-bold text-gray-600">Course Syllabus</span>
              <span className="font-mono text-orange-600 font-black">{progressPercent}% Done</span>
            </div>
            {course.modules.map((mod, idx) => {
              const isActive = idx === activeModuleIndex;
              const isDone = completedModules.includes(idx);
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModuleIndex(idx);
                    if (!completedModules.includes(idx)) {
                      setCompletedModules((prev) => [...prev, idx]);
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition cursor-pointer flex items-start gap-2 ${
                    isActive
                      ? 'bg-blue-900 text-white font-bold shadow-sm'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                      isActive
                        ? 'bg-yellow-400 text-black'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isDone && !isActive ? <Check className="w-3 h-3" /> : idx + 1}
                  </span>
                  <div className="flex-1 leading-snug">
                    <p className="line-clamp-2">{mod.title}</p>
                    <span
                      className={`text-[10px] block mt-0.5 ${
                        isActive ? 'text-gray-300' : 'text-gray-400'
                      }`}
                    >
                      {mod.duration}
                    </span>
                  </div>
                </button>
              );
            })}

            <div className="pt-3 border-t border-gray-200">
              <button
                onClick={onStartQuiz}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Take Knowledge Quiz</span>
              </button>
            </div>
          </div>

          {/* Module Content Pane */}
          <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-5 bg-white">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#f37021] uppercase tracking-wider">
                  Module {activeModuleIndex + 1} of {course.modules.length}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{activeModule.duration}</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900">{activeModule.title}</h2>
            </div>

            {/* Content Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2">
              <h4 className="font-extrabold text-xs uppercase text-slate-500 tracking-wider">
                Module Summary & Statutory Mandate
              </h4>
              <p>{activeModule.summary}</p>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                <span>Critical Compliance Checkpoints & Key Takeaways</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-700">
                {activeModule.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="leading-normal font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Simulation / Platform Link */}
            {activeModule.simulationStep && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600 shrink-0" />
                  <h4 className="font-extrabold text-xs text-orange-950 uppercase">
                    Interactive Hands-On Simulator: {activeModule.simulationStep.screenTitle}
                  </h4>
                </div>
                <p className="text-xs text-orange-900 leading-relaxed">
                  {activeModule.simulationStep.screenDescription}
                </p>
                {activeModule.simulationStep.portalRoute && onNavigateToSimulatedRoute && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToSimulatedRoute(activeModule.simulationStep!.portalRoute!);
                    }}
                    className="bg-[#f37021] hover:bg-[#e05e10] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer w-fit"
                  >
                    <span>Try In Live Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={activeModuleIndex === 0}
            className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Module</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:inline">
              Module {activeModuleIndex + 1} of {course.modules.length}
            </span>
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-[#062134] hover:bg-[#0c3952] text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              {activeModuleIndex < course.modules.length - 1 ? (
                <>
                  <span>Next Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Proceed to Assessment Quiz</span>
                  <FileCheck className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
