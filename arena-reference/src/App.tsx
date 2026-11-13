import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LanguageProvider } from './lib/i18n';
import PortalShell from './components/shell';

import Landing from './pages/Landing';
import PlatformPortal from './pages/platform/PlatformPortal';
import {
  PrincipalDashboard, InfoCenter,
} from './pages/principal/PrincipalPages';
import {
  AssignmentsCenter, OperationalPlan, ImpactCenter, SchoolAffairs, ClassesCenter,
  TeachersAffairs, StudentsAffairs, ExamsGrades, ExamsControl,
} from './pages/principal/PrincipalPages2';
import {
  BehaviorAbsence, BehaviorViolations, BehaviorPositive, LibraryPage, TimetablePage,
} from './pages/principal/PrincipalPages3';
import {
  HealthPage, ActivitiesPage, TalentedPage, SpecialEdPage, ResourcesPage, LabsPage,
  IntegrationPage, AssistantPage,
} from './pages/principal/PrincipalPages4';
import { PermissionsPage, PrincipalSettings, ReportsPage } from './pages/principal/PrincipalPages5';
import TeacherPortal from './pages/teacher/TeacherPortal';
import FamilyPortal from './pages/family/FamilyPortal';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { document.querySelector('main')?.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* ── بوابة مدير المنصة ── */}
          <Route path="/platform/*" element={<PortalShell portal="platform"><PlatformPortal /></PortalShell>} />

          {/* ── بوابة مدير المدرسة — 18 قسم ── */}
          <Route path="/principal" element={<PortalShell portal="principal"><PrincipalDashboard /></PortalShell>} />
          <Route path="/principal/info-center" element={<PortalShell portal="principal"><InfoCenter /></PortalShell>} />
          <Route path="/principal/assignments" element={<PortalShell portal="principal"><AssignmentsCenter /></PortalShell>} />
          <Route path="/principal/operational-plan" element={<PortalShell portal="principal"><OperationalPlan /></PortalShell>} />
          <Route path="/principal/impact" element={<PortalShell portal="principal"><ImpactCenter /></PortalShell>} />
          <Route path="/principal/school-affairs" element={<PortalShell portal="principal"><SchoolAffairs /></PortalShell>} />
          <Route path="/principal/classes" element={<PortalShell portal="principal"><ClassesCenter /></PortalShell>} />
          <Route path="/principal/teachers" element={<PortalShell portal="principal"><TeachersAffairs /></PortalShell>} />
          <Route path="/principal/students" element={<PortalShell portal="principal"><StudentsAffairs /></PortalShell>} />
          <Route path="/principal/exams/grades" element={<PortalShell portal="principal"><ExamsGrades /></PortalShell>} />
          <Route path="/principal/exams/control" element={<PortalShell portal="principal"><ExamsControl /></PortalShell>} />
          <Route path="/principal/behavior/absence" element={<PortalShell portal="principal"><BehaviorAbsence /></PortalShell>} />
          <Route path="/principal/behavior/violations" element={<PortalShell portal="principal"><BehaviorViolations /></PortalShell>} />
          <Route path="/principal/behavior/positive" element={<PortalShell portal="principal"><BehaviorPositive /></PortalShell>} />
          <Route path="/principal/library" element={<PortalShell portal="principal"><LibraryPage /></PortalShell>} />
          <Route path="/principal/timetable" element={<PortalShell portal="principal"><TimetablePage /></PortalShell>} />
          <Route path="/principal/health" element={<PortalShell portal="principal"><HealthPage /></PortalShell>} />
          <Route path="/principal/activities" element={<PortalShell portal="principal"><ActivitiesPage /></PortalShell>} />
          <Route path="/principal/talented" element={<PortalShell portal="principal"><TalentedPage /></PortalShell>} />
          <Route path="/principal/special-ed" element={<PortalShell portal="principal"><SpecialEdPage /></PortalShell>} />
          <Route path="/principal/resources" element={<PortalShell portal="principal"><ResourcesPage /></PortalShell>} />
          <Route path="/principal/labs" element={<PortalShell portal="principal"><LabsPage /></PortalShell>} />
          <Route path="/principal/integrations/noor" element={<PortalShell portal="principal"><IntegrationPage kind="noor" /></PortalShell>} />
          <Route path="/principal/integrations/madrasati" element={<PortalShell portal="principal"><IntegrationPage kind="madrasati" /></PortalShell>} />
          <Route path="/principal/integrations/hudori" element={<PortalShell portal="principal"><IntegrationPage kind="hudori" /></PortalShell>} />
          <Route path="/principal/assistant" element={<PortalShell portal="principal"><AssistantPage /></PortalShell>} />
          <Route path="/principal/permissions" element={<PortalShell portal="principal"><PermissionsPage /></PortalShell>} />
          <Route path="/principal/settings" element={<PortalShell portal="principal"><PrincipalSettings /></PortalShell>} />
          <Route path="/principal/reports" element={<PortalShell portal="principal"><ReportsPage /></PortalShell>} />
          {/* Aliases for profile/settings links from chrome */}
          <Route path="/principal/profile" element={<Navigate to="/principal/settings" replace />} />
          <Route path="/principal/settings/*" element={<PortalShell portal="principal"><PrincipalSettings /></PortalShell>} />

          {/* ── بوابة المعلم ── */}
          <Route path="/teacher/*" element={<PortalShell portal="teacher"><TeacherPortal /></PortalShell>} />

          {/* ── بوابة الأسرة ── */}
          <Route path="/family/*" element={<PortalShell portal="family"><FamilyPortal /></PortalShell>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}
