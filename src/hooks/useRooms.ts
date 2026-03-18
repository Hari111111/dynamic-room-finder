'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api';
import type { Room, RoomsResponse } from '../types';

type FiltersState = {
  search: string;
  city: string;
  roomType: string;
  occupancy: string;
  maxPrice: string;
  featuredOnly: boolean;
};

export function useRooms(filters: FiltersState) {
  const [data, setData] = useState<RoomsResponse | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    let cancelled = false;

    async function loadRooms() {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      if (filters.city) params.set('city', filters.city);
      if (filters.roomType) params.set('roomType', filters.roomType);
      if (filters.occupancy) params.set('occupancy', filters.occupancy);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.featuredOnly) params.set('featured', 'true');
      if (deferredSearch.trim()) params.set('search', deferredSearch.trim());

      try {
        const response = await apiRequest<RoomsResponse>(`/api/rooms?${params.toString()}`);

        if (cancelled) {
          return;
        }

        setData(response);
        setSelectedRoomId((current) =>
          current && response.rooms.some((room) => room._id === current)
            ? current
            : response.rooms[0]?._id ?? '',
        );
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load rooms from the backend.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, [
    filters.city,
    filters.roomType,
    filters.occupancy,
    filters.maxPrice,
    filters.featuredOnly,
    deferredSearch,
  ]);

  const selectedRoom = useMemo<Room | null>(
    () => data?.rooms.find((room) => room._id === selectedRoomId) ?? data?.rooms[0] ?? null,
    [data?.rooms, selectedRoomId],
  );

  return {
    data,
    selectedRoom,
    selectedRoomId,
    setSelectedRoomId,
    loading,
    error,
  };
}
