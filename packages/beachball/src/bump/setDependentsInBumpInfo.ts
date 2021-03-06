import { BumpInfo } from '../types/BumpInfo';
/**
 * Gets dependents for all packages
 *
 * Example: "BigApp" deps on "SomeUtil", "BigApp" would be the dependent
 *
 * @param bumpInfo
 */
export function setDependentsInBumpInfo(bumpInfo: BumpInfo): void {
  const { packageInfos, scopedPackages } = bumpInfo;
  const packages = Object.keys(packageInfos);
  const dependents = {};

  packages.forEach(pkgName => {
    if (!scopedPackages.has(pkgName)) {
      return;
    }

    const info = packageInfos[pkgName];
    const depTypes = ['dependencies', 'devDependencies', 'peerDependencies'];
    depTypes.forEach(depType => {
      if (info[depType]) {
        for (let [dep, _] of Object.entries(info[depType])) {
          if (packages.includes(dep)) {
            dependents[dep] = dependents[dep] || [];
            if (!dependents[dep].includes(pkgName)) {
              dependents[dep].push(pkgName);
            }
          }
        }
      }
    });
  });

  bumpInfo.dependents = dependents;
}
