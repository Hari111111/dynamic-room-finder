'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRooms } from '../../hooks/useRooms';
import { AuthDialog } from './AuthDialog';
import { FilterBar } from './FilterBar';
import { HeroSection } from './HeroSection';
import { RoomCard } from './RoomCard';
import { RoomDetails } from './RoomDetails';
import styles from './home.module.css';

export function HomePageClient() {
  const [showAuth, setShowAuth] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    roomType: '',
    occupancy: '',
    maxPrice: '20000',
    featuredOnly: false,
  });
  const { user, logout } = useAuth();
  const { data, selectedRoom, selectedRoomId, setSelectedRoomId, loading, error } = useRooms(filters);

  return (
    <main className={styles.page}>
      <HeroSection
        summary={data?.summary}
        selectedRoom={selectedRoom}
        totalSeats={data?.rooms.reduce((sum, room) => sum + room.seatsLeft, 0) ?? 0}
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
                onSelect={() => setSelectedRoomId(room._id)}
              />
            ))}
          </div>
        </div>

        <aside className={styles.detailPanel}>
          <RoomDetails room={selectedRoom} />
        </aside>
      </section>

      {showAuth ? <AuthDialog onClose={() => setShowAuth(false)} /> : null}
    </main>
  );
}
