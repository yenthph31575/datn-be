import { SetMetadata } from '@nestjs/common';

import { AdminRoles } from '../enumss';

export const ADMIN_ROLES_KEY = 'roles';
export const AdminRolesAllowed = (...roles: AdminRoles[]) => SetMetadata(ADMIN_ROLES_KEY, roles);
