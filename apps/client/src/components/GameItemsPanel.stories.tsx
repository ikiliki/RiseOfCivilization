import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { GameItemsPanel, type CosmeticInventoryItem } from './GameItemsPanel';

const meta: Meta<typeof GameItemsPanel> = {
  title: 'Game/GameItemsPanel',
  component: GameItemsPanel,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#0a1220' }] }
  }
};

export default meta;

type Story = StoryObj<typeof GameItemsPanel>;

const ALL_ITEMS: CosmeticInventoryItem[] = [
  { id: 'cap', name: 'Blue Cap', slot: 'hat', assetId: 'cap', rarity: 'common' },
  { id: 'crown', name: 'Royal Crown', slot: 'hat', assetId: 'crown', rarity: 'epic' },
  { id: 'sneakers', name: 'White Sneakers', slot: 'shoes', assetId: 'sneakers', rarity: 'common' },
  { id: 'boots', name: 'Traveler Boots', slot: 'shoes', assetId: 'boots', rarity: 'rare' }
];

function PanelWithState() {
  const [open, setOpen] = useState(true);
  const [equipped, setEquipped] = useState({ hatAssetId: 'cap', shoesAssetId: 'sneakers' });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={{ marginBottom: 8 }}>
        Open Items
      </button>
      <GameItemsPanel
        open={open}
        items={ALL_ITEMS}
        equipped={equipped}
        onEquip={(item) =>
          setEquipped((prev) =>
            item.slot === 'hat'
              ? { ...prev, hatAssetId: item.assetId }
              : { ...prev, shoesAssetId: item.assetId }
          )
        }
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <PanelWithState />
};
