const fs = require('fs');
const path = require('path');

const backup = fs.readFileSync('C:/Users/EKA JACX/.gemini/antigravity/scratch/page.backup.tsx', 'utf8');

console.log('--- 1. FILE EXISTENCE & SIZE CHECK ---');
const components = [
  'src/types/index.ts',
  'src/data/initialData.ts',
  'src/context/AppContext.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/layout/Topbar.tsx',
  'src/components/modals/AllModals.tsx',
  'src/components/views/DashboardView.tsx',
  'src/components/views/KaryawanView.tsx',
  'src/components/views/DepartemenView.tsx',
  'src/components/views/UserManagementView.tsx',
  'src/components/views/IzinAksesView.tsx',
  'src/components/views/AbsensiView.tsx',
  'src/components/views/RekapAbsensiView.tsx',
  'src/components/views/JabatanView.tsx',
  'src/components/views/KontrakView.tsx',
  'src/components/views/JadwalShiftView.tsx',
  'src/components/views/PengajuanCutiView.tsx',
  'src/components/views/JurnalKerjaView.tsx',
  'src/components/views/PengaturanView.tsx',
  'src/components/views/AuditLogView.tsx',
  'src/app/page.tsx',
];

components.forEach(f => {
  if (fs.existsSync(f)) {
    const stat = fs.statSync(f);
    console.log(`${f}: OK (${stat.size} bytes)`);
  } else {
    console.error(`${f}: MISSING!`);
  }
});
