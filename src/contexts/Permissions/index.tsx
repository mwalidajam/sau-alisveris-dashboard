import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserProps } from "@/data/props";
import { useSession } from "next-auth/react";

const PermissionsContext = createContext({
    rolesList: [] as RoleProps[],
    permissionsList: [] as PermissionProps[],
    setRoles: (roles: RoleProps[]) => { },
    setPermissions: (permissions: PermissionProps[]) => { },
    permission: (permission: string) => false as boolean,
    role: (role: string) => false as boolean,
    roleOrPermission: (roles: string[], permissions: string[]) => false as boolean,
});

type PermissionProps = {
    id: number,
    name: string;
}

type RoleProps = {
    id: number,
    name: string;
}

type PermissionsProviderProps = {
    children: React.ReactNode;
};

type SWRUserProps = {
    user: UserProps;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
    // const { data, error, isLoading } = useSWR<SWRUserProps>('/api/user/permissions', { revalidateOnFocus: false });
    const { data: session, status } = useSession();
    const [rolesList, setRoles] = useState<RoleProps[]>([] as RoleProps[]);
    const [permissionsList, setPermissions] = useState<PermissionProps[]>([] as PermissionProps[]);

    const permission = (permission: string) => {
        if (rolesList?.some(role => role.name === 'super-admin')) return true;
        return permissionsList?.some(p => p.name === permission);
    };

    const role = (role: string) => {
        if (rolesList?.some(role => role.name === 'super-admin')) return true;
        return rolesList?.some(r => r.name === role);
    };

    const roleOrPermission = (roles: string[], permissions: string[]) => {
        if (rolesList?.some(role => role.name === 'super-admin')) return true;
        return rolesList?.some(r => roles.includes(r.name)) || permissionsList?.some(p => permissions.includes(p.name));
    };

    useEffect(() => {
        (async () => {
            const { data } = await axios.get('/api/users/permissions', {
                validateStatus: (status) => {
                    return status < 501;
                }
            });
            console.log(data);
            setRoles(data?.user?.roles);
            setPermissions(data?.user?.permissions);
        })();
    }, [session]);

    return (
        <PermissionsContext.Provider value={{
            rolesList,
            permissionsList,
            setRoles,
            setPermissions,
            permission,
            role,
            roleOrPermission,
        }}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => useContext(PermissionsContext);

export default PermissionsContext;