import type { Schema, Struct } from '@strapi/strapi';

export interface OrdersModificator extends Struct.ComponentSchema {
  collectionName: 'components_orders_modificators';
  info: {
    description: '';
    displayName: 'Modificator';
  };
  attributes: {
    count: Schema.Attribute.Integer;
    modificator_id: Schema.Attribute.Integer;
  };
}

export interface OrdersOrderItems extends Struct.ComponentSchema {
  collectionName: 'components_orders_order_items';
  info: {
    description: '';
    displayName: 'Order Items';
  };
  attributes: {
    category_id: Schema.Attribute.String;
    count: Schema.Attribute.Integer;
    modificators: Schema.Attribute.Component<'orders.modificator', true>;
    product_id: Schema.Attribute.String;
  };
}

export interface OrdersWorkModification extends Struct.ComponentSchema {
  collectionName: 'components_orders_work_modifications';
  info: {
    description: '';
    displayName: 'Work Modification';
  };
  attributes: {
    value: Schema.Attribute.String;
  };
}

export interface SettingsServiceSchedule extends Struct.ComponentSchema {
  collectionName: 'components_settings_service_schedules';
  info: {
    displayName: 'Service Schedule';
    icon: 'cog';
  };
  attributes: {
    day: Schema.Attribute.Enumeration<
      [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]
    >;
    slots: Schema.Attribute.Component<'settings.slots', true>;
  };
}

export interface SettingsSlots extends Struct.ComponentSchema {
  collectionName: 'components_settings_slots';
  info: {
    displayName: 'Slots';
    icon: 'cog';
  };
  attributes: {
    finisHour: Schema.Attribute.Time;
    startHour: Schema.Attribute.Time;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'orders.modificator': OrdersModificator;
      'orders.order-items': OrdersOrderItems;
      'orders.work-modification': OrdersWorkModification;
      'settings.service-schedule': SettingsServiceSchedule;
      'settings.slots': SettingsSlots;
    }
  }
}
