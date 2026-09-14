import React, { useState } from 'react';
import {
  GEM_TRAINING_COURSES,
  GEM_LIVE_WEBINARS,
  GEM_TRAINING_RESOURCES,
  type TrainingCourse,
  type WebinarSession,
} from '../../data/gemTrainingData';
import { AshokaEmblem, GeMStarLogo } from '../common/GeMAssets';
import { CoursePlayerModal } from './CoursePlayerModal';
import { CourseQuizModal } from './CourseQuizModal';
import { CertificateModal } from './CertificateModal';

interface GeMTrainingPortalProps {
  onGoHome: () => void;
  onNavigateToModule?: (route: string) => void;
}

type TabType = 'all' | 'buyer' | 'seller' | 'statutory' | 'webinars' | 'resources';

export const GeMTrainingPortal: React.FC<GeMTrainingPortalProps> = ({
  onGoHome,
  onNavigateToModule,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [activeCourseForPlayer, setActiveCourseForPlayer] = useState<TrainingCourse | null>(null);
  const [activeCourseForQuiz, setActiveCourseForQuiz] = useState<TrainingCourse | null>(null);
  const [activeCourseForCert, setActiveCourseForCert] = useState<TrainingCourse | null>(null);
  const [registeredWebinar, setRegisteredWebinar] = useState<WebinarSession | null>(null);
  const [downloadedResourceMsg, setDownloadedResourceMsg] = useState<string | null>(null);

  // Filtered Courses
  const filteredCourses = GEM_TRAINING_COURSES.filter((course) => {
    // Category tab filter
    if (activeTab === 'buyer' && course.category !== 'buyer') return false;
    if (activeTab === 'seller' && course.category !== 'seller' && course.category !== 'msme') return false;
    if (activeTab === 'statutory' && course.category !== 'statutory') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = course.title.toLowerCase().includes(q);
      const matchesCode = course.code.toLowerCase().includes(q);
      const matchesOverview = course.overview.toLowerCase().includes(q);
      const matchesTarget = course.targetAudience.toLowerCase().includes(q);
      if (!matchesTitle && !matchesCode && !matchesOverview && !matchesTarget) return false;
    }

    // Language filter
    if (selectedLanguage !== 'All') {
      if (!course.languages.includes(selectedLanguage)) return false;
    }

    return true;
  });

  const handleRegisterWebinar = (session: WebinarSession) => {
    setRegisteredWebinar(session);
  };

  const handleDownloadResource = (title: string) => {
    setDownloadedResourceMsg(`Downloading "${title}"... In production, the official PDF document is delivered.`);
    setTimeout(() => {
      setDownloadedResourceMsg(null);
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9] min-h-screen text-gray-800">
      {/* Official Government Strip */}
      <div className="bg-[#062134] text-white py-6 px-4 sm:px-8 border-b-2 border-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <AshokaEmblem className="w-8 h-11 text-gray-200" />
            <div className="flex items-center space-x-2.5">
              <GeMStarLogo className="w-8 h-8" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    GeM Interactive LMS & Training Courses
                  </h1>
                  <span className="bg-yellow-400 text-[#062134] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    eLearning Portal
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  Capacity Building & Training Wing • Department of Commerce, Ministry of Commerce & Industry
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onGoHome}
              className="text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to GeM Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Overview & Metrics Banner */}
      <div className="bg-gradient-to-r from-[#0c2340] via-[#103b60] to-[#0c2340] text-white py-8 px-4 sm:px-8 border-b border-gray-700">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-bold px-3 py-1 rounded-full">
                <span>✦ Official GeM National Training Curriculum</span>
                <span>• GFR 2017 Aligned</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Master Public Procurement on GeM: Free Self-Paced Courses & Certifications
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                Explore official SCORM-compliant interactive modules for Government Buyers, Central CPSE Officers, MSME Sellers, and Legal Scrutiny Teams. Earn accredited certificates upon passing knowledge checks.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="p-3 bg-white/10 rounded-xl">
                <p className="text-xl sm:text-2xl font-black text-yellow-400">45,000+</p>
                <p className="text-[11px] text-gray-300">Certified Buyers & Officers</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <p className="text-xl sm:text-2xl font-black text-emerald-400">100% Free</p>
                <p className="text-[11px] text-gray-300">Govt Funded Training</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <p className="text-xl sm:text-2xl font-black text-orange-400">12 Languages</p>
                <p className="text-[11px] text-gray-300">Multilingual Access</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <p className="text-xl sm:text-2xl font-black text-blue-300">4 Levels</p>
                <p className="text-[11px] text-gray-300">Buyer Certification Path</p>
              </div>
            </div>
          </div>

          {/* Search & Language Bar */}
          <div className="bg-white text-gray-800 p-3 sm:p-4 rounded-2xl shadow-xl flex flex-wrap items-center gap-3 border border-gray-200">
            <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, e.g. 'Seller Onboarding', 'L1 Comparison', 'GFR 144', 'CRAC'..."
                className="w-full bg-transparent text-xs focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-gray-600">🌐 Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-xs border border-gray-300 rounded-xl px-2.5 py-2 bg-gray-50 font-medium focus:outline-none"
              >
                <option value="All">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
          {[
            { id: 'all', label: `All Courses (${GEM_TRAINING_COURSES.length})`, icon: '📚' },
            { id: 'buyer', label: 'Buyer Certification (Levels 1-4)', icon: '🏛️' },
            { id: 'seller', label: 'Seller & MSME Track', icon: '🏢' },
            { id: 'statutory', label: 'Statutory & GFR Scrutiny', icon: '⚖️' },
            { id: 'webinars', label: 'Live Webinars (#TrainingCalendar)', icon: '📅' },
            { id: 'resources', label: 'Manuals & Circulars', icon: '📥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#062134] text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Download toast notification */}
        {downloadedResourceMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-400 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <span>✓</span>
            <span className="font-bold">{downloadedResourceMsg}</span>
          </div>
        )}

        {/* TAB 1, 2, 3, 4: Course Cards Grid */}
        {(activeTab === 'all' || activeTab === 'buyer' || activeTab === 'seller' || activeTab === 'statutory') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Showing {filteredCourses.length} accredited training course{filteredCourses.length !== 1 ? 's' : ''}</span>
              <span className="text-emerald-700 font-bold">● Live SCORM e-Learning Active</span>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-3">
                <span className="text-4xl">🔍</span>
                <h4 className="font-bold text-sm text-gray-800">No courses match your search criteria</h4>
                <p className="text-xs text-gray-500">Try clearing the search query or switching language filter to All.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLanguage('All');
                  }}
                  className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((crs) => (
                  <div
                    key={crs.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden"
                  >
                    {/* Course Card Header */}
                    <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-black bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
                            {crs.code}
                          </span>
                          <span className="text-[10px] font-black bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded">
                            {crs.categoryLabel}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {crs.level}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-black text-base text-gray-900 leading-snug hover:text-blue-900 transition">
                          {crs.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#f37021]">{crs.subtitle}</p>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {crs.overview}
                      </p>

                      {/* Course Metadata Strip */}
                      <div className="pt-3 mt-auto border-t border-gray-100 grid grid-cols-3 gap-2 text-[11px] text-gray-600">
                        <div>
                          <span className="block text-[9px] text-gray-400 uppercase font-bold">Duration</span>
                          <span className="font-bold">{crs.duration}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-gray-400 uppercase font-bold">Learners</span>
                          <span className="font-bold">{(crs.enrolledCount / 1000).toFixed(1)}k enrolled</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-gray-400 uppercase font-bold">Accreditation</span>
                          <span className="font-bold text-emerald-700">★ {crs.rating} (Govt)</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-500 pt-1">
                        <span className="font-bold">Audience:</span> {crs.targetAudience}
                      </div>
                    </div>

                    {/* Action Buttons Bar */}
                    <div className="bg-gray-50 p-3.5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveCourseForPlayer(crs)}
                        className="bg-[#062134] hover:bg-[#0c3952] text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>▶️ Start Interactive Course</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveCourseForQuiz(crs)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
                          title="Test your statutory knowledge"
                        >
                          <span>✍️ Quiz</span>
                        </button>
                        <button
                          onClick={() => setActiveCourseForCert(crs)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
                          title="Generate official completion certificate"
                        >
                          <span>🎓 Certificate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Live Weekly Webinars Schedule (#TrainingCalendar) */}
        {activeTab === 'webinars' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-300 uppercase">
                <span>📅 GeM Weekly Training Calendar</span>
                <span>• Live Interactive WebEx Sessions</span>
              </div>
              <h3 className="text-xl font-black">Join Free Live Online Masterclasses</h3>
              <p className="text-xs text-gray-200 max-w-2xl leading-relaxed">
                Connect directly with accredited GeM Master Trainers and Central Ministry Directors. Live Q&A sessions are held weekly for Buyers, MSE Sellers, and Procurement Officers.
              </p>
            </div>

            <div className="space-y-4">
              {GEM_LIVE_WEBINARS.map((web) => (
                <div
                  key={web.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-300 transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded uppercase">
                        For {web.targetRole}s
                      </span>
                      <span className="text-xs font-bold text-orange-600">
                        {web.dayTime}
                      </span>
                      <span className="text-xs text-gray-400">• {web.language}</span>
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">
                      {web.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 pt-1">
                      <span><strong>Lead Trainer:</strong> {web.trainerName} ({web.trainerTitle})</span>
                      <span className="text-emerald-700 font-bold">● {web.seatsLeft} Virtual Seats Remaining</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleRegisterWebinar(web)}
                      className="bg-[#f37021] hover:bg-[#e05e10] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Register Free</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Official Manuals & Circulars */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h3 className="font-black text-base text-gray-900">
                Official GeM Manuals, Standard Operating Procedures (SOPs) & Gazette Circulars
              </h3>
              <p className="text-xs text-gray-500">
                Download verified reference documents authorized by Department of Commerce and Department of Expenditure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GEM_TRAINING_RESOURCES.map((res) => (
                <div
                  key={res.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-start justify-between gap-4 hover:border-gray-300 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                        {res.format}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{res.size}</span>
                      <span className="text-[10px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">{res.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{res.description}</p>
                  </div>

                  <button
                    onClick={() => handleDownloadResource(res.title)}
                    className="shrink-0 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>📥</span>
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive FAQ Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-black text-base text-gray-900">
              Frequently Asked Questions (FAQs) on GeM Interactive Training & Certification
            </h3>
            <p className="text-xs text-gray-500">
              Answers to common queries regarding LMS enrollment, buyer certification levels, and live sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <h4 className="font-extrabold text-gray-900">Are these training courses really 100% free?</h4>
              <p className="text-gray-600 leading-relaxed">
                Yes. Under the Ministry of Commerce & Industry mandate, all self-paced SCORM eLearning modules, assessments, and live WebEx masterclasses are provided free of cost to all sovereign buyers and registered sellers.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <h4 className="font-extrabold text-gray-900">How does the Four-Level Buyer Certification work?</h4>
              <p className="text-gray-600 leading-relaxed">
                Buyers progress through Level 1 (Foundation), Level 2 (Direct & L1 Buying), Level 3 (Bidding & Reverse Auction), and Level 4 (Contract Administration & CRAC). Completing all 4 levels confers Master Government Buyer status.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <h4 className="font-extrabold text-gray-900">Can sellers take courses to prevent profile rejection?</h4>
              <p className="text-gray-600 leading-relaxed">
                Yes. Course <strong>GEM-S101</strong> covers exact protocols for CBDT PAN matching, GSTIN Active Regular status, and Aadhaar e-KYC to guarantee automated onboarding approval.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <h4 className="font-extrabold text-gray-900">How do I access the live WebEx training webinars?</h4>
              <p className="text-gray-600 leading-relaxed">
                Switch to the <em>Live Webinars (#TrainingCalendar)</em> tab above. Select your desired session and click Register Free to obtain direct room coordinates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Webinar Registration Toast Modal */}
      {registeredWebinar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 text-2xl font-black rounded-full flex items-center justify-center mx-auto">
              ✓
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-base text-gray-900">Virtual Seat Confirmed!</h3>
              <p className="text-xs text-gray-600">{registeredWebinar.title}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border text-xs text-left space-y-1 font-mono">
              <p><strong>Session Date:</strong> {registeredWebinar.date}</p>
              <p><strong>Schedule:</strong> {registeredWebinar.dayTime}</p>
              <p><strong>Platform:</strong> GeM Virtual WebEx Room</p>
              <p className="text-blue-900 break-all"><strong>Room Link:</strong> {registeredWebinar.sessionLink}</p>
            </div>

            <p className="text-[11px] text-gray-500">
              An invite with meeting coordinates has been added to your training calendar.
            </p>

            <button
              onClick={() => setRegisteredWebinar(null)}
              className="w-full py-2.5 bg-[#062134] hover:bg-[#0c3952] text-white font-black text-xs rounded-xl transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Active Course Player Modal */}
      {activeCourseForPlayer && (
        <CoursePlayerModal
          course={activeCourseForPlayer}
          onClose={() => setActiveCourseForPlayer(null)}
          onStartQuiz={() => {
            const crs = activeCourseForPlayer;
            setActiveCourseForPlayer(null);
            setActiveCourseForQuiz(crs);
          }}
          onNavigateToSimulatedRoute={onNavigateToModule}
        />
      )}

      {/* Active Quiz Modal */}
      {activeCourseForQuiz && (
        <CourseQuizModal
          course={activeCourseForQuiz}
          onClose={() => setActiveCourseForQuiz(null)}
          onClaimCertificate={() => {
            const crs = activeCourseForQuiz;
            setActiveCourseForQuiz(null);
            setActiveCourseForCert(crs);
          }}
        />
      )}

      {/* Active Certificate Modal */}
      {activeCourseForCert && (
        <CertificateModal
          course={activeCourseForCert}
          onClose={() => setActiveCourseForCert(null)}
        />
      )}
    </div>
  );
};
