import {DnComp} from '@/enum/dn-comp.enum';
import {DnSingle} from '@/enum/dn-single.enum';
import {DnSub} from '@/enum/dn-sub.enum';

export class DnUtil {
  static childOf(dnChild: string, dnParent: string): boolean {
    return String(dnChild).endsWith(dnParent);
  }

  static extractRoles(dn: string): string[] {
    const roles: string[] = [];
    for (const dnSingleKey of Object.keys(DnSingle)) {
      if (this.childOf(dn, DnSingle[dnSingleKey])) {
        roles.push(dnSingleKey);
      }
    }
    for (const dnCompKey of Object.keys(DnComp)) {
      const dnComp = String(DnComp[dnCompKey]);
      if (this.childOf(dn, dnComp)) {
        roles.push(dnCompKey);

        for (const dnSubPartKey of Object.keys(DnSub)) {
          const dnSub = String(DnSub[dnSubPartKey]).concat(DnComp[dnCompKey]);
          if (this.childOf(dn, dnSub)) {
            const dnSubKey = String(dnCompKey).concat('_').concat(dnSubPartKey);
            roles.push(dnSubKey);
          }
        }
      }
    }
    return roles;
  }
}
