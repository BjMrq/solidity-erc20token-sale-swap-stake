export type Meta = {
  title: string;
  description: string;
};

export type SiteData<M = Meta> = {
  site: {
    siteMetadata: M;
  };
};
