import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { hashPassword, verifyPassword } from './bcryptUtils';
import { MongoResource, Resource, authenticationUser } from '@/types/types';

const uri = process.env.MAIN_DB_URI as string;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

// create a database connection pool
let cachedDb: any = null;

export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    await client.connect();
    const db = client.db('costudy');
    cachedDb = db;
    return db;
  } catch (error) {
    console.log(error);
    throw new Error('Could not connect to database');
  }
};

export const verifyUser = async (
  email: string | undefined,
  password: string | undefined
): Promise<{
  result: boolean;
  user?: authenticationUser;
  error?: string;
}> => {
  if (!email || !password) {
    return {
      result: false,
      error: 'Email and password are required',
    };
  }

  const db = await connectToDatabase();

  const user = await db.collection('authentication').findOne({ email: email });

  if (!user) {
    return { result: false }; // User not found
  }

  const resp = await verifyPassword(password, user?.password);
  if (resp) {
    return {
      result: true,
      user: user,
    };
  }
  return { result: false, error: 'passwordNotMatching' };
};

// export const updateUserAccountStatus = async ({
//   userId,
//   userType,
//   newStatus,
// }) => {
//   const db = await connectToDatabase();

//   await db.collection('authentication').updateOne(
//     { _id: new ObjectId(userId) },
//     {
//       $set: {
//         accountStatus: newStatus,
//       },
//     }
//   );

//   switch (userType) {
//     case 'influencer':
//       await db.collection('influencers').updateOne(
//         { _id: new ObjectId(userId) },
//         {
//           $set: {
//             accountStatus: newStatus,
//           },
//         }
//       );
//       break;
//     case 'client':
//       await db.collection('clients').updateOne(
//         { _id: new ObjectId(userId) },
//         {
//           $set: {
//             accountStatus: newStatus,
//           },
//         }
//       );
//       break;
//     case 'admin':
//       await db.collection('admins').updateOne(
//         { _id: new ObjectId(userId) },
//         {
//           $set: {
//             accountStatus: newStatus,
//           },
//         }
//       );
//       break;
//     default:
//       break;
//   }
// };

// export const getUserDoc = async (userId, userType) => {
//   const db = await connectToDatabase();

//   let user = {};
//   // console.log(userId);

//   switch (userType) {
//     case 'client':
//       user = await db
//         .collection('clients')
//         .findOne({ _id: new ObjectId(userId) });
//       break;
//     case 'influencer':
//       user = await db
//         .collection('influencers')
//         .findOne({ _id: new ObjectId(userId) });
//       break;
//     case 'admin':
//       user = await db
//         .collection('admins')
//         .findOne({ _id: new ObjectId(userId) });
//       break;
//     default:
//       break;
//   }

//   user = {
//     ...user,
//     _id: user._id.toString(),
//     createdAt: '',
//     updatedAt: '',
//   };

//   return user;
// };

// export const changeUserDetails = async (collection, userId, data) => {
//   const db = await connectToDatabase();

//   return await db
//     .collection(collection)
//     .updateOne({ _id: new ObjectId(userId) }, { $set: { ...data } });
// };

// export const changeUserPassword = async (userId, oldPassword, newPassword) => {
//   const db = await connectToDatabase();

//   const user = await db
//     .collection('authentication')
//     .findOne({ _id: new ObjectId(userId) });

//   const result = await verifyPassword(oldPassword, user.password);
//   if (result) {
//     const newHashedPasswrd = await hashPassword(newPassword);
//     return await db
//       .collection('authentication')
//       .updateOne(
//         { _id: new ObjectId(userId) },
//         { $set: { password: newHashedPasswrd, updatedAt: new Date() } }
//       );
//   }

//   throw new Error('Password not matching');
// };

// export const changeUserEmail = async (userId, email) => {
//   const db = await connectToDatabase();

//   const user = await db.collection('authentication').findOne({ email: email });

//   if (user && user._id.toString() !== userId) {
//     throw new Error('Email already exist');
//   }

//   return await db
//     .collection('authentication')
//     .updateOne(
//       { _id: new ObjectId(userId) },
//       { $set: { email: email, updatedAt: new Date() } }
//     );
// };

// export const deleteAccount = async (userId, collection) => {
//   const db = await connectToDatabase();

//   await db
//     .collection('authentication')
//     .deleteOne({ _id: new ObjectId(userId) });
//   await db.collection(collection).deleteOne({ _id: new ObjectId(userId) });
// };

export const verifyEmail = async (email: string) => {
  const db = await connectToDatabase();
  return await db.collection('authentication').findOne({ email: email });
};

export const createUser = async (data: {
  name: string;
  email: string;
  username: string;
  password: string;
}) => {
  const db = await connectToDatabase();
  const { name, username, email, password } = data;

  // verify if email already exists
  const emailExist = await verifyEmail(email);

  if (emailExist) {
    throw new Error('Email already exist');
  }

  const hashedPassword = await hashPassword(password);

  const { insertedId } = await db.collection('authentication').insertOne({
    name,
    email,
    username,
    password: hashedPassword,
    type: 'user',
    profilePicture: '',
    accountStatus: 'active',
    createdAt: new Date(),
    emailVerified: false,
  });
  await db.collection('users').insertOne({
    _id: insertedId,
    name,
    username,
    email,
    type: 'user',
    profilePicture: '',
    createdAt: new Date(),
    accountStatus: 'active',
    emailVerified: false,
  });
};

export const checkUsername = async (username: string) => {
  const db = await connectToDatabase();

  const user = await db
    .collection('influencers')
    .findOne({ username: username });

  if (!user) {
    return true; // User not found
  }

  return false;
};

export const getHomePageResources = async (): Promise<MongoResource[] | []> => {
  const db = await connectToDatabase();

  let resources = await db
    .collection('resources')
    .find({})
    .sort({ createdAt: -1 })
    .skip(0)
    .limit(10)
    .toArray();

  if (resources.length) {
    resources = resources.map((resource: any) => {
      let data;
      data = {
        ...resource,
        id: resource._id.toString(),
      };
      delete data._id;
      return data;
    });
  }

  return resources;
};

export const getResources = async ({
  page,
  keyword,
  major,
  degree,
  year,
}: {
  page: number;
  keyword?: string;
  major?: string;
  degree?: string;
  year?: string;
}): Promise<Resource[] | []> => {
  const db = await connectToDatabase();

  type Query = {
    major?: string;
    degree?: string;
    year?: string;
    $or?: any;
  };
  let query: Query = {};

  if (keyword) {
    query = {
      ...query,
      $or: [
        { title: { $regex: keyword, $options: 'i' } }, // Case-insensitive regex match for name
        { class: { $regex: keyword, $options: 'i' } }, // Case-insensitive regex match for username
        { by: { $regex: keyword, $options: 'i' } }, // Case-insensitive regex match for username
      ],
    };
  }
  if (major) {
    query.major = major;
  }

  if (degree) {
    query.degree = degree;
  }
  if (year) {
    query.year = year;
  }

  let resources = [];
  resources = await db
    .collection('resources')
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * 10)
    .limit(10)
    .toArray();

  if (resources?.length) {
    resources = resources?.map((resource: any) => {
      let data;
      data = {
        ...resource,
        id: resource._id.toString(),
      };
      delete data._id;
      return data;
    });
  }

  return resources;
};
