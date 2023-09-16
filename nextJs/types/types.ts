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
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'ppt' | 'video';
  class: string;
  major: string;
  degree: string;
  year: string;
  url: string;
  by: string;
  thumbnailUrl: string;
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
