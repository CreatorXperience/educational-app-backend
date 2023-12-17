type TCourse = {
  category: string;
  author: {
    name: string;
    post: string;
    bio: string;
  };
  topic: Array<{
    description: string;
    youtubeId: string;
    title: string;
    coverImage: string;
  }>;
  courseDescription: string;
  coverImage: string;
  coverTitle: string;
  stars: number;
  image: {
    filename: string;
    contentType: string;
    date?: Date;
  };
};

export type { TCourse };
