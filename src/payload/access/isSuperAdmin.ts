import type { User } from '@/payload-types';
import type { Access, FieldAccess, Where } from 'payload';

export const userHasRole = (
  user: User | null,
  allowedRoles: User['role'][]
) => {
  if (!user) return false;

  return allowedRoles.includes(user.role);
};

export const hasRoleAccess = (allowedRoles: User['role'][]): FieldAccess => {
  const accessFn: FieldAccess = ({ req: { user } }) => {
    return userHasRole(user, allowedRoles);
  };

  return accessFn;
};

export const isSuperAdmin = hasRoleAccess(['super-admin']);

export const isSuperAdminOrSelf: Access<User> = ({ req: { user } }) => {
  if (!user) return false;

  // super admin can read all docs
  if (user.role === 'super-admin') return true;

  // admin only have access to other admins
  if (user.role === 'admin')
    return {
      role: { equals: 'admin' }
    } as Where;

  return false;
};
