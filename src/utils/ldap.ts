import {DnComp} from '@/enum/dn-comp.enum';
import {DnSingle} from '@/enum/dn-single.enum';
import {DnSub} from '@/enum/dn-sub.enum';

export function dnChildOf(dnChild: string, dnParent: string): boolean {
  return String(dnChild).endsWith(dnParent);
}

export function extractDnRoles(dn: string) {
  const roles: string[] = [];
  for (const dnSingleKey of Object.keys(DnSingle)) {
    if (dnChildOf(dn, DnSingle[dnSingleKey])) {
      roles.push(dnSingleKey);
    }
  }
  for (const dnCompKey of Object.keys(DnComp)) {
    const dnComp = String(DnComp[dnCompKey]);
    if (dnChildOf(dn, dnComp)) {
      roles.push(dnCompKey);

      for (const dnSubPartKey of Object.keys(DnSub)) {
        const dnSub = String(DnSub[dnSubPartKey]).concat(DnComp[dnCompKey]);
        if (dnChildOf(dn, dnSub)) {
          const dnSubKey = String(dnCompKey).concat('_').concat(dnSubPartKey);
          roles.push(dnSubKey);
        }
      }
    }
  }
  return roles;
}
