
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  delegationId?: string;
  permissions: Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canView: boolean; }>;
}

export interface UpdateUserData {
  userId: string;
  updates: {
    name?: string;
    role?: 'admin' | 'user';
    delegationId?: string;
  };
}
