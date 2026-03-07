import type { Meta, StoryObj } from '@storybook/react';
import { SettingsModal } from './SettingsModal';

const meta: Meta<typeof SettingsModal> = {
  title: 'Features/SettingsModal',
  component: SettingsModal
};

export default meta;
type Story = StoryObj<typeof SettingsModal>;

export const Open: Story = {
  args: {
    open: true,
    settings: {
      showDebugOverlay: true,
      masterVolume: 0.8
    },
    assets: {
      hatAssetId: 'cap',
      shoesAssetId: 'sneakers'
    },
    keybindings: {
      moveForward: 'KeyW',
      moveBackward: 'KeyS',
      moveLeft: 'KeyA',
      moveRight: 'KeyD',
      toggleEquipment: 'KeyE',
      toggleItems: 'KeyI',
      toggleSettings: 'Backslash'
    },
    listeningAction: null,
    conflicts: [],
    onSettingsChange: () => {},
    onAssetsChange: () => {},
    onCaptureStart: () => {},
    onReset: () => {},
    onApply: () => {},
    onClose: () => {}
  }
};

export const WithLogout: Story = {
  args: {
    ...Open.args,
    onLogout: () => {}
  }
};
