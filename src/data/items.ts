import i18next from '../i18n';

export interface Item {
  name: string;
  description: string;
  type: 'pokeball' | 'berry' | 'key' | 'use';
  detail: string;
}

export let items: Record<string, Item> = {};

i18next.on('initialized', () => {
  items = {
    '000': {
      name: '',
      description: '',
      type: 'use',
      detail: '',
    },
    '001': {
      name: i18next.t('item:masterball.name'),
      description: i18next.t('item:masterball.description'),
      type: 'pokeball',
      detail: '',
    },
    '002': {
      name: i18next.t('item:pokeball.name'),
      description: i18next.t('item:pokeball.description'),
      type: 'pokeball',
      detail: '',
    },
    '003': {
      name: i18next.t('item:greatball.name'),
      description: i18next.t('item:greatball.description'),
      type: 'pokeball',
      detail: '',
    },
    '004': {
      name: i18next.t('item:ultraball.name'),
      description: i18next.t('item:ultraball.description'),
      type: 'pokeball',
      detail: '',
    },
    '005': {
      name: i18next.t('item:bicycle.name'),
      description: i18next.t('item:bicycle.description'),
      type: 'key',
      detail: 'ride',
    },
  };
});

export function getItem(key: string): Item | null {
  return items[key] || null;
}

export function getItemType(key: string): string | null {
  const targetItemInfo = getItem(key);
  const type = targetItemInfo?.type;

  switch (type) {
    case 'key':
      if (targetItemInfo?.detail) return targetItemInfo.detail;
      break;
  }

  return null;
}
