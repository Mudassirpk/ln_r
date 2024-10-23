export type TPost = {
  likes: TLike[];
  comments: TComment[];
  message: string;
  id: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
    id: string;
    profile_pic?: TPostImage;
    followers: {
      id: string;
      followingUserId: string;
    }[];
  };
  image?: TPostImage;
};

export type TLike = {
  from: {
    name: string;
    email: string;
  };
  id: string;
};

export type TPostImage = {
  url: string;
  id: string;
  public_id: string;
};

export type TComment = {
  message: string;
  id: string;
  createdAt: string;
  from: {
    id: string;
    name: string;
    email: string;
  };
  postId: string;
};

export type TNotification = {
  id: string;
  activity: string;
  to: {
    id: string;
    name: string;
    email: string;
  };
  actor: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  seen: boolean;
};

export type TUser = {
  name: string;
  email: string;
  createdAt: string;
  posts: number;
  followers: TFollower[];
  following: TFollower[];
  profile_pic?: TPostImage;
};
export type TFollowStatus = "ACCEPTED" | "REJECTED" | "PENDING";
export type TFollower = {
  status: TFollowStatus;
  id: string;
  followedUser: {
    name: string;
    id: string;
    email: string;
  };
  followingUser: {
    name: string;
    id: string;
    email: string;
  };
  createdAt: string;
};
