export type TPost = {
  likes: TLike[];
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
