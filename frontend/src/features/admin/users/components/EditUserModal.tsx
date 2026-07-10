import { useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import type { AdminUser, UserRole } from "../api/adminUserService";
import { getErrorMessage } from "../../../../lib/http-error";

export interface EditUserModalProps {
    user: AdminUser | null;
    onClose: () => void;
    onSave: (userId: string, role: UserRole) => Promise<void>;
}

const ASSIGNABLE_ROLES: UserRole[] = ["Admin", "Customer"];

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
    const [role, setRole] = useState<UserRole>(() => user?.role ?? "Customer");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!user) return null;

    const handleSave = async () => {
        setError("");
        setSubmitting(true);
        try {
            await onSave(user.userResourceId, role);
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, "Could not update the user role."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={!!user}
            onClose={onClose}
            title={`Edit Role — ${user.name}`}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button isLoading={submitting} onClick={handleSave}>
                        Save
                    </Button>
                </>
            }
        >
            {error && <div className="text-red-700 text-sm text-center bg-red-50 p-3 rounded-xl mb-4" role="alert">{error}</div>}

            <label htmlFor="edit-user-role" className="block text-sm font-medium text-ink-700">Role</label>
            <select
                id="edit-user-role"
                className="mt-1 block w-full px-3 py-2 border border-sand-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
            >
                {ASSIGNABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>
        </Modal>
    );
}
