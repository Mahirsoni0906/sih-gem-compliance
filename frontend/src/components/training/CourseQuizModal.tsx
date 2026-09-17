import React, { useState } from 'react';
import {
  X,
  Award,
  AlertTriangle,
  Check,
  RotateCw,
  ArrowRight
} from 'lucide-react';
import type { TrainingCourse } from '../../data/gemTrainingData';
import { GeMStarLogo } from '../common/GeMAssets';

interface CourseQuizModalProps {
  course: TrainingCourse;
  onClose: () => void;
  onClaimCertificate: () => void;
}

export const CourseQuizModal: React.FC<CourseQuizModalProps> = ({
  course,
  onClose,
  onClaimCertificate,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelect = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    course.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();
  const total = course.quiz.length;
  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= 60;
  const allAnswered = Object.keys(selectedAnswers).length === course.quiz.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#062134] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-emerald-500">
          <div className="flex items-center space-x-2.5">
            <GeMStarLogo className="w-8 h-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                  ASSESSMENT
                </span>
                <span className="font-mono text-xs text-gray-300 font-bold">{course.code}</span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white">
                Knowledge Check: {course.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 text-lg font-bold cursor-pointer transition flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Questions Area */}
        <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6 bg-[#f8fafc]">
          {/* Result Banner if Submitted */}
          {isSubmitted && (
            <div
              className={`p-5 rounded-2xl border-2 space-y-2.5 animate-in zoom-in-95 duration-200 ${
                isPassed
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isPassed ? <Award className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-black text-sm sm:text-base">
                      {isPassed
                        ? `Congratulations! You Passed with ${percentage}%`
                        : `Assessment Incomplete (${percentage}% Score)`}
                    </h4>
                    <p className="text-xs">
                      {isPassed
                        ? `You answered ${score} out of ${total} questions correctly. Your official Certificate is now unlocked!`
                        : `Passing grade is 60% (${Math.ceil(total * 0.6)} correct answers). Review the explanations below and try again.`}
                    </p>
                  </div>
                </div>

                {isPassed && (
                  <button
                    onClick={onClaimCertificate}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Claim Certificate</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Question Cards */}
          <div className="space-y-5">
            {course.quiz.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const hasAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pl-8">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let optionClasses = 'border-gray-200 hover:bg-gray-50 text-gray-800';

                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                        } else if (isOptionSelected && !isCorrect) {
                          optionClasses = 'border-red-400 bg-red-50 text-red-950 line-through';
                        }
                      } else if (isOptionSelected) {
                        optionClasses = 'border-[#062134] bg-blue-50/70 text-[#062134] font-bold shadow-xs';
                      }

                      return (
                        <label
                          key={optIdx}
                          onClick={() => handleSelect(q.id, optIdx)}
                          className={`w-full p-3 rounded-xl border text-xs flex items-center gap-3 transition cursor-pointer ${optionClasses}`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={isOptionSelected}
                            disabled={isSubmitted}
                            onChange={() => handleSelect(q.id, optIdx)}
                            className="text-[#062134] focus:ring-0"
                          />
                          <span className="flex-1">{opt}</span>
                          {isSubmitted && optIdx === q.correctIndex && (
                            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Correct</span>
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Explanation Banner when Submitted */}
                  {isSubmitted && (
                    <div className="ml-8 mt-2 p-3 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl text-xs text-blue-900 leading-relaxed">
                      <span className="font-extrabold block mb-0.5">Statutory Legal Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Close Quiz
          </button>

          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              disabled={!allAnswered}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Submit & Check Answers ({Object.keys(selectedAnswers).length}/{total})
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {!isPassed && (
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              )}
              {isPassed && (
                <button
                  onClick={onClaimCertificate}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Official Certificate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
