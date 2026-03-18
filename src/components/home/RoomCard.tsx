import Image from 'next/image';
import styles from './home.module.css';
import type { Room } from '../../types';

type Props = {
  room: Room;
  active: boolean;
  onSelect: () => void;
};

export function RoomCard({ room, active, onSelect }: Props) {
  return (
    <button
      type="button"
      className={`${styles.roomCard} ${active ? styles.roomCardActive : ''}`}
      onClick={onSelect}
    >
      <div className={styles.roomImageWrap}>
        <Image
          src={room.image}
          alt={room.title}
          className={styles.roomImage}
          fill
          sizes="(max-width: 800px) 100vw, 220px"
        />
        <span className={styles.roomTag}>{room.heroTag}</span>
      </div>
      <div className={styles.roomMeta}>
        <div className={styles.roomHeadline}>
          <div>
            <h3>{room.title}</h3>
            <p>
              {room.locality}, {room.city}
            </p>
          </div>
          <strong>Rs. {room.price}</strong>
        </div>
        <div className={styles.metaPills}>
          <span>{room.roomType}</span>
          <span>{room.occupancy}</span>
          <span>{room.seatsLeft} seats left</span>
        </div>
        <p className={styles.roomDescription}>{room.description}</p>
        <div className={styles.nearbyPreview}>
          {room.nearbyPlaces.slice(0, 2).map((place) => (
            <article key={place._id ?? place.id ?? place.name}>
              <strong>{place.name}</strong>
              <span>
                {place.category} - {place.distanceKm} km
              </span>
            </article>
          ))}
        </div>
      </div>
    </button>
  );
}
