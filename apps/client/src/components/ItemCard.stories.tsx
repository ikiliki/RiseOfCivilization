import type { Meta, StoryObj } from '@storybook/react';
import { ItemCard, type CosmeticInventoryItem } from './ItemCard';

const meta: Meta<typeof ItemCard> = {
  title: 'Game/ItemCard',
  component: ItemCard,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#0a1220' }] }
  }
};

export default meta;

type Story = StoryObj<typeof ItemCard>;

const BLUE_CAP: CosmeticInventoryItem = {
  id: 'cap',
  name: 'Blue Cap',
  slot: 'hat',
  assetId: 'cap',
  rarity: 'common'
};

const ROYAL_CROWN: CosmeticInventoryItem = {
  id: 'crown',
  name: 'Royal Crown',
  slot: 'hat',
  assetId: 'crown',
  rarity: 'epic'
};

const WHITE_SNEAKERS: CosmeticInventoryItem = {
  id: 'sneakers',
  name: 'White Sneakers',
  slot: 'shoes',
  assetId: 'sneakers',
  rarity: 'common'
};

const TRAVELER_BOOTS: CosmeticInventoryItem = {
  id: 'boots',
  name: 'Traveler Boots',
  slot: 'shoes',
  assetId: 'boots',
  rarity: 'rare'
};

export const BlueCap: Story = {
  args: { item: BLUE_CAP }
};

export const BlueCapEquipped: Story = {
  args: { item: BLUE_CAP, equipped: true }
};

export const RoyalCrown: Story = {
  args: { item: ROYAL_CROWN }
};

export const RoyalCrownEquipped: Story = {
  args: { item: ROYAL_CROWN, equipped: true }
};

export const WhiteSneakers: Story = {
  args: { item: WHITE_SNEAKERS }
};

export const WhiteSneakersEquipped: Story = {
  args: { item: WHITE_SNEAKERS, equipped: true }
};

export const TravelerBoots: Story = {
  args: { item: TRAVELER_BOOTS }
};

export const TravelerBootsEquipped: Story = {
  args: { item: TRAVELER_BOOTS, equipped: true }
};

export const AllItems: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <ItemCard item={BLUE_CAP} />
      <ItemCard item={ROYAL_CROWN} equipped />
      <ItemCard item={WHITE_SNEAKERS} />
      <ItemCard item={TRAVELER_BOOTS} equipped />
    </div>
  )
};
