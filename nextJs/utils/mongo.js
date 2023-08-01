import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { hashPassword, verifyPassword } from "./bcryptUtils";

const uri = process.env.MAIN_DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

// create a database connection pool
let cachedDb = null;

export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    await client.connect();
    const db = client.db("costudy");
    cachedDb = db;
    return db;
  } catch (error) {
    console.log(error);
    throw new Error("Could not connect to database");
  }
};

export const verifyUser = async (email, password) => {
  const db = await connectToDatabase();

  const user = await db.collection("authentication").findOne({ email: email });

  if (!user) {
    return { result: false }; // User not found
  }
  if (user.accountStatus === "suspended") {
    return { result: false, status: "suspended" };
  }
  if (user.accountStatus === "banned") {
    return { result: false, status: "banned" };
  }

  const resp = await verifyPassword(password, user?.password);
  if (resp) {
    return {
      result: true,
      userId: user._id.toString(),
      username: user.username,
      type: user.type,
      name: user.name,
      profilePicture: user.profilePicture,
    };
  }
  return { result: false, passwordNotMatching: true };
};

export const getAllUsers = async ({ page, usersType }) => {
  const db = await connectToDatabase();

  let users = [];
  switch (usersType) {
    case "influencer":
      users = await db
        .collection("influencers")
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * 30)
        .limit(30)
        .toArray();
      break;
    case "client":
      users = await db
        .collection("clients")
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * 30)
        .limit(30)
        .toArray();
      break;
    default:
      break;
  }

  users = users.map((usr) => {
    return {
      ...usr,
      _id: usr._id.toString(),
      createdAt: "",
    };
  });

  return users;
};

export const getFilteredUsers = async ({ keyword, userType }) => {
  const db = await connectToDatabase();

  let users = [];
  switch (userType) {
    case "influencer":
      users = await db
        .collection("influencers")
        .find({ $text: { $search: keyword } })
        .sort({ createdAt: -1 })
        .toArray();
      break;
    case "client":
      users = await db
        .collection("influencers")
        .find({ $text: { $search: keyword } })
        .sort({ createdAt: -1 })
        .toArray();
      break;
    case "admin":
      users = await db
        .collection("admins")
        .find({ $text: { $search: keyword } })
        .sort({ createdAt: -1 })
        .toArray();
      break;
    default:
      break;
  }
  users = users.map((usr) => {
    return {
      ...usr,
      _id: usr._id.toString(),
      createdAt: "",
    };
  });

  return users;
};

export const getAllStaff = async () => {
  const db = await connectToDatabase();

  let staff = await db.collection("admins").find().toArray();

  staff = staff.filter((usr) => usr.role !== "admin");
  staff = staff.map((usr) => {
    return {
      ...usr,
      _id: usr._id.toString(),
      createdAt: "",
    };
  });
  console.log(staff);

  return staff;
};

export const addStaff = async ({ name, email, password, role }) => {
  const db = await connectToDatabase();

  try {
    const HashedPasswrd = await hashPassword(password);
    const { insertedId } = await db.collection("authentication").insertOne({
      name,
      email,
      password: HashedPasswrd,
      role,
      type: "admin",
      profilePicture: "",
      accountStatus: "active",
    });
    await db.collection("admins").insertOne({
      _id: insertedId,
      name,
      email,
      role,
      type: "admin",
      profilePicture: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      accountStatus: "active",
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async ({ userId, userType }) => {
  const db = await connectToDatabase();

  try {
    const result = await db
      .collection("authentication")
      .deleteOne({ _id: new ObjectId(userId) });

    if (!result.deletedCount) {
      throw new Error("User not found in authentication collection");
    }

    switch (userType) {
      case "influencer":
        await db
          .collection("influencers")
          .deleteOne({ _id: new ObjectId(userId) });
        break;
      case "client":
        await db.collection("clients").deleteOne({ _id: new ObjectId(userId) });
        break;
      case "admin":
        await db.collection("admins").deleteOne({ _id: new ObjectId(userId) });
        break;
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserAccountStatus = async ({
  userId,
  userType,
  newStatus,
}) => {
  const db = await connectToDatabase();

  await db.collection("authentication").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        accountStatus: newStatus,
      },
    }
  );

  switch (userType) {
    case "influencer":
      await db.collection("influencers").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            accountStatus: newStatus,
          },
        }
      );
      break;
    case "client":
      await db.collection("clients").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            accountStatus: newStatus,
          },
        }
      );
      break;
    case "admin":
      await db.collection("admins").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            accountStatus: newStatus,
          },
        }
      );
      break;
    default:
      break;
  }
};

export const getUserDoc = async (userId, userType) => {
  const db = await connectToDatabase();

  let user = {};
  // console.log(userId);

  switch (userType) {
    case "client":
      user = await db
        .collection("clients")
        .findOne({ _id: new ObjectId(userId) });
      break;
    case "influencer":
      user = await db
        .collection("influencers")
        .findOne({ _id: new ObjectId(userId) });
      break;
    case "admin":
      user = await db
        .collection("admins")
        .findOne({ _id: new ObjectId(userId) });
      break;
    default:
      break;
  }

  user = {
    ...user,
    _id: user._id.toString(),
    createdAt: "",
    updatedAt: "",
  };

  return user;
};

export const changeUserDetails = async (collection, userId, data) => {
  const db = await connectToDatabase();

  return await db
    .collection(collection)
    .updateOne({ _id: new ObjectId(userId) }, { $set: { ...data } });
};

export const changeUserPassword = async (userId, oldPassword, newPassword) => {
  const db = await connectToDatabase();

  const user = await db
    .collection("authentication")
    .findOne({ _id: new ObjectId(userId) });

  const result = await verifyPassword(oldPassword, user.password);
  if (result) {
    const newHashedPasswrd = await hashPassword(newPassword);
    return await db
      .collection("authentication")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: newHashedPasswrd, updatedAt: new Date() } }
      );
  }

  throw new Error("Password not matching");
};

export const changeUserEmail = async (userId, email) => {
  const db = await connectToDatabase();

  const user = await db.collection("authentication").findOne({ email: email });

  if (user && user._id.toString() !== userId) {
    throw new Error("Email already exist");
  }

  return await db
    .collection("authentication")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { email: email, updatedAt: new Date() } }
    );
};

export const deleteAccount = async (userId, collection) => {
  const db = await connectToDatabase();

  await db
    .collection("authentication")
    .deleteOne({ _id: new ObjectId(userId) });
  await db.collection(collection).deleteOne({ _id: new ObjectId(userId) });
};

export const verifyEmail = async (email) => {
  const db = await connectToDatabase();
  return await db.collection("authentication").findOne({ email: email });
};

export const createUser = async (data) => {
  const db = await connectToDatabase();
  const { name, email, password } = data;

  // verify if email already exists
  const emailExist = await verifyEmail(email);

  if (emailExist) {
    throw new Error("Email already exist");
  }

  const hashedPassword = await hashPassword(password);

  const { insertedId } = await db.collection("authentication").insertOne({
    name,
    email,
    password: hashedPassword,
    type: "user",
    profilePicture: "",
    accountStatus: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await db.collection("users").insertOne({
    _id: insertedId,
    name,
    email,
    type: "user",
    profilePicture: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    accountStatus: "active",
  });

  return {
    userId: insertedId,
  };
};

export const checkUsername = async (username) => {
  const db = await connectToDatabase();

  const user = await db
    .collection("influencers")
    .findOne({ username: username });

  if (!user) {
    return true; // User not found
  }

  return false;
};
