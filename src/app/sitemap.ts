import { MetadataRoute } from 'next';
import { propertyService } from '@/services/propertyService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let propertyUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await propertyService.getProperties({ limit: 50 });
    propertyUrls = (res.properties || []).map((p) => ({
      url: `${baseUrl}/properties/${p.slug || p.id}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch {
    // If backend isn't reachable during static generation, return basic routes
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...propertyUrls,
  ];
}

