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
  };
};

export type TLike = {
  from: {
    name: string;
    email: string;
  };
  id: string;
};

export type TComment = {
  message: string;
  id: string;
  createdAt: string;
  from: {
    name: string;
    email: string;
  };
  postId: string;
};

export type TNotification = {
  id: string;
  activity: string;
  to: {
    name: string;
    email: string;
  };
  actor: {
    name: string;
    email: string;
  };
  seen: boolean;
};
