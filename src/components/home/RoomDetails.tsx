import styles from './home.module.css';
import type { Room } from '../../types';

type Props = {
  room: Room | null;
  saved?: boolean;
  onToggleSave?: () => void;
};

export function RoomDetails({ room, saved = false, onToggleSave }: Props) {
  if (!room) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.sectionEyebrow}>Selection panel</p>
        <h3>Pick a room to open the full brief.</h3>
        <p>We'll show pricing, house rules, nearby hotspots, and commute notes here.</p>
      </div>
    );
  }

  const mapQuery = encodeURIComponent(`${room.address}, ${room.locality}, ${room.city}`);
  const embedUrl = `https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <>
      <div className={styles.detailTop}>
        <p className={styles.sectionEyebrow}>Selected room</p>
        {onToggleSave ? (
          <button
            type="button"
            className={saved ? styles.saveButtonActive : styles.saveButton}
            onClick={onToggleSave}
          >
            {saved ? 'Saved to wishlist' : 'Save this room'}
          </button>
        ) : null}
        <h2>{room.title}</h2>
        <p className={styles.detailAddress}>{room.address}</p>
        <div className={styles.detailMetrics}>
          <span>{room.rating}/5 rating</span>
          <span>{room.reviewCount} reviews</span>
          <span>Available from {room.availableFrom}</span>
        </div>
        <p className={styles.detailIntro}>{room.description}</p>
      </div>

      <div className={styles.detailPriceCard}>
        <div>
          <p>Monthly rent</p>
          <strong>Rs. {room.price}</strong>
        </div>
        <div>
          <p>Security deposit</p>
          <strong>Rs. {room.deposit}</strong>
        </div>
        <div>
          <p>Best for</p>
          <strong>{room.gender}</strong>
        </div>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.mapSectionHeader}>
          <div>
            <h3>Area map</h3>
            <p className={styles.sectionHint}>Preview the neighborhood and open the full map for directions.</p>
          </div>
          <a
            className={styles.mapAction}
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open map
          </a>
        </div>
        <div className={styles.mapFrameWrap}>
          <iframe
            title={`${room.title} location map`}
            src={embedUrl}
            className={styles.mapFrame}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3>What is nearby</h3>
        <div className={styles.placeList}>
          {room.nearbyPlaces.map((place) => (
            <article key={place._id ?? place.id ?? place.name} className={styles.placeCard}>
              <div>
                <strong>{place.name}</strong>
                <span>{place.category}</span>
              </div>
              <p>{place.highlight}</p>
              <small>
                {place.distanceKm} km away - {place.walkMinutes} min walk
              </small>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3>Inside the stay</h3>
        <div className={styles.chipList}>
          {room.amenities.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className={styles.detailSplit}>
        <div className={styles.detailSection}>
          <h3>Commute notes</h3>
          <ul>
            {room.transit.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.detailSection}>
          <h3>House rules</h3>
          <ul>
            {room.rules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
