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
