import {DnComp, DnSingle, DnSub} from '@/enum/dn';

const dns: Record<string, string> = {};
for (const dnSingleKey of Object.keys(DnSingle)) {
  dns[dnSingleKey] = DnSingle[dnSingleKey];
}
for (const dnCompKey of Object.keys(DnComp)) {
  for (const dnSubKey of Object.keys(DnSub)) {
    dns[`${dnCompKey}_${dnSubKey}`] = `${DnComp[dnCompKey]}_${DnSub[dnSubKey]}`;
  }
  dns[dnCompKey] = DnComp[dnCompKey];
}

function dnChildOf(dnChild: string, dnParent: string): boolean {
  return String(dnChild).endsWith(dnParent);
}

export function extractDnRoles(dn: string): string[] {
  const roles: string[] = [];
  for (const dnKey of Object.keys(dns)) {
    if (dnChildOf(dn, dns[dnKey])) {
      roles.push(dnKey);
    }
  }
  return roles;
}
