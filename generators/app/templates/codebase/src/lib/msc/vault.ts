import { DTOType, VaultRecord } from './type';

type VaultKey = Function | DTOType;

const vault = new Map<VaultKey, VaultRecord>();

export const getVaultFor = (key: VaultKey): VaultRecord => {
    if (!vault.has(key)) {
        vault.set(key, {});
    }

    return vault.get(key) as VaultRecord;
};

export const hasVaultFor = (obj: VaultKey): boolean => vault.has(obj);

export const getVault = () => vault;
