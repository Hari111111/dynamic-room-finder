'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { useRooms } from '../../hooks/useRooms';
import type { AuthUser, Room } from '../../types';
import { AuthDialog } from './AuthDialog';
import { FilterBar } from './FilterBar';
import { HeroSection } from './HeroSection';
import { RoomCard } from './RoomCard';
import { RoomDetails } from './RoomDetails';
import styles from './home.module.css';

export function HomePageClient() {
  const [showAuth, setShowAuth] = useState(false);
  const [savedRooms, setSavedRooms] = useState<Room[]>([]);
  const [wishlistError, setWishlistError] = useState('');
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    roomType: '',
    occupancy: '',
    maxPrice: '20000',
    featuredOnly: false,
  });
  const { token, user, setUser, logout } = useAuth();
  const { data, selectedRoom, selectedRoomId, setSelectedRoomId, loading, error } = useRooms(filters);
  const savedRoomIds = useMemo(() => new Set(user?.savedRoomIds ?? []), [user?.savedRoomIds]);

  useEffect(() => {
    if (!token) {
      setSavedRooms([]);
      return;
    }

    let cancelled = false;
    setWishlistLoading(true);
    setWishlistError('');

    apiRequest<{ rooms: Room[] }>('/api/auth/wishlist', { token })
      .then((response) => {
        if (!cancelled) {
          setSavedRooms(response.rooms);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setWishlistError(
            requestError instanceof Error ? requestError.message : 'Unable to load saved rooms.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setWishlistLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, user?.savedRoomIds]);

  async function handleWishlist(roomId: string) {
    if (!token || !user) {
      setShowAuth(true);
      return;
    }

    const isSaved = savedRoomIds.has(roomId);
    setWishlistError('');

    try {
      const response = await apiRequest<{ user: AuthUser }>(`/api/auth/wishlist/${roomId}`, {
        method: isSaved ? 'DELETE' : 'POST',
        token,
      });

      setUser(response.user);
    } catch (requestError) {
      setWishlistError(
        requestError instanceof Error ? requestError.message : 'Unable to update saved rooms.',
      );
    }
  }

  return (
    <main className={styles.page}>
      <HeroSection
        summary={data?.summary}
        selectedRoom={selectedRoom}
        totalSeats={data?.rooms.reduce((sum, room) => sum + room.seatsLeft, 0) ?? 0}
        savedCount={user ? user.savedRoomIds?.length ?? 0 : 0}
        user={user}
        onOpenAuth={() => setShowAuth(true)}
        onLogout={logout}
      />

      <FilterBar
        filters={filters}
        options={data?.filters}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
      />

      {error ? <p className={styles.bannerError}>{error}</p> : null}
      {wishlistError ? <p className={styles.bannerError}>{wishlistError}</p> : null}

      {user ? (
        <section className={styles.savedPanel}>
          <div className={styles.savedHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Wishlist / Saved rooms</p>
              <h2>{wishlistLoading ? 'Loading saved rooms...' : `${savedRooms.length} rooms saved for later`}</h2>
            </div>
            <p className={styles.sectionHint}>
              Your shortlist stays connected to the same live room inventory.
            </p>
          </div>
          <div className={styles.savedGrid}>
            {savedRooms.length ? (
              savedRooms.map((room) => (
                <RoomCard
                  key={`saved_${room._id}`}
                  room={room}
                  active={selectedRoomId === room._id}
                  saved={savedRoomIds.has(room._id)}
                  onSelect={() => setSelectedRoomId(room._id)}
                  onToggleSave={() => handleWishlist(room._id)}
                />
              ))
            ) : (
              <div className={styles.emptySavedState}>
                Save rooms from the list to build a shortlist you can revisit quickly.
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className={styles.content}>
        <div className={styles.listPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Room list</p>
              <h2>{loading ? 'Loading rooms...' : `${data?.rooms.length ?? 0} rooms match your filters`}</h2>
            </div>
            <div className={styles.resultsMeta}>
              <p className={styles.sectionHint}>
                Dynamic cards with location details, commute notes, and nearby places.
              </p>
              <div className={styles.resultsPills}>
                <span>{filters.city || 'All cities'}</span>
                <span>{filters.roomType || 'All room types'}</span>
                <span>{filters.featuredOnly ? 'Featured only' : 'Mixed listings'}</span>
              </div>
            </div>
          </div>

          <div className={styles.roomGrid}>
            {data?.rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                active={selectedRoomId === room._id}
                saved={savedRoomIds.has(room._id)}
                onSelect={() => setSelectedRoomId(room._id)}
                onToggleSave={() => handleWishlist(room._id)}
              />
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          <RoomDetails
            room={selectedRoom}
            saved={selectedRoom ? savedRoomIds.has(selectedRoom._id) : false}
            onToggleSave={selectedRoom ? () => handleWishlist(selectedRoom._id) : undefined}
          />
        </aside>
      </section>

      {showAuth ? <AuthDialog onClose={() => setShowAuth(false)} /> : null}
    </main>
  );
}
