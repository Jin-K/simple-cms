import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
          {
            id       : 'dashboards',
            title    : 'Dashboards',
            translate: 'NAV.DASHBOARDS',
            type     : 'collapsable',
            icon     : 'dashboard',
            children : [
              {
                id   : 'analytics',
                title: 'Analytics',
                type : 'item',
                url  : '/apps/dashboards/analytics'
              },
              {
                id   : 'project',
                title: 'Project',
                type : 'item',
                url  : '/apps/dashboards/project'
              }
            ]
          },
          {
            id       : 'mail-ngrx',
            title    : 'Mail Ngrx',
            translate: 'NAV.MAIL_NGRX.TITLE',
            type     : 'item',
            icon     : 'email',
            url      : '/apps/mail-ngrx',
            badge    : {
              title    : '13',
              translate: 'NAV.MAIL_NGRX.BADGE',
              bg       : '#EC0C8E',
              fg       : '#FFFFFF'
            }
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
          {
            id       : 'news',
            title    : 'News',
            translate: 'NAV.NEWS',
            type     : 'item',
            // TODO Change ?
            // icon     : 'import_contacts',
            // icon     : 'library_books',
            // icon     : 'receipt',
            icon     : 'subject',
            url      : '/apps/news',
            badge    : {
              title: '25',
              bg   : '#F44336',
              fg   : '#FFFFFF'
            }
          },
        ]
    },
    {
        id        : 'entities',
        title     : 'Entities',
        translate : 'NAV.ENTITIES.TITLE',
        type      : 'group',
        children  : [
          {
            id        : 'contacts',
            title     : 'Contacts',
            translate : 'NAV.ENTITIES.CONTACTS',
            type      : 'item',
            icon      : 'account_box',
            url       : '/entity/contacts'
          },
          {
            id        : 'companies',
            title     : 'Companies',
            translate : 'NAV.ENTITIES.COMPANIES',
            type      : 'item',
            icon      : 'business',
            // icon      : 'domain',
            url       : '/entity/companies'
          },
          {
            id        : 'actions',
            title     : 'Actions',
            translate : 'NAV.ENTITIES.ACTIONS',
            type      : 'item',
            // icon      : 'list',
            icon      : 'checkbox',
            url       : '/entity/actions'
          }
        ]
    }
];
