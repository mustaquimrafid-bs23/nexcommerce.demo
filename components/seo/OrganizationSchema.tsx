import React from 'react';

export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'nexCommerce',
        url: baseUrl,
        logo: `${baseUrl}/assets/images/lifestyle/thumb_tote.jpg`,
        sameAs: [
          'https://twitter.com/nexcommerce',
          'https://instagram.com/nexcommerce',
          'https://linkedin.com/company/nexcommerce',
        ],
        description: 'Curated luxury apparel, architectural tailoring, and personal style intelligence.',
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'nexCommerce',
        description: 'Modern Shopping & Personal Style',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/discovery?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
