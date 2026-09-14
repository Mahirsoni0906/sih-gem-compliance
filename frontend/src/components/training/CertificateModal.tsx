import React, { useState } from 'react';
import type { TrainingCourse } from '../../data/gemTrainingData';
import { AshokaEmblem, GeMStarLogo } from '../common/GeMAssets';

interface CertificateModalProps {
  course: TrainingCourse;
  onClose: () => void;
  defaultLearnerName?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  course,
  onClose,
  defaultLearnerName = 'Procurement Officer / Vendor Representative',
}) => {
  const [learnerName, setLearnerName] = useState<string>(defaultLearnerName);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const certId = `GEM-LMS-2026-${course.code}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-gray-300">
        {/* Top Control Bar */}
        <div className="bg-[#062134] text-white px-5 py-3 flex items-center justify-between border-b border-yellow-500">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🎓</span>
            <span className="font-extrabold text-sm text-yellow-400">
              Official Government e Marketplace Certificate
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-[#f37021] hover:bg-[#e05e10] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 text-base font-bold cursor-pointer transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 flex justify-center items-center">
          <div
            id="gem-printable-certificate"
            className="w-full max-w-3xl bg-[#fffdf9] p-6 sm:p-10 rounded-2xl border-8 border-[#1a3a5f] shadow-xl relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(243, 112, 33, 0.03) 0%, transparent 70%)',
            }}
          >
            {/* Inner Gold Filigree Border */}
            <div className="border-2 border-yellow-600/70 p-6 sm:p-8 rounded-xl text-center space-y-4 relative">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-yellow-600 text-xs font-serif">✦</div>
              <div className="absolute top-2 right-2 text-yellow-600 text-xs font-serif">✦</div>
              <div className="absolute bottom-2 left-2 text-yellow-600 text-xs font-serif">✦</div>
              <div className="absolute bottom-2 right-2 text-yellow-600 text-xs font-serif">✦</div>

              {/* Sovereign Headers */}
              <div className="flex justify-center items-center space-x-4 mb-2">
                <AshokaEmblem className="w-9 h-13 text-[#1a3a5f]" />
                <div className="space-y-0.5 text-center">
                  <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-gray-700">
                    GOVERNMENT OF INDIA • MINISTRY OF COMMERCE & INDUSTRY
                  </p>
                  <h1 className="text-xl sm:text-2xl font-black text-[#062134] tracking-tight">
                    Government e Marketplace (GeM)
                  </h1>
                  <p className="text-[10px] text-[#f37021] font-bold tracking-wider uppercase">
                    Learning Management System & Capacity Building Wing
                  </p>
                </div>
                <GeMStarLogo className="w-10 h-10" />
              </div>

              <div className="py-1">
                <span className="inline-block bg-[#062134] text-yellow-400 text-xs font-black tracking-widest uppercase px-4 py-1 rounded-full shadow-xs">
                  Certificate of Statutory Competency
                </span>
              </div>

              <p className="text-xs text-gray-600 italic">This is to certify that</p>

              {/* Learner Name with Inline Edit */}
              <div className="py-1">
                {isEditingName ? (
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="text"
                      value={learnerName}
                      onChange={(e) => setLearnerName(e.target.value)}
                      className="border-b-2 border-blue-900 px-3 py-1 font-serif text-lg sm:text-xl font-black text-[#062134] text-center focus:outline-none"
                    />
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="text-xs bg-emerald-600 text-white font-bold px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                    <span className="font-serif text-xl sm:text-2xl font-black text-[#062134] border-b border-gray-300 pb-0.5">
                      {learnerName}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-blue-600" title="Click to edit name">
                      ✏️
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-700 max-w-lg mx-auto leading-relaxed">
                has successfully completed all required SCORM eLearning modules, practical statutory scrutiny exercises, and passed the accredited assessment for:
              </p>

              {/* Course Title Badge */}
              <div className="bg-orange-50/80 border border-orange-200 p-3 rounded-xl max-w-xl mx-auto space-y-1">
                <span className="font-mono text-[10px] font-black bg-orange-600 text-white px-2 py-0.5 rounded">
                  {course.code}
                </span>
                <h3 className="font-black text-sm sm:text-base text-gray-900 leading-snug">
                  {course.title}
                </h3>
                <p className="text-[11px] text-gray-600 font-semibold">
                  {course.certificationLevel || course.categoryLabel}
                </p>
              </div>

              {/* Footer Signatures and Verification */}
              <div className="pt-6 grid grid-cols-3 gap-4 items-end text-xs">
                {/* Issue Details */}
                <div className="text-left space-y-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Issued On</p>
                  <p className="font-black text-gray-800 text-xs">{issueDate}</p>
                  <p className="text-[9px] font-mono text-gray-400">ID: {certId}</p>
                </div>

                {/* Digital Verification QR */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-14 h-14 bg-white border-2 border-gray-400 rounded-lg p-1 flex items-center justify-center shadow-xs">
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-[7px] text-white font-mono p-0.5 text-center leading-tight">
                      <span>VERIFIED</span>
                      <span>GeM-LMS</span>
                      <span>QR-2026</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase">
                    Tamper-Evident QR
                  </span>
                </div>

                {/* Director Signature */}
                <div className="text-right space-y-1">
                  <div className="font-serif italic text-sm text-blue-950 font-black border-b border-gray-400 pb-0.5 inline-block">
                    P. K. Singh, IAS
                  </div>
                  <p className="font-extrabold text-[10px] text-gray-800 uppercase">
                    Chief Executive Officer (CEO)
                  </p>
                  <p className="text-[9px] text-gray-500">Government e Marketplace</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info strip */}
        <div className="bg-white px-5 py-2.5 border-t border-gray-200 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
          <span>Official credential accredited under the National Public Procurement Training Initiative.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
