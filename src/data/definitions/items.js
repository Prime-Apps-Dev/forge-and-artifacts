// src/data/definitions/items.js
import { ironAgeItems } from './item-parts/01_iron_age_items';
import { copperBronzeAgeItems } from './item-parts/02_copper_bronze_age_items';
import { sparksteelAgeItems } from './item-parts/03_sparksteel_age_items';
import { mithrilAgeItems } from './item-parts/04_mithril_age_items';
import { legendaryAgeItems } from './item-parts/05_legendary_age_items';
import { personnelEquipment } from './item-parts/06_personnel_equipment';
import { playerEquipment } from './item-parts/07_player_equipment'; // НОВЫЙ ИМПОРТ

export const items = {
    ...ironAgeItems,
    ...copperBronzeAgeItems,
    ...sparksteelAgeItems,
    ...mithrilAgeItems,
    ...legendaryAgeItems,
    ...personnelEquipment,
    ...playerEquipment, // НОВОЕ ДОБАВЛЕНИЕ
};