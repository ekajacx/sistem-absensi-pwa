"use client";

import React from "react";
import ToastNotification from "./ToastNotification";
import ForcedPasswordModal from "./ForcedPasswordModal";
import AddEmployeeModal from "./AddEmployeeModal";
import CredentialsModal from "./CredentialsModal";
import ChangePasswordModal from "./ChangePasswordModal";
import LeaveModal from "./LeaveModal";
import EditEmployeeModal from "./EditEmployeeModal";
import ConfirmDialogModal from "./ConfirmDialogModal";
import ShiftModal from "./ShiftModal";
import DeleteShiftModal from "./DeleteShiftModal";
import CutiOverrideModal from "./CutiOverrideModal";
import EditAttendanceModal from "./EditAttendanceModal";
import AddJournalModal from "./AddJournalModal";
import LogoutModal from "./LogoutModal";

export default function AllModals() {
  return (
    <>
      <ToastNotification />
      <ForcedPasswordModal />
      <AddEmployeeModal />
      <CredentialsModal />
      <ChangePasswordModal />
      <LeaveModal />
      <EditEmployeeModal />
      <ConfirmDialogModal />
      <ShiftModal />
      <DeleteShiftModal />
      <CutiOverrideModal />
      <EditAttendanceModal />
      <AddJournalModal />
      <LogoutModal />
    </>
  );
}
