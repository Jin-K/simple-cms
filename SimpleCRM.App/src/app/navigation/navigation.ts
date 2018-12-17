import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
  {
    id: 'applications',
    title: 'Applications',
    translate: 'NAV.APPLICATIONS',
    type: 'group',
    children: [
      {
        id: 'dashboards',
        title: 'Dashboards',
        translate: 'NAV.DASHBOARDS',
        type: 'collapsable',
        icon: 'dashboard',
        children: [
          {
            id: 'analytics',
            title: 'Analytics',
            type: 'item',
            url: '/apps/dashboards/analytics'
          }
        ]
      },
      {
        id       : 'chat',
        title    : 'Chat',
        translate: 'NAV.CHAT',
        type     : 'item',
        icon     : 'chat',
        url      : '/apps/chat',
        badge    : {
          title: '13',
          bg   : '#09d261',
          fg   : '#FFFFFF'
        }
      },
    ]
  },
  {
    id: 'entities',
    title: 'Entities',
    translate: 'NAV.ENTITIES.TITLE',
    type: 'group',
    children: [
      {
        id: 'contacts',
        title: 'Contacts',
        translate: 'NAV.ENTITIES.CONTACTS',
        type: 'item',
        icon: 'account_box',
        url: '/entity/contacts'
      },
      {
        id: 'companies',
        title: 'Companies',
        translate: 'NAV.ENTITIES.COMPANIES',
        type: 'item',
        icon: 'business',
        url: '/entity/companies'
      },
      {
        id: 'actions',
        title: 'Actions',
        translate: 'NAV.ENTITIES.ACTIONS',
        type: 'item',
        icon: 'checkbox',
        url: '/entity/actions'
      }
    ]
  }
];
