import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { siteMetadata } from '@/data/site-metadata';
import { CoreContent } from '@/lib/utils/contentlayer';
import type { Authors, Blog } from 'contentlayer/generated';
import { tags } from '@/data/tags';

import type { BlogPosting, ImageObject, Person } from 'schema-dts';

interface CommonSEOProps {
  title: string;
  description: string;
  ogType: string;
  ogImage: string | ImageObject[];
  twImage: string;
  canonicalUrl?: string;
}

const CommonSEO = ({
  title,
  description,
  ogType,
  ogImage,
  twImage,
  canonicalUrl,
}: CommonSEOProps) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={description} />
        <meta property="og:url" content={`${siteMetadata.siteUrl}${router.asPath}`} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={siteMetadata.title} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        {Array.isArray(ogImage) ? (
          ogImage.map(({ url }) => <meta property="og:image" content={`${url}`} key={`${url}`} />)
        ) : (
          <meta property="og:image" content={ogImage} key={ogImage} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tailscale" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={twImage} />

        <link
          rel="canonical"
          href={canonicalUrl ? canonicalUrl : `${siteMetadata.siteUrl}${router.asPath}`}
        />
      </Head>
    </>
  );
};

interface PageSEOProps {
  title: string;
  description: string;
  image?: string;
}

export const PageSEO = ({ title, description, image }: PageSEOProps) => {
  const socialImagePath = image ? image : siteMetadata.socialBanner;
  const ogImageUrl = socialImagePath.includes('http')
    ? socialImagePath
    : siteMetadata.siteUrl + socialImagePath;
  const twImageUrl = ogImageUrl;
  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={ogImageUrl}
      twImage={twImageUrl}
    />
  );
};

export const TagSEO = ({ title, description }: PageSEOProps) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const router = useRouter();
  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={ogImageUrl}
        twImage={twImageUrl}
      />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${siteMetadata.siteUrl}${router.asPath}/feed.xml`}
        />
      </Head>
    </>
  );
};

interface BlogSeoProps extends CoreContent<Blog> {
  authorDetails?: CoreContent<Authors>[];
  url: string;
}

export const BlogSEO = (b: BlogSeoProps) => {
  const publishedAt = new Date(b.date).toISOString();
  const modifiedAt = new Date(b.lastmod || b.date).toISOString();
  let images: string[] = [];

  switch (true) {
    case typeof b.images === 'string':
      images = [b.images.includes('http') ? `${b.images}` : siteMetadata.siteUrl + b.images];
    case Array.isArray(b.images):
      images = b.images.map((i) => (i.includes('http') ? i : siteMetadata.siteUrl + i));
  }

  if (images.length === 0) {
    images = [siteMetadata.siteUrl + siteMetadata.socialBanner];
  }

  const ogImages: ImageObject[] = images?.map((url) => ({
    '@type': 'ImageObject',
    url,
  }));

  const ogAuthors: Person[] = b.authorDetails?.map((author) => ({
    '@type': 'Person',
    name: author.name,
  }));

  // https://schema.org/BlogPosting
  const structuredData: BlogPosting = {
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': b.url,
    },
    headline: b.title,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    description: b.summary,

    // https://schema.org/ImageObject
    image: ogImages,

    //https://schema.org/Person
    author: ogAuthors,
  };

  return (
    <>
      <CommonSEO
        title={b.title}
        description={b.summary}
        ogType="article"
        ogImage={ogImages}
        twImage={images[0]}
        canonicalUrl={b.canonicalUrl}
      />
      <Head>
        {/* Open Graph */}
        {/* https://ogp.me/#no_vertical */}
        {b.date && <meta property="article:published_time" content={publishedAt} />}
        {b.lastmod && <meta property="article:modified_time" content={modifiedAt} />}

        {/* schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />

        {/* Elastic Site Search */}
        <meta className="elastic" name="type" content="article" />
        <meta className="elastic" name="slug" content={b.slug} />
        <meta className="elastic" name="published_time" content={publishedAt} />
        {b.tags?.map((tag) => (
          <meta key={tag} className="elastic" name="tags" content={tags[tag] ? tags[tag] : tag} />
        ))}

        {b.authorDetails?.map((author) => (
          <meta key={author.name} className="elastic" name="authors" content={author.name} />
        ))}
      </Head>
    </>
  );
};
