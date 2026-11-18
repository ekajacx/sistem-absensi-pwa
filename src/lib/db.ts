import { Pool } from "pg";
import type {
  Employee,
  Shift,
  DayOfWeek,
  ShiftSlotType,
  AttendanceRecord,
  LeaveRequest,
  WorkJournal,
  ActivityLog,
  SystemUser,
  CompanyProfile,
} from "@/types";
import {
  initialEmployees,
  initialShifts,
  initialWeeklySchedules,
  initialAttendances,
  initialLeaves,
  initialJournals,
  initialUsers,
  initialSettings,
  initialCompanyProfile,
  initialActivityLogs,
  initialRolePermissions,
} from "@/data/initialData";

const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
  schemaVersion?: number;
};

export function getDbPool(): Pool {
  if (!globalForPg.pgPool) {
    const connectionString =
      process.env.DATABASE_URL ||
      "postgresql://postgres:jacx123@localhost:5432/sistem_absensi_pwa";
    const isLocalhost =
      connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1");
    globalForPg.pgPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
    });
  }
  return globalForPg.pgPool;
}

export async function ensureSchemaAndSeed(): Promise<void> {
  if (globalForPg.schemaVersion === 2) return;
  const pool = getDbPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Tabel Employees
    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(64) PRIMARY KEY,
        nik VARCHAR(32) NOT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        address TEXT NOT NULL,
        birth_date VARCHAR(32) NOT NULL,
        dept VARCHAR(64) NOT NULL,
        role VARCHAR(100) NOT NULL,
        level VARCHAR(64) NOT NULL,
        shift_id VARCHAR(64) NOT NULL,
        contract_type VARCHAR(32) NOT NULL,
        start_date VARCHAR(32) NOT NULL,
        end_date VARCHAR(32),
        join_date VARCHAR(32) NOT NULL,
        tenure VARCHAR(64) NOT NULL,
        face_registered BOOLEAN NOT NULL DEFAULT TRUE,
        face_score NUMERIC(5,2) NOT NULL DEFAULT 95.0,
        status VARCHAR(32) NOT NULL DEFAULT 'Aktif',
        avatar VARCHAR(16) NOT NULL,
        photo_url TEXT,
        manager_id VARCHAR(64),
        is_first_login BOOLEAN NOT NULL DEFAULT FALSE,
        temporary_password VARCHAR(64),
        password TEXT NOT NULL DEFAULT '123456',
        registered_device_id VARCHAR(100),
        device_model VARCHAR(120),
        device_status VARCHAR(32) DEFAULT 'Unbound',
        sort_order INT NOT NULL DEFAULT 0
      );
    `);
    await client.query(`
      ALTER TABLE employees ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT '123456';
    `);

    // 2. Tabel System Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_users (
        id VARCHAR(64) PRIMARY KEY,
        employee_id VARCHAR(64) NOT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        role VARCHAR(64) NOT NULL,
        dept VARCHAR(64) NOT NULL,
        last_login VARCHAR(100) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'AKTIF',
        is_first_login BOOLEAN NOT NULL DEFAULT FALSE,
        temporary_password VARCHAR(64),
        password TEXT NOT NULL DEFAULT '123456',
        sort_order INT NOT NULL DEFAULT 0
      );
    `);
    await client.query(`
      ALTER TABLE system_users ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT '123456';
    `);

    // 3. Tabel Master Shifts
    await client.query(`
      CREATE TABLE IF NOT EXISTS shifts (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        start_time VARCHAR(16) NOT NULL,
        end_time VARCHAR(16) NOT NULL,
        tolerance VARCHAR(64) NOT NULL,
        open_before VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'Aktif',
        sort_order INT NOT NULL DEFAULT 0
      );
    `);

    // 4. Tabel Weekly Schedules
    await client.query(`
      CREATE TABLE IF NOT EXISTS weekly_schedules (
        employee_id VARCHAR(64) PRIMARY KEY,
        schedule_json JSONB NOT NULL
      );
    `);

    // 5. Tabel Attendances (Rekap Kehadiran)
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendances (
        id VARCHAR(64) PRIMARY KEY,
        employee_id VARCHAR(64) NOT NULL,
        name VARCHAR(150) NOT NULL,
        nik VARCHAR(32) NOT NULL,
        dept VARCHAR(64) NOT NULL,
        shift VARCHAR(100) NOT NULL,
        check_in VARCHAR(32) NOT NULL,
        check_out VARCHAR(32) NOT NULL,
        dist NUMERIC(8,2) NOT NULL DEFAULT 0,
        score NUMERIC(5,2) NOT NULL DEFAULT 0,
        status VARCHAR(32) NOT NULL,
        work_date VARCHAR(64) NOT NULL,
        is_edited BOOLEAN DEFAULT FALSE,
        edited_by VARCHAR(150),
        edit_reason TEXT,
        edited_at VARCHAR(100),
        sort_order INT NOT NULL DEFAULT 0
      );
    `);

    // 6. Tabel Leave Requests (Pengajuan Cuti)
    await client.query(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id VARCHAR(64) PRIMARY KEY,
        employee_id VARCHAR(64) NOT NULL,
        name VARCHAR(150) NOT NULL,
        dept VARCHAR(64) NOT NULL,
        leave_type VARCHAR(64) NOT NULL,
        start_date VARCHAR(32) NOT NULL,
        end_date VARCHAR(32) NOT NULL,
        days INT NOT NULL DEFAULT 1,
        reason TEXT NOT NULL,
        status VARCHAR(32) NOT NULL,
        approver_id VARCHAR(64),
        approver_name VARCHAR(150),
        approved_at VARCHAR(100),
        is_archived BOOLEAN NOT NULL DEFAULT FALSE,
        sort_order INT NOT NULL DEFAULT 0
      );
    `);

    // 7. Tabel Work Journals (Jurnal Kerja Harian)
    await client.query(`
      CREATE TABLE IF NOT EXISTS work_journals (
        id VARCHAR(64) PRIMARY KEY,
        employee_id VARCHAR(64) NOT NULL,
        name VARCHAR(150) NOT NULL,
        dept VARCHAR(64) NOT NULL,
        avatar VARCHAR(16) NOT NULL,
        work_date VARCHAR(64) NOT NULL,
        hours VARCHAR(32) NOT NULL,
        score NUMERIC(5,2) NOT NULL DEFAULT 90,
        tasks_json JSONB NOT NULL,
        notes TEXT,
        is_archived BOOLEAN NOT NULL DEFAULT FALSE,
        sort_order INT NOT NULL DEFAULT 0
      );
    `);

    // 8. Tabel Activity Logs (Audit Log)
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(64) PRIMARY KEY,
        timestamp_wita VARCHAR(100) NOT NULL,
        log_type VARCHAR(64) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        employee_name VARCHAR(150) NOT NULL,
        dept VARCHAR(64) NOT NULL,
        actor_name VARCHAR(150) NOT NULL,
        actor_role VARCHAR(100) NOT NULL,
        is_edited BOOLEAN NOT NULL DEFAULT FALSE,
        edit_reason TEXT,
        sort_order INT NOT NULL DEFAULT 0
      );
    `);

    // 9. Tabel Company Profile (Kop Surat & Identitas Perusahaan)
    await client.query(`
      CREATE TABLE IF NOT EXISTS company_profile (
        id INT PRIMARY KEY DEFAULT 1,
        name VARCHAR(200) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(64) NOT NULL,
        email VARCHAR(150) NOT NULL,
        logo_url TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 10. Tabel Office Settings (Geofence & Anti-Fake GPS)
    await client.query(`
      CREATE TABLE IF NOT EXISTS office_settings (
        id INT PRIMARY KEY DEFAULT 1,
        office_name VARCHAR(200) NOT NULL,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        geofence_radius INT NOT NULL DEFAULT 50,
        min_safe_distance DOUBLE PRECISION NOT NULL DEFAULT 2,
        ai_face_threshold INT NOT NULL DEFAULT 80,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 11. Tabel Role Permissions (RBAC)
    await client.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_name VARCHAR(64) PRIMARY KEY,
        permissions_json JSONB NOT NULL
      );
    `);

    // Seed data awal jika tabel employees masih kosong
    const empCheck = await client.query<{ cnt: string }>(
      "SELECT COUNT(*)::text AS cnt FROM employees"
    );
    if (Number(empCheck.rows[0]?.cnt || 0) === 0) {
      for (let i = 0; i < initialEmployees.length; i++) {
        const e = initialEmployees[i];
        await client.query(
          `INSERT INTO employees (
            id, nik, name, email, phone, address, birth_date, dept, role, level,
            shift_id, contract_type, start_date, end_date, join_date, tenure,
            face_registered, face_score, status, avatar, photo_url, manager_id,
            is_first_login, temporary_password, registered_device_id, device_model,
            device_status, sort_order
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,
            $17,$18,$19,$20,$21,$22,
            $23,$24,$25,$26,$27,$28
          )`,
          [
            e.id,
            e.nik,
            e.name,
            e.email,
            e.phone,
            e.address,
            e.birthDate,
            e.dept,
            e.role,
            e.level,
            e.shiftId,
            e.contractType,
            e.startDate,
            e.endDate ?? null,
            e.joinDate,
            e.tenure,
            e.faceRegistered,
            e.faceScore,
            e.status,
            e.avatar,
            e.photoUrl ?? null,
            e.managerId ?? null,
            e.isFirstLogin,
            e.temporaryPassword ?? null,
            e.registeredDeviceId ?? null,
            e.deviceModel ?? null,
            e.deviceStatus ?? "Unbound",
            i,
          ]
        );
      }

      for (let i = 0; i < initialUsers.length; i++) {
        const u = initialUsers[i];
        await client.query(
          `INSERT INTO system_users (
            id, employee_id, name, email, role, dept, last_login, status,
            is_first_login, temporary_password, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [
            u.id,
            u.employeeId,
            u.name,
            u.email,
            u.role,
            u.dept,
            u.lastLogin,
            u.status,
            u.isFirstLogin,
            u.temporaryPassword ?? null,
            i,
          ]
        );
      }

      for (let i = 0; i < initialShifts.length; i++) {
        const s = initialShifts[i];
        await client.query(
          `INSERT INTO shifts (id, name, start_time, end_time, tolerance, open_before, status, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [s.id, s.name, s.startTime, s.endTime, s.tolerance, s.openBefore, s.status, i]
        );
      }

      for (const [empId, sched] of Object.entries(initialWeeklySchedules)) {
        await client.query(
          `INSERT INTO weekly_schedules (employee_id, schedule_json) VALUES ($1, $2::jsonb)`,
          [empId, JSON.stringify(sched)]
        );
      }

      for (let i = 0; i < initialAttendances.length; i++) {
        const a = initialAttendances[i];
        await client.query(
          `INSERT INTO attendances (
            id, employee_id, name, nik, dept, shift, check_in, check_out,
            dist, score, status, work_date, is_edited, edited_by, edit_reason, edited_at, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
          [
            a.id,
            a.employeeId,
            a.name,
            a.nik,
            a.dept,
            a.shift,
            a.in,
            a.out,
            a.dist,
            a.score,
            a.status,
            a.date,
            Boolean(a.isEdited),
            a.editedBy ?? null,
            a.editReason ?? null,
            a.editedAt ?? null,
            i,
          ]
        );
      }

      for (let i = 0; i < initialLeaves.length; i++) {
        const l = initialLeaves[i];
        await client.query(
          `INSERT INTO leave_requests (
            id, employee_id, name, dept, leave_type, start_date, end_date,
            days, reason, status, approver_id, approver_name, approved_at, is_archived, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
          [
            l.id,
            l.employeeId,
            l.name,
            l.dept,
            l.type,
            l.start,
            l.end,
            l.days,
            l.reason,
            l.status,
            l.approverId ?? null,
            l.approverName ?? null,
            l.approvedAt ?? null,
            Boolean(l.isArchived),
            i,
          ]
        );
      }

      for (let i = 0; i < initialJournals.length; i++) {
        const j = initialJournals[i];
        await client.query(
          `INSERT INTO work_journals (
            id, employee_id, name, dept, avatar, work_date, hours, score,
            tasks_json, notes, is_archived, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12)`,
          [
            j.id,
            j.employeeId,
            j.name,
            j.dept,
            j.avatar,
            j.date,
            j.hours,
            j.score,
            JSON.stringify(j.tasks),
            j.notes ?? null,
            Boolean(j.isArchived),
            i,
          ]
        );
      }

      for (let i = 0; i < initialActivityLogs.length; i++) {
        const log = initialActivityLogs[i];
        await client.query(
          `INSERT INTO activity_logs (
            id, timestamp_wita, log_type, title, description, employee_name,
            dept, actor_name, actor_role, is_edited, edit_reason, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [
            log.id,
            log.timestamp,
            log.type,
            log.title,
            log.description,
            log.employeeName,
            log.dept,
            log.actorName,
            log.actorRole,
            log.isEdited,
            log.editReason ?? null,
            i,
          ]
        );
      }

      await client.query(
        `INSERT INTO company_profile (id, name, address, phone, email, logo_url)
         VALUES (1, $1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [
          initialCompanyProfile.name,
          initialCompanyProfile.address,
          initialCompanyProfile.phone,
          initialCompanyProfile.email,
          initialCompanyProfile.logoUrl,
        ]
      );

      await client.query(
        `INSERT INTO office_settings (
          id, office_name, latitude, longitude, geofence_radius, min_safe_distance, ai_face_threshold
         ) VALUES (1, $1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [
          initialSettings.officeName,
          initialSettings.latitude,
          initialSettings.longitude,
          initialSettings.geofenceRadius,
          initialSettings.minSafeDistance,
          initialSettings.aiFaceThreshold,
        ]
      );

      for (const [role, perms] of Object.entries(initialRolePermissions)) {
        await client.query(
          `INSERT INTO role_permissions (role_name, permissions_json)
           VALUES ($1, $2::jsonb)
           ON CONFLICT (role_name) DO NOTHING`,
          [role, JSON.stringify(perms)]
        );
      }
    }

    await client.query("COMMIT");
    globalForPg.schemaVersion = 2;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export interface FullAppDatabaseState {
  employees: Employee[];
  users: SystemUser[];
  shifts: Shift[];
  weeklySchedules: Record<string, Record<DayOfWeek, ShiftSlotType>>;
  attendances: AttendanceRecord[];
  leaves: LeaveRequest[];
  journals: WorkJournal[];
  activityLogs: ActivityLog[];
  companyProfile: CompanyProfile;
  settings: typeof initialSettings;
  rolePermissions: Record<string, string[]>;
}

export async function loadFullDatabaseState(): Promise<FullAppDatabaseState> {
  await ensureSchemaAndSeed();
  const pool = getDbPool();

  const [
    empRes,
    usrRes,
    shiftRes,
    schedRes,
    attRes,
    leaveRes,
    jrnRes,
    logRes,
    compRes,
    offRes,
    permRes,
  ] = await Promise.all([
    pool.query("SELECT * FROM employees ORDER BY sort_order ASC"),
    pool.query("SELECT * FROM system_users ORDER BY sort_order ASC"),
    pool.query("SELECT * FROM shifts ORDER BY sort_order ASC"),
    pool.query("SELECT * FROM weekly_schedules"),
    pool.query("SELECT * FROM attendances ORDER BY sort_order ASC"),
    pool.query("SELECT * FROM leave_requests ORDER BY sort_order ASC"),
    pool.query("SELECT * FROM work_journals ORDER BY sort_order ASC"),
    pool.query("SELECT * FROM activity_logs ORDER BY sort_order ASC"),
    pool.query("SELECT * FROM company_profile WHERE id = 1"),
    pool.query("SELECT * FROM office_settings WHERE id = 1"),
    pool.query("SELECT * FROM role_permissions"),
  ]);

  const employees: Employee[] = empRes.rows.map((r) => ({
    id: String(r.id),
    nik: String(r.nik),
    name: String(r.name),
    email: String(r.email),
    phone: String(r.phone),
    address: String(r.address),
    birthDate: String(r.birth_date),
    dept: r.dept as Employee["dept"],
    role: String(r.role),
    level: r.level as Employee["level"],
    shiftId: String(r.shift_id),
    contractType: r.contract_type as Employee["contractType"],
    startDate: String(r.start_date),
    endDate: r.end_date ? String(r.end_date) : null,
    joinDate: String(r.join_date),
    tenure: String(r.tenure),
    faceRegistered: Boolean(r.face_registered),
    faceScore: Number(r.face_score),
    status: r.status as Employee["status"],
    avatar: String(r.avatar),
    photoUrl: r.photo_url ? String(r.photo_url) : null,
    managerId: r.manager_id ? String(r.manager_id) : null,
    isFirstLogin: Boolean(r.is_first_login),
    temporaryPassword: r.temporary_password ? String(r.temporary_password) : null,
    password: r.password ? String(r.password) : "123456",
    registeredDeviceId: r.registered_device_id ? String(r.registered_device_id) : null,
    deviceModel: r.device_model ? String(r.device_model) : null,
    deviceStatus: (r.device_status as Employee["deviceStatus"]) || "Unbound",
  }));

  const users: SystemUser[] = usrRes.rows.map((r) => ({
    id: String(r.id),
    employeeId: String(r.employee_id),
    name: String(r.name),
    email: String(r.email),
    role: r.role as SystemUser["role"],
    dept: String(r.dept),
    lastLogin: String(r.last_login),
    status: r.status as SystemUser["status"],
    isFirstLogin: Boolean(r.is_first_login),
    temporaryPassword: r.temporary_password ? String(r.temporary_password) : null,
    password: r.password ? String(r.password) : "123456",
  }));

  const shifts: Shift[] = shiftRes.rows.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    startTime: String(r.start_time),
    endTime: String(r.end_time),
    tolerance: String(r.tolerance),
    openBefore: String(r.open_before),
    status: r.status as Shift["status"],
  }));

  const weeklySchedules: Record<string, Record<DayOfWeek, ShiftSlotType>> = {};
  for (const r of schedRes.rows) {
    weeklySchedules[String(r.employee_id)] = r.schedule_json as Record<DayOfWeek, ShiftSlotType>;
  }

  const attendances: AttendanceRecord[] = attRes.rows.map((r) => ({
    id: String(r.id),
    employeeId: String(r.employee_id),
    name: String(r.name),
    nik: String(r.nik),
    dept: String(r.dept),
    shift: String(r.shift),
    in: String(r.check_in),
    out: String(r.check_out),
    dist: Number(r.dist),
    score: Number(r.score),
    status: r.status as AttendanceRecord["status"],
    date: String(r.work_date),
    isEdited: Boolean(r.is_edited),
    editedBy: r.edited_by ? String(r.edited_by) : undefined,
    editReason: r.edit_reason ? String(r.edit_reason) : undefined,
    editedAt: r.edited_at ? String(r.edited_at) : undefined,
  }));

  const leaves: LeaveRequest[] = leaveRes.rows.map((r) => ({
    id: String(r.id),
    employeeId: String(r.employee_id),
    name: String(r.name),
    dept: String(r.dept),
    type: r.leave_type as LeaveRequest["type"],
    start: String(r.start_date),
    end: String(r.end_date),
    days: Number(r.days),
    reason: String(r.reason),
    status: r.status as LeaveRequest["status"],
    approverId: r.approver_id ? String(r.approver_id) : undefined,
    approverName: r.approver_name ? String(r.approver_name) : undefined,
    approvedAt: r.approved_at ? String(r.approved_at) : undefined,
    isArchived: Boolean(r.is_archived),
  }));

  const journals: WorkJournal[] = jrnRes.rows.map((r) => ({
    id: String(r.id),
    employeeId: String(r.employee_id),
    name: String(r.name),
    dept: String(r.dept),
    avatar: String(r.avatar),
    date: String(r.work_date),
    hours: String(r.hours),
    score: Number(r.score),
    tasks: Array.isArray(r.tasks_json) ? (r.tasks_json as string[]) : [],
    notes: r.notes ? String(r.notes) : undefined,
    isArchived: Boolean(r.is_archived),
  }));

  const activityLogs: ActivityLog[] = logRes.rows.map((r) => ({
    id: String(r.id),
    timestamp: String(r.timestamp_wita),
    type: r.log_type as ActivityLog["type"],
    title: String(r.title),
    description: String(r.description),
    employeeName: String(r.employee_name),
    dept: String(r.dept),
    actorName: String(r.actor_name),
    actorRole: String(r.actor_role),
    isEdited: Boolean(r.is_edited),
    editReason: r.edit_reason ? String(r.edit_reason) : undefined,
  }));

  const compRow = compRes.rows[0];
  const companyProfile: CompanyProfile = compRow
    ? {
        name: String(compRow.name),
        address: String(compRow.address),
        phone: String(compRow.phone),
        email: String(compRow.email),
        logoUrl: compRow.logo_url ? String(compRow.logo_url) : null,
      }
    : initialCompanyProfile;

  const offRow = offRes.rows[0];
  const settings = offRow
    ? {
        officeName: String(offRow.office_name),
        latitude: Number(offRow.latitude),
        longitude: Number(offRow.longitude),
        geofenceRadius: Number(offRow.geofence_radius),
        minSafeDistance: Number(offRow.min_safe_distance ?? 2),
        aiFaceThreshold: Number(offRow.ai_face_threshold),
      }
    : initialSettings;

  const rolePermissions: Record<string, string[]> = {};
  for (const r of permRes.rows) {
    rolePermissions[String(r.role_name)] = Array.isArray(r.permissions_json)
      ? (r.permissions_json as string[])
      : [];
  }

  return {
    employees,
    users,
    shifts,
    weeklySchedules,
    attendances,
    leaves,
    journals,
    activityLogs,
    companyProfile,
    settings,
    rolePermissions:
      Object.keys(rolePermissions).length > 0 ? rolePermissions : initialRolePermissions,
  };
}

export async function saveFullDatabaseState(
  payload: Partial<FullAppDatabaseState>
): Promise<void> {
  await ensureSchemaAndSeed();
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (Array.isArray(payload.employees)) {
      await client.query("DELETE FROM employees");
      for (let i = 0; i < payload.employees.length; i++) {
        const e = payload.employees[i];
        await client.query(
          `INSERT INTO employees (
            id, nik, name, email, phone, address, birth_date, dept, role, level,
            shift_id, contract_type, start_date, end_date, join_date, tenure,
            face_registered, face_score, status, avatar, photo_url, manager_id,
            is_first_login, temporary_password, password, registered_device_id, device_model,
            device_status, sort_order
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,
            $17,$18,$19,$20,$21,$22,
            $23,$24,$25,$26,$27,$28,$29
          )`,
          [
            e.id,
            e.nik,
            e.name,
            e.email,
            e.phone,
            e.address,
            e.birthDate,
            e.dept,
            e.role,
            e.level,
            e.shiftId,
            e.contractType,
            e.startDate,
            e.endDate ?? null,
            e.joinDate,
            e.tenure,
            Boolean(e.faceRegistered),
            Number(e.faceScore ?? 95),
            e.status,
            e.avatar,
            e.photoUrl ?? null,
            e.managerId ?? null,
            Boolean(e.isFirstLogin),
            e.temporaryPassword ?? null,
            e.password || "123456",
            e.registeredDeviceId ?? null,
            e.deviceModel ?? null,
            e.deviceStatus ?? "Unbound",
            i,
          ]
        );
      }
    }

    if (Array.isArray(payload.users)) {
      await client.query("DELETE FROM system_users");
      for (let i = 0; i < payload.users.length; i++) {
        const u = payload.users[i];
        await client.query(
          `INSERT INTO system_users (
            id, employee_id, name, email, role, dept, last_login, status,
            is_first_login, temporary_password, password, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [
            u.id,
            u.employeeId,
            u.name,
            u.email,
            u.role,
            u.dept,
            u.lastLogin,
            u.status,
            Boolean(u.isFirstLogin),
            u.temporaryPassword ?? null,
            u.password || "123456",
            i,
          ]
        );
      }
    }

    if (Array.isArray(payload.shifts)) {
      await client.query("DELETE FROM shifts");
      for (let i = 0; i < payload.shifts.length; i++) {
        const s = payload.shifts[i];
        await client.query(
          `INSERT INTO shifts (id, name, start_time, end_time, tolerance, open_before, status, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [s.id, s.name, s.startTime, s.endTime, s.tolerance, s.openBefore, s.status, i]
        );
      }
    }

    if (payload.weeklySchedules && typeof payload.weeklySchedules === "object") {
      await client.query("DELETE FROM weekly_schedules");
      for (const [empId, sched] of Object.entries(payload.weeklySchedules)) {
        await client.query(
          `INSERT INTO weekly_schedules (employee_id, schedule_json) VALUES ($1, $2::jsonb)`,
          [empId, JSON.stringify(sched)]
        );
      }
    }

    if (Array.isArray(payload.attendances)) {
      await client.query("DELETE FROM attendances");
      for (let i = 0; i < payload.attendances.length; i++) {
        const a = payload.attendances[i];
        await client.query(
          `INSERT INTO attendances (
            id, employee_id, name, nik, dept, shift, check_in, check_out,
            dist, score, status, work_date, is_edited, edited_by, edit_reason, edited_at, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
          [
            a.id,
            a.employeeId,
            a.name,
            a.nik,
            a.dept,
            a.shift,
            a.in,
            a.out,
            Number(a.dist ?? 0),
            Number(a.score ?? 0),
            a.status,
            a.date,
            Boolean(a.isEdited),
            a.editedBy ?? null,
            a.editReason ?? null,
            a.editedAt ?? null,
            i,
          ]
        );
      }
    }

    if (Array.isArray(payload.leaves)) {
      await client.query("DELETE FROM leave_requests");
      for (let i = 0; i < payload.leaves.length; i++) {
        const l = payload.leaves[i];
        await client.query(
          `INSERT INTO leave_requests (
            id, employee_id, name, dept, leave_type, start_date, end_date,
            days, reason, status, approver_id, approver_name, approved_at, is_archived, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
          [
            l.id,
            l.employeeId,
            l.name,
            l.dept,
            l.type,
            l.start,
            l.end,
            Number(l.days ?? 1),
            l.reason,
            l.status,
            l.approverId ?? null,
            l.approverName ?? null,
            l.approvedAt ?? null,
            Boolean(l.isArchived),
            i,
          ]
        );
      }
    }

    if (Array.isArray(payload.journals)) {
      await client.query("DELETE FROM work_journals");
      for (let i = 0; i < payload.journals.length; i++) {
        const j = payload.journals[i];
        await client.query(
          `INSERT INTO work_journals (
            id, employee_id, name, dept, avatar, work_date, hours, score,
            tasks_json, notes, is_archived, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12)`,
          [
            j.id,
            j.employeeId,
            j.name,
            j.dept,
            j.avatar,
            j.date,
            j.hours,
            Number(j.score ?? 90),
            JSON.stringify(j.tasks || []),
            j.notes ?? null,
            Boolean(j.isArchived),
            i,
          ]
        );
      }
    }

    if (Array.isArray(payload.activityLogs)) {
      await client.query("DELETE FROM activity_logs");
      for (let i = 0; i < payload.activityLogs.length; i++) {
        const log = payload.activityLogs[i];
        await client.query(
          `INSERT INTO activity_logs (
            id, timestamp_wita, log_type, title, description, employee_name,
            dept, actor_name, actor_role, is_edited, edit_reason, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [
            log.id,
            log.timestamp,
            log.type,
            log.title,
            log.description,
            log.employeeName,
            log.dept,
            log.actorName,
            log.actorRole,
            Boolean(log.isEdited),
            log.editReason ?? null,
            i,
          ]
        );
      }
    }

    if (payload.companyProfile && typeof payload.companyProfile === "object") {
      const cp = payload.companyProfile;
      await client.query(
        `INSERT INTO company_profile (id, name, address, phone, email, logo_url, updated_at)
         VALUES (1, $1, $2, $3, $4, $5, NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           address = EXCLUDED.address,
           phone = EXCLUDED.phone,
           email = EXCLUDED.email,
           logo_url = EXCLUDED.logo_url,
           updated_at = NOW()`,
        [cp.name, cp.address, cp.phone, cp.email, cp.logoUrl ?? null]
      );
    }

    if (payload.settings && typeof payload.settings === "object") {
      const st = payload.settings;
      await client.query(
        `INSERT INTO office_settings (
          id, office_name, latitude, longitude, geofence_radius, min_safe_distance, ai_face_threshold, updated_at
         ) VALUES (1, $1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (id) DO UPDATE SET
           office_name = EXCLUDED.office_name,
           latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude,
           geofence_radius = EXCLUDED.geofence_radius,
           min_safe_distance = EXCLUDED.min_safe_distance,
           ai_face_threshold = EXCLUDED.ai_face_threshold,
           updated_at = NOW()`,
        [
          st.officeName,
          st.latitude,
          st.longitude,
          st.geofenceRadius,
          st.minSafeDistance ?? 2,
          st.aiFaceThreshold,
        ]
      );
    }

    if (payload.rolePermissions && typeof payload.rolePermissions === "object") {
      for (const [role, perms] of Object.entries(payload.rolePermissions)) {
        await client.query(
          `INSERT INTO role_permissions (role_name, permissions_json)
           VALUES ($1, $2::jsonb)
           ON CONFLICT (role_name) DO UPDATE SET
             permissions_json = EXCLUDED.permissions_json`,
          [role, JSON.stringify(perms)]
        );
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
