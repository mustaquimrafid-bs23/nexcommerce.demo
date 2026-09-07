import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { MASTER_PRODUCTS } from '@/data/products';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = MASTER_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested piece is currently unavailable in our collection.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullImageUrl = product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | ${product.brand || 'ARC'}`,
    description: product.description,
    alternates: {
      canonical: `/product/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | ${product.brand || 'ARC'} — nexCommerce`,
      description: product.description,
      url: `/product/${product.id}`,
      siteName: 'nexCommerce',
      images: [
        {
          url: fullImageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
        ...previousImages,
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${product.brand || 'ARC'} — nexCommerce`,
      description: product.description,
      images: [fullImageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = MASTER_PRODUCTS.find((p) => p.id === id) || MASTER_PRODUCTS[0];

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/category' },
    { name: product.name, url: `/product/${product.id}` },
  ];

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductDetailClient product={product} />
    </>
  );
}
