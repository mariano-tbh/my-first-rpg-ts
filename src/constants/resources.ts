const resourcesPath = '/resources'

export type Resource = keyof typeof Resource;

export const Resource = {
  sky: `${resourcesPath}/sky.png`,
  ground: `${resourcesPath}/ground.png`,
  hero: `${resourcesPath}/hero-sheet.png`,
  shadow: `${resourcesPath}/shadow.png`,
  rod: `${resourcesPath}/rod.png`,
} as const;
