export type MongoResource = {
  id: string;
  url: string;
  title: string;
  type: 'pdf' | 'docx' | 'ppt' | 'video';
  class: string;
  major: string;
  degree: string;
  year: string;
  by: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Resource = {
  id?: string;
  title: string;
  description: string;
  type: string;
  class: string;
  major: string;
  degree: string;
  year: string;
  by: string;
  thumbnail: {
    fileKey: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
    key: string;
    name: string;
    size: number;
    url: string;
  };
  file?: {
    fileKey: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
    key: string;
    name: string;
    size: number;
    url: string;
  };
  video: {
    url: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type authenticationUser = {
  id: string;
  name: string;
  username: string;
  password: string;
  profilePicture: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
  type: 'admin' | 'user';
  role?: string;
  emailVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'banned';
};

export type User = {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
  type: 'admin' | 'user';
  role?: string;
  emailVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'banned';
};

export type Report = {
  id?: string;
  tag: string;
  reason: string;
  status:
    | 'New'
    | 'Assigned'
    | 'In Progress'
    | 'Resolved'
    | 'Closed'
    | 'Reopened'
    | 'Deferred'
    | 'Duplicate';
  user_id: string;
  resource_id: string;
  createdAt: Date;
  updatedAt: Date;
};
