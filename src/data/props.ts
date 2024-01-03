
export type UserProps = {
  id: number;
  name: string;
  email: string;
  phone: string;
  permissions: PermissionProps[];
  roles: RoleProps[];
};

export type PermissionProps = {
  id: number;
  name: string;
};

export type RoleProps = {
  id: number;
  name: string;
  permissions: PermissionProps[];
};
export type ProtectedPageProps = {
  requireAuth: boolean;
};

export type ProductProps = {
  id: number;
  name: string;
  details: string;
  image?: {
    path?: string;
  };
};
