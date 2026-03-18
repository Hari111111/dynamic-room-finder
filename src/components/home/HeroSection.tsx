import styles from './home.module.css';
import type { AuthUser, Room, RoomsResponse } from '../../types';

type Props = {
  summary?: RoomsResponse['summary'];
  selectedRoom: Room | null;
  totalSeats: number;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
};

export function HeroSection({
  summary,
  selectedRoom,
  totalSeats,
  user,
  onOpenAuth,
  onLogout,
}: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <div className={styles.topBar}>
          <div>
            <p className={styles.eyebrow}>Dynamic room finder</p>
            <h1>Find the right room with commute, nearby shops, and live availability.</h1>
          </div>
          <div className={styles.authState}>
            {user ? (
              <>
                <div className={styles.userChip}>
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>
                <button className={styles.secondaryAction} type="button" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className={styles.primaryAction} type="button" onClick={onOpenAuth}>
                Login / Signup
              </button>
            )}
          </div>
        </div>
        <p className={styles.heroText}>
          Explore furnished rooms, compare locality vibes, check famous places nearby, and track
          listings your admin team updates directly from MongoDB.
        </p>
        <div className={styles.heroStats}>
          <article>
            <strong>{summary?.totalRooms ?? 0}</strong>
            <span>Live listings</span>
          </article>
          <article>
            <strong>{summary?.cities.length ?? 0}</strong>
            <span>Active cities</span>
          </article>
          <article>
            <strong>Rs. {summary?.avgPrice ?? 0}</strong>
            <span>Average monthly rent</span>
          </article>
        </div>
      </div>

      <div className={styles.spotlightCard}>
        <div className={styles.spotlightHeader}>
          <span>Availability radar</span>
          <strong>{selectedRoom?.heroTag ?? 'Live updates from admin'}</strong>
        </div>
        <div className={styles.spotlightBody}>
          <div>
            <p>Featured rooms</p>
            <strong>{summary?.featuredRooms ?? 0}</strong>
          </div>
          <div>
            <p>Average rating</p>
            <strong>{summary?.avgRating ?? 0}/5</strong>
          </div>
          <div>
            <p>Open seats</p>
            <strong>{totalSeats}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
