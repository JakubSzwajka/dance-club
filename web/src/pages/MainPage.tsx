import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../lib/api/config';

type DanceClass = {
  id: number;
  name: string;
  description: string;
  instructor_id: number;
  level: string;
  capacity: number;
  price: number;
  start_time: string;
  end_time: string;
};

export function MainPage() {
  const { data: classes, isLoading, error } = useQuery<DanceClass[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/classes`);
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading dance classes</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to MyDanceClub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes?.map((danceClass) => (
          <div key={danceClass.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{danceClass.name}</h2>
              <p className="text-gray-600 mb-4">{danceClass.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {danceClass.level}
                </span>
                <span className="text-lg font-bold">${danceClass.price}</span>
              </div>
              <div className="text-sm text-gray-500">
                <p>Capacity: {danceClass.capacity}</p>
                <p>Start: {new Date(danceClass.start_time).toLocaleString()}</p>
                <p>End: {new Date(danceClass.end_time).toLocaleString()}</p>
              </div>
              <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
