// src/data/definitions/regions.js

export const regions = {
  iron_hills: {
    id: 'iron_hills',
    name: 'Железные Холмы',
    description: 'Стартовый регион, сбалансированный по ресурсам и спросу. Идеальное место, чтобы освоить азы ремесла.',
    modifiers: {
      miningSpeed: {
        ironOre: 1.0,
        copperOre: 1.0,
        mithrilOre: 0.8,
        adamantiteOre: 0.7
      },
      marketDemand: {
        ironOre: 1.0,
        copperOre: 1.0,
        mithrilOre: 1.0,
        adamantiteOre: 1.0,
        ironIngots: 1.0,
        copperIngots: 1.0,
        bronzeIngots: 1.0,
        sparksteelIngots: 1.0,
        mithrilIngots: 1.0,
        adamantiteIngots: 1.0,
        arcaniteIngots: 1.0,
        tools: 1.2,
        weapons: 1.1,
        armor: 1.0,
        jewelry: 0.7
      }
    },
    initialBonuses: {
      sparks: 0,
      matter: 0,
      ironOre: 10,
      copperOre: 0,
      ironIngots: 0
    },
    unlockConditions: []
  },

  golden_harbor: {
    id: 'golden_harbor',
    name: 'Золотая Гавань',
    description: 'Богатый портовый город. Руды здесь мало, но спрос на роскошь огромен. Идеально для ювелиров и торговцев.',
    modifiers: {
      miningSpeed: {
        ironOre: 0.6,
        copperOre: 0.7,
        mithrilOre: 0.5,
        adamantiteOre: 0.4
      },
      marketDemand: {
        ironOre: 0.8,
        copperOre: 0.9,
        mithrilOre: 0.7,
        adamantiteOre: 0.6,
        ironIngots: 0.8,
        copperIngots: 0.9,
        bronzeIngots: 1.0,
        sparksteelIngots: 1.2,
        mithrilIngots: 1.5,
        adamantiteIngots: 1.8,
        arcaniteIngots: 2.0,
        tools: 0.5,
        weapons: 0.8,
        armor: 0.7,
        jewelry: 2.0
      }
    },
    initialBonuses: {
      sparks: 500,
      matter: 50,
      ironOre: 5,
      copperOre: 5,
      ironIngots: 1
    },
    unlockConditions: [
      { type: 'prestigePoints', value: 100 },
      { type: 'regionsVisited', regionId: 'iron_hills' }
    ]
  },

  northern_wastes: {
    id: 'northern_wastes',
    name: 'Северные Пустоши',
    description: 'Суровый край, богатый редкими рудами, но с минимальным спросом на обычные товары. Для тех, кто ищет вызов и новые горизонты.',
    modifiers: {
      miningSpeed: {
        ironOre: 0.7,
        copperOre: 0.6,
        mithrilOre: 1.5,
        adamantiteOre: 1.8
      },
      marketDemand: {
        ironOre: 0.6,
        copperOre: 0.7,
        mithrilOre: 1.8,
        adamantiteOre: 2.0,
        ironIngots: 0.5,
        copperIngots: 0.6,
        bronzeIngots: 0.7,
        sparksteelIngots: 0.8,
        mithrilIngots: 1.5,
        adamantiteIngots: 1.7,
        arcaniteIngots: 1.9,
        tools: 1.0,
        weapons: 1.3,
        armor: 1.5,
        jewelry: 0.3
      }
    },
    initialBonuses: {
      sparks: 0,
      matter: 100,
      ironOre: 0,
      copperOre: 0,
      ironIngots: 0
    },
    unlockConditions: [
      { type: 'prestigePoints', value: 500 },
      { type: 'regionsVisited', regionId: 'golden_harbor' }
    ]
  }
};