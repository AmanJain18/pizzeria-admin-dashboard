import { IUser } from '../types';

export const hasPermission = () => {
    const allowedRoles = ['admin', 'manager'];

    const _checkRole = (data: IUser | null) => {
        // Check if user has permission
        if (data) {
            return allowedRoles.includes(data.role);
        }
        return false;
    };
    
    return {
        isAllowed: _checkRole,
    };
};
