'use client';

import { create } from 'zustand';

export interface DarkStoreHub {
  id: string;
  city: string;
  region: string;
  postcode: string;
  courier: string;
  speed: string;
  cutoff: string;
}

export const DARK_STORE_HUBS: DarkStoreHub[] = [
  {
    id: 'hub-berlin',
    city: 'Berlin Mitte',
    region: 'Torstraße Atelier',
    postcode: '10115',
    courier: 'DHL Same-Day Express',
    speed: 'Delivery within 2h',
    cutoff: 'Order before 17:00',
  },
  {
    id: 'hub-paris',
    city: 'Paris Le Marais',
    region: 'Rue Saint-Honoré',
    postcode: '75001',
    courier: 'Chronopost White-Glove',
    speed: 'Delivery within 2.5h',
    cutoff: 'Order before 18:30',
  },
  {
    id: 'hub-london',
    city: 'London Mayfair',
    region: 'Bond Street Atelier',
    postcode: 'W1S 1SR',
    courier: 'Royal Mail Special Delivery',
    speed: 'Same-Day Courier',
    cutoff: 'Order before 16:00',
  },
  {
    id: 'hub-milan',
    city: 'Milan Quadrilatero',
    region: 'Via Monte Napoleone',
    postcode: '20121',
    courier: 'Poste Italiane Express',
    speed: 'Same-Day Delivery',
    cutoff: 'Order before 17:30',
  },
  {
    id: 'hub-amsterdam',
    city: 'Amsterdam Grachtengordel',
    region: 'Keizersgracht',
    postcode: '1012',
    courier: 'PostNL Zero-Emission',
    speed: 'Same-Day Bike Courier',
    cutoff: 'Order before 18:00',
  },
];

interface DeliveryGateStore {
  activeHub: DarkStoreHub;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  setActiveHub: (hub: DarkStoreHub) => void;
}

export const useDeliveryGateStore = create<DeliveryGateStore>((set) => ({
  activeHub: DARK_STORE_HUBS[0],
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  setActiveHub: (hub) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nex_delivery_hub', hub.id);
      localStorage.setItem('nex_delivery_location', JSON.stringify(hub));
    }
    set({ activeHub: hub });
  },
}));
