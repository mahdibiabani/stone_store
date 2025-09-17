import { useState, useEffect } from 'react';
import { Stone } from '../types';
import { api, ApiStone, ApiProject } from '../services/api';

// Transform API stone to frontend stone format
const transformApiStone = (apiStone: ApiStone): Stone => ({
  id: apiStone.id.toString(),
  name: {
    en: apiStone.name_en,
    fa: apiStone.name_fa
  },
  category: {
    en: apiStone.category.name_en,
    fa: apiStone.category.name_fa
  },
  description: {
    en: apiStone.description_en,
    fa: apiStone.description_fa
  },
  price: apiStone.price || '$85',
  images: apiStone.images.map(img => img.image),
  videos: apiStone.videos?.map(vid => vid.video) || [],
  origin: apiStone.origin || 'Iran',
  finishes: apiStone.finishes,
  thickness: apiStone.thickness_options,
  applications: [], // This would need to be added to the backend model
  specifications: {}, // This would need to be added to the backend model
  technicalData: {
    density: 'N/A',
    porosity: 'N/A',
    compressiveStrength: 'N/A',
    flexuralStrength: 'N/A'
  }
});

// Transform API project to frontend project format
const transformApiProject = (apiProject: ApiProject): Project => ({
  id: apiProject.id,
  title: {
    en: apiProject.title_en,
    fa: apiProject.title_fa
  },
  description: {
    en: apiProject.description_en,
    fa: apiProject.description_fa
  },
  location: {
    en: apiProject.location_en,
    fa: apiProject.location_fa
  },
  year: apiProject.year,
  category: {
    en: apiProject.category_en,
    fa: apiProject.category_fa
  },
  stones: apiProject.project_stones.map(ps => ps.stone.name_en),
  image: apiProject.images[0]?.image || '',
  gallery: apiProject.images.map(img => img.image),
  video: apiProject.videos?.[0]?.video,
  client: apiProject.client_en && apiProject.client_fa ? {
    en: apiProject.client_en,
    fa: apiProject.client_fa
  } : undefined,
  size: apiProject.size_en && apiProject.size_fa ? {
    en: apiProject.size_en,
    fa: apiProject.size_fa
  } : undefined,
  duration: apiProject.duration_en && apiProject.duration_fa ? {
    en: apiProject.duration_en,
    fa: apiProject.duration_fa
  } : undefined,
  challenges: apiProject.challenges_en && apiProject.challenges_fa ? {
    en: apiProject.challenges_en,
    fa: apiProject.challenges_fa
  } : undefined,
  solutions: apiProject.solutions_en && apiProject.solutions_fa ? {
    en: apiProject.solutions_en,
    fa: apiProject.solutions_fa
  } : undefined
});

export interface Project {
  id: number;
  title: {
    en: string;
    fa: string;
  };
  description: {
    en: string;
    fa: string;
  };
  location: {
    en: string;
    fa: string;
  };
  year: string;
  category: {
    en: string;
    fa: string;
  };
  stones: string[];
  image: string;
  gallery?: string[];
  video?: string;
  client?: {
    en: string;
    fa: string;
  };
  size?: {
    en: string;
    fa: string;
  };
  duration?: {
    en: string;
    fa: string;
  };
  challenges?: {
    en: string;
    fa: string;
  };
  solutions?: {
    en: string;
    fa: string;
  };
}

export const useStone = (id: string) => {
  const [stone, setStone] = useState<Stone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStone = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiStone = await api.stones.getById(parseInt(id));
        setStone(transformApiStone(apiStone));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stone');
        setStone(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStone();
    }
  }, [id]);

  return { stone, loading, error };
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProject = await api.projects.getById(parseInt(id));
        setProject(transformApiProject(apiProject));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  return { project, loading, error };
};

export const useStones = () => {
  const [stones, setStones] = useState<Stone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStones = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiStones = await api.stones.getAll();
        setStones(apiStones.map(transformApiStone));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stones');
      } finally {
        setLoading(false);
      }
    };

    fetchStones();
  }, []);

  return { stones, loading, error };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProjects = await api.projects.getAll();
        setProjects(apiProjects.map(transformApiProject));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

export const useFeaturedStones = () => {
  const [stones, setStones] = useState<Stone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedStones = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiStones = await api.stones.getFeatured();
        setStones(apiStones.map(transformApiStone));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured stones');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStones();
  }, []);

  return { stones, loading, error };
};

export const useFeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProjects = await api.projects.getFeatured();
        setProjects(apiProjects.map(transformApiProject));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured projects');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return { projects, loading, error };
};

// Legacy functions for backward compatibility
export const getAllStones = () => {
  console.warn('getAllStones is deprecated, use useStones hook instead');
  return [];
};

export const getAllProjects = () => {
  console.warn('getAllProjects is deprecated, use useProjects hook instead');
  return [];
};
