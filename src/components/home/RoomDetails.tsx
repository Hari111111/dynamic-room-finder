import styles from './home.module.css';
import type { Room } from '../../types';

type Props = {
  room: Room | null;
};

export function RoomDetails({ room }: Props) {
  if (!room) {
    return <div className={styles.emptyState}>No room selected yet.</div>;
  }

  return (
    <>
      <div className={styles.detailTop}>
        <p className={styles.sectionEyebrow}>Selected room</p>
        <h2>{room.title}</h2>
        <p className={styles.detailAddress}>{room.address}</p>
        <div className={styles.detailMetrics}>
          <span>{room.rating}/5 rating</span>
          <span>{room.reviewCount} reviews</span>
          <span>Available from {room.availableFrom}</span>
        </div>
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
