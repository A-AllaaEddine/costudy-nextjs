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
  thumbnail?: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    key?: string;
    name?: string;
    size?: number;
    url?: string;
  };
  file?: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    key?: string;
    name?: string;
    size?: number;
    url?: string;
  };
  video?: {
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
  status: 'Open' | 'Forwarded' | 'Resolved' | 'Closed' | 'Duplicate';
  user_id: string;
  resource_id: string;
  parentReportId?: string;
  type: 'Resource' | 'Website';
  createdAt: Date;
  updatedAt: Date;
};

export type Ticket = {
  id: string;
  tag: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'Forwarded' | 'Resolved' | 'Closed' | 'Duplicate';
  createdAt: Date;
  updatedAt: Date;
};
